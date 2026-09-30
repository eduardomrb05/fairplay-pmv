import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EmpresaApi, buscarEmpresaPorId } from "@/src/services/authApi";
import { styles } from "../../src/styles/adm-perfil-empresas.styles";

export default function AdmPerfilEmpresas() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [empresa, setEmpresa] = useState<EmpresaApi | null>(null);
  const [loading, setLoading] = useState(true);

  function voltarParaEmpresas() {
    router.replace("/adm-empresas");
  }

  useEffect(() => {
    async function carregarEmpresa() {
      try {
        setLoading(true);

        const empresaId = Number(Array.isArray(id) ? id[0] : id);

        if (!Number.isFinite(empresaId)) {
          Alert.alert("Erro", "ID da empresa inválido.");
          voltarParaEmpresas();
          return;
        }

        const data = await buscarEmpresaPorId(empresaId);
        setEmpresa(data);
      } catch (error) {
        console.log("ERRO AO CARREGAR EMPRESA:", error);
        Alert.alert("Erro", "Não foi possível carregar a empresa.");
        voltarParaEmpresas();
      } finally {
        setLoading(false);
      }
    }

    carregarEmpresa();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!empresa) {
    return (
      <View style={styles.loading}>
        <Text>Empresa não encontrada.</Text>

        <TouchableOpacity onPress={voltarParaEmpresas}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={voltarParaEmpresas}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/Logo FairPlay.png")}
          style={styles.logo}
        />

        <View style={styles.statusButton}>
          <Text style={styles.statusText}>
            {empresa.bloqueado ? "BLOQUEADO" : "STATUS ON"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.text}>
            Nome: <Text style={styles.bold}>{empresa.nome}</Text>
          </Text>

          <Text style={styles.text}>
            E-mail:{" "}
            <Text style={styles.bold}>
              {empresa.email || "Não informado"}
            </Text>
          </Text>

          <Text style={styles.text}>
            CNPJ: <Text style={styles.bold}>{empresa.cnpj}</Text>
          </Text>

          <Text style={styles.text}>
            Telefone: <Text style={styles.bold}>{empresa.telefone}</Text>
          </Text>

          <Text style={styles.text}>
            Rua / Avenida:{" "}
            <Text style={styles.bold}>
              {empresa.rua || "Não informado"}
            </Text>
          </Text>

          <Text style={styles.text}>
            Número:{" "}
            <Text style={styles.bold}>
              {empresa.numero || "Não informado"}
            </Text>
          </Text>

          <Text style={styles.text}>
            Bairro:{" "}
            <Text style={styles.bold}>
              {empresa.bairro || "Não informado"}
            </Text>
          </Text>

          <Text style={styles.text}>
            CEP:{" "}
            <Text style={styles.bold}>
              {empresa.cep || "Não informado"}
            </Text>
          </Text>

          <Text style={styles.text}>
            Cidade:{" "}
            <Text style={styles.bold}>
              {empresa.cidade || "Não informado"}
            </Text>
          </Text>

          <Text style={styles.text}>
            Estado:{" "}
            <Text style={styles.bold}>
              {empresa.estado || "Não informado"}
            </Text>
          </Text>
        </View>

        <View style={styles.photoBox}>
          <Text style={styles.photoIcon}>▣</Text>
          <Text style={styles.photoText}>Editar foto</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>✎ Editar dados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.blueButton}>
        <Text style={styles.buttonText}>▧ Cadastrar quadra</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.yellowButton}>
        <Text style={styles.buttonText}>☷ Lista de quadras</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.redButton}>
        <Text style={styles.buttonText}>🗑 Cancelar Conta</Text>
      </TouchableOpacity>

      <View style={styles.chartBox}>
        <Text style={styles.chartLine}>╱╲╲╱╲╲╱</Text>
        <Text style={styles.chartText}>Gráfico de desempenho</Text>
      </View>

      <TouchableOpacity>
        <Text style={styles.contractText}>▯ Visualizar Contrato</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}