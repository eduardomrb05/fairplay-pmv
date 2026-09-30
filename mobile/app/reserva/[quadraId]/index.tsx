import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { TopBar } from "@/src/components/TopBar";
import { styles } from "@/src/styles/reserva.styles";
import { buscarUsuarioSessao, limparUsuarioSessao } from "@/src/storage/usuarioSession";
import { listarQuadras, type QuadraApi } from "@/src/services/quadrasApi";
import type { UsuarioApi } from "@/src/services/authApi";

type NivelTime = "inicial" | "casual" | "avancado";

export default function ReservaDetalhesScreen() {
  const { quadraId } = useLocalSearchParams<{ quadraId: string }>();

  const [usuario, setUsuario] = useState<UsuarioApi | null>(null);
  const [quadra, setQuadra] = useState<QuadraApi | null>(null);
  const [mensalista, setMensalista] = useState<"sim" | "nao">("nao");
  const [jogadores, setJogadores] = useState("10");
  const [nivel, setNivel] = useState<NivelTime>("casual");

  useEffect(() => {
    async function carregarDados() {
      const sessao = await buscarUsuarioSessao();
      if (!sessao) {
        Alert.alert("Sessao expirada", "Faca login novamente.");
        router.replace("/login-pf");
        return;
      }
      setUsuario(sessao);

      try {
        const quadras = await listarQuadras();
        const atual = quadras.find((item) => String(item.id) === String(quadraId)) || null;
        if (!atual) {
          Alert.alert("Reserva", "Quadra nao encontrada.");
          router.back();
          return;
        }
        setQuadra(atual);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao carregar dados da quadra.";
        Alert.alert("Reserva", message);
      }
    }

    void carregarDados();
  }, [quadraId]);

  const enderecoQuadra = useMemo(() => {
    if (!quadra) {
      return "Endereco nao informado";
    }
    const endereco = [quadra.rua, quadra.numero, quadra.bairro, quadra.cidade]
      .filter((item) => item && item.trim().length > 0)
      .join(", ");
    return endereco || "Endereco nao informado";
  }, [quadra]);

  return (
    <View style={styles.screen}>
      <TopBar
        onBack={() => router.back()}
        enableMenu
        tipoUsuario="pf"
        onLogout={async () => {
          await limparUsuarioSessao();
          router.replace("/escolher-tipo");
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reserva de quadra</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{quadra?.nome || "Carregando..."}</Text>
          <Text style={styles.cardText}>Espaco: {quadra?.empresa_nome || "Nao informado"}</Text>
          <Text style={styles.cardText}>Modalidade: {quadra?.tipo || "Nao definida"}</Text>
          <Text style={styles.cardText}>Endereco: {enderecoQuadra}</Text>
          <Text style={styles.cardText}>
            Valor por hora: {typeof quadra?.preco === "number" ? `R$ ${quadra.preco.toFixed(2)}` : "Consultar"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Quero ser mensalista deste agendamento?</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity
            style={[styles.chip, mensalista === "sim" ? styles.chipActive : null]}
            onPress={() => setMensalista("sim")}
          >
            <Text style={[styles.chipText, mensalista === "sim" ? styles.chipTextActive : null]}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, mensalista === "nao" ? styles.chipActive : null]}
            onPress={() => setMensalista("nao")}
          >
            <Text style={[styles.chipText, mensalista === "nao" ? styles.chipTextActive : null]}>Nao</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Jogador lider</Text>
        <TextInput value={usuario?.nome || ""} editable={false} style={styles.input} />

        <Text style={styles.label}>Numero de jogadores</Text>
        <TextInput
          value={jogadores}
          onChangeText={(text) => setJogadores(text.replace(/\D/g, "").slice(0, 2))}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Qual o nivel do time?</Text>
        <View style={styles.chipsRow}>
          {(["inicial", "casual", "avancado"] as NivelTime[]).map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, nivel === item ? styles.chipActive : null]}
              onPress={() => setNivel(item)}
            >
              <Text style={[styles.chipText, nivel === item ? styles.chipTextActive : null]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            router.push({
              pathname: "/reserva/[quadraId]/horarios",
              params: {
                quadraId: String(quadraId),
                mensalista,
                jogadores,
                nivel,
              },
            })
          }
        >
          <Text style={styles.actionButtonText}>Escolher data e horario</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
