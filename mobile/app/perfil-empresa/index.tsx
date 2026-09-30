import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { TopBar } from "@/src/components/TopBar";
import { SalesChart } from "@/src/components/SalesChart";
import {
  atualizarEmpresa,
  excluirEmpresa,
  type EmpresaApi,
} from "@/src/services/authApi";
import { listarQuadras, type QuadraApi } from "@/src/services/quadrasApi";
import { listarReservas, type ReservaApi } from "@/src/services/reservasApi";
import {
  buscarEmpresaSessao,
  limparEmpresaSessao,
  salvarEmpresaSessao,
} from "@/src/storage/empresaSession";
import { styles } from "@/src/styles/perfil-empresa.styles";

const EMPRESA_FOTO_KEY = "@fairplay:empresa-foto";
const CHART_COLORS = ["#2F7DBA", "#E9A23B", "#3BBFAD"];

function getEmpresaFotoKey(empresaId: number) {
  return `${EMPRESA_FOTO_KEY}:${empresaId}`;
}

function buildSalesChartData(quadrasEmpresa: QuadraApi[], reservasEmpresa: ReservaApi[]) {
  const agora = new Date();
  const meses: { month: number; year: number; label: string }[] = [];

  for (let i = 7; i >= 0; i--) {
    const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    meses.push({
      month: data.getMonth(),
      year: data.getFullYear(),
      label: data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    });
  }

  if (!quadrasEmpresa.length) {
    return {
      labels: meses.map((mes) => mes.label),
      series: [{ nome: "Sem quadras", cor: "#9CA3AF", valores: meses.map(() => 0) }],
    };
  }

  const countByQuadra = new Map<number, number>();
  reservasEmpresa.forEach((reserva) => {
    countByQuadra.set(reserva.quadra_id, (countByQuadra.get(reserva.quadra_id) || 0) + 1);
  });

  const topQuadras = [...quadrasEmpresa]
    .sort((a, b) => (countByQuadra.get(b.id) || 0) - (countByQuadra.get(a.id) || 0))
    .slice(0, 3);

  const series = topQuadras.map((quadra, index) => ({
    nome: quadra.nome,
    cor: CHART_COLORS[index % CHART_COLORS.length],
    valores: meses.map(({ month, year }) =>
      reservasEmpresa.filter((reserva) => {
        if (reserva.quadra_id !== quadra.id) {
          return false;
        }
        const dataReserva = new Date(`${reserva.data}T00:00:00`);
        return dataReserva.getMonth() === month && dataReserva.getFullYear() === year;
      }).length,
    ),
  }));

  return { labels: meses.map((mes) => mes.label), series };
}

export default function PerfilEmpresa() {
  const [empresa, setEmpresa] = useState<EmpresaApi | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [permiteMensalista, setPermiteMensalista] = useState(false);
  const [quadrasEmpresa, setQuadrasEmpresa] = useState<QuadraApi[]>([]);
  const [reservasEmpresa, setReservasEmpresa] = useState<ReservaApi[]>([]);
  const [isUpdatingMensalista, setIsUpdatingMensalista] = useState(false);

  useEffect(() => {
    async function carregarEmpresa() {
      const sessao = await buscarEmpresaSessao();
      if (!sessao) {
        Alert.alert("Sessao expirada", "Faca login novamente como empresa.");
        router.replace("/login-pj");
        return;
      }

      setEmpresa(sessao);
      setPermiteMensalista(Boolean(sessao.permite_mensalista));

      const fotoSalva = await AsyncStorage.getItem(getEmpresaFotoKey(sessao.id));
      if (fotoSalva) {
        setFotoUri(fotoSalva);
      }

      try {
        const [quadras, reservas] = await Promise.all([listarQuadras(), listarReservas()]);
        const minhasQuadras = quadras.filter(
          (quadra) => Number(quadra.empresa_id) === Number(sessao.id),
        );
        const idsQuadras = minhasQuadras.map((quadra) => quadra.id);

        setQuadrasEmpresa(minhasQuadras);
        setReservasEmpresa(reservas.filter((reserva) => idsQuadras.includes(reserva.quadra_id)));
      } catch {
        setQuadrasEmpresa([]);
        setReservasEmpresa([]);
      }
    }

    void carregarEmpresa();
  }, []);

  const salesChartData = useMemo(
    () => buildSalesChartData(quadrasEmpresa, reservasEmpresa),
    [quadrasEmpresa, reservasEmpresa],
  );

  async function handleSair() {
    await limparEmpresaSessao();
    router.replace("/login-pj");
  }

  async function handleAlterarFoto() {
    if (!empresa) {
      return;
    }

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissao", "Permita acesso a galeria para alterar a foto.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (resultado.canceled || !resultado.assets[0]?.uri) {
      return;
    }

    const uri = resultado.assets[0].uri;
    setFotoUri(uri);
    await AsyncStorage.setItem(getEmpresaFotoKey(empresa.id), uri);
  }

  async function handleToggleMensalista() {
    if (!empresa || isUpdatingMensalista) {
      return;
    }

    const novoValor = !permiteMensalista;

    try {
      setIsUpdatingMensalista(true);
      const empresaAtualizada = await atualizarEmpresa(empresa.id, {
        permite_mensalista: novoValor,
      });

      setPermiteMensalista(novoValor);
      const sessaoAtualizada = { ...empresa, ...empresaAtualizada };
      setEmpresa(sessaoAtualizada);
      await salvarEmpresaSessao(sessaoAtualizada);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar opcao de mensalista.";
      Alert.alert("Perfil Empresa", message);
    } finally {
      setIsUpdatingMensalista(false);
    }
  }

  function handleCancelarConta() {
    if (!empresa) {
      return;
    }

    Alert.alert(
      "Cancelar conta",
      "Esta acao e irreversivel. Todas as quadras e dados da empresa serao removidos.",
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Confirmar cancelamento",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirEmpresa(empresa.id, empresa.cnpj);
              await AsyncStorage.removeItem(getEmpresaFotoKey(empresa.id));
              await limparEmpresaSessao();
              Alert.alert("Conta cancelada", "Sua conta de empresa foi removida.");
              router.replace("/login-pj");
            } catch (error) {
              const message = error instanceof Error ? error.message : "Erro ao cancelar conta.";
              Alert.alert("Cancelar conta", message);
            }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.screen}>
      <TopBar
        onBack={() => router.back()}
        enableMenu
        tipoUsuario="pj"
        onLogout={handleSair}
        onNotifications={() => Alert.alert("Notificacoes", "Sem novas notificacoes no momento.")}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil Empresa</Text>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => Alert.alert("Notificacoes", "Sem novas notificacoes no momento.")}
          >
            <Ionicons name="notifications-outline" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Nome: </Text>
              {empresa?.nome || "-"}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>CNPJ: </Text>
              {empresa?.cnpj || "-"}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Telefone: </Text>
              {empresa?.telefone || "-"}
            </Text>
          </View>

          <View style={styles.imageBox}>
            <Image
              source={
                fotoUri
                  ? { uri: fotoUri }
                  : require("../../assets/images/office-building.png")
              }
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editPhotoButton} onPress={handleAlterarFoto}>
              <Text style={styles.editPhotoText}>Editar foto</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editBox}
          onPress={() => router.push("/editar-perfil-empresa")}
        >
          <Text style={styles.editText}>Editar dados</Text>
        </TouchableOpacity>

        <View style={styles.mensalistaCard}>
          <View style={styles.mensalistaInfo}>
            <Text style={styles.mensalistaTitle}>Permitir mensalistas</Text>
            <Text style={styles.mensalistaSubtitle}>
              Quando ativo, suas quadras podem oferecer plano mensalista aos clientes.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleButton, permiteMensalista ? styles.toggleOn : styles.toggleOff]}
            onPress={handleToggleMensalista}
            disabled={isUpdatingMensalista}
          >
            <Text style={styles.toggleText}>{permiteMensalista ? "Ativo" : "Inativo"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnBlue} onPress={() => router.push("/mensagens")}>
          <Text style={styles.btnText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnYellow} onPress={() => router.push("/home-pj")}>
          <Text style={styles.btnText}>Lista de quadras</Text>
        </TouchableOpacity>

        {empresa?.is_admin ? (
          <TouchableOpacity style={styles.btnAdmin} onPress={() => router.push("/adm-principal")}>
            <Text style={styles.btnText}>Painel ADM</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.btnRed} onPress={handleCancelarConta}>
          <Text style={styles.btnText}>Cancelar Conta</Text>
        </TouchableOpacity>

        <Text style={styles.chartTitle}>Quadras mais vendidas</Text>
        <View style={styles.chart}>
          <SalesChart labels={salesChartData.labels} series={salesChartData.series} />
        </View>

        <Text style={styles.link}>Visualizar Contrato</Text>
      </ScrollView>
    </View>
  );
}
