import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

import { TopBar } from "@/src/components/TopBar";
import { styles } from "@/src/styles/pagamento.styles";
import { limparUsuarioSessao } from "@/src/storage/usuarioSession";
import { criarReserva } from "@/src/services/reservasApi";

type MetodoPagamento = "pix" | "mastercard" | "visa" | "elo" | "amex";

const METODOS: { id: MetodoPagamento; label: string; icon: keyof typeof FontAwesome5.glyphMap; color: string }[] = [
  { id: "pix", label: "Pix", icon: "qrcode", color: "#32BCAD" },
  { id: "mastercard", label: "Mastercard", icon: "cc-mastercard", color: "#EB001B" },
  { id: "visa", label: "Visa", icon: "cc-visa", color: "#1A1F71" },
  { id: "elo", label: "Elo", icon: "credit-card", color: "#000000" },
  { id: "amex", label: "American Express", icon: "cc-amex", color: "#2E77BC" },
];

function formatDatePt(dateIso: string) {
  const [year, month, day] = dateIso.split("-");
  return `${day}/${month}/${year}`;
}

export default function PagamentoScreen() {
  const {
    quadraId,
    quadraNome,
    data,
    horario,
    valor,
    usuarioId,
    mensalista,
    jogadores,
    nivel,
  } = useLocalSearchParams<{
    quadraId: string;
    quadraNome: string;
    data: string;
    horario: string;
    valor: string;
    usuarioId: string;
    mensalista?: string;
    jogadores?: string;
    nivel?: string;
  }>();

  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  async function handlePagar() {
    if (!metodoPagamento) {
      Alert.alert("Pagamento", "Selecione um metodo de pagamento.");
      return;
    }
    try {
      setIsPaying(true);
      await criarReserva({
        usuario_id: Number(usuarioId),
        quadra_id: Number(quadraId),
        data: data ?? "",
        horario: `${horario}:00`,
      });
      router.replace({
        pathname: `/reserva/${quadraId}/sucesso` as never,
        params: {
          quadraNome: quadraNome ?? "",
          data: data ?? "",
          horario: horario ?? "",
          valor: valor ?? "",
          metodo: metodoPagamento,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao processar pagamento.";
      Alert.alert("Pagamento", message);
    } finally {
      setIsPaying(false);
    }
  }

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
        <Text style={styles.title}>Formas de pagamento</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{quadraNome ?? "Quadra"}</Text>
          <Text style={styles.cardText}>Data: {data ? formatDatePt(data) : "-"}</Text>
          <Text style={styles.cardText}>Horario: {horario ?? "-"}</Text>
          <Text style={styles.cardText}>Mensalista: {mensalista === "sim" ? "Sim" : "Nao"}</Text>
          <Text style={styles.cardText}>Jogadores: {jogadores ?? "-"}</Text>
          <Text style={styles.cardText}>Nivel: {nivel ?? "-"}</Text>
        </View>
        <Text style={styles.sectionTitle}>Metodo de pagamento</Text>
        {METODOS.map((metodo) => {
          const isActive = metodoPagamento === metodo.id;
          return (
            <TouchableOpacity
              key={metodo.id}
              style={[styles.metodoItem, isActive ? styles.metodoItemActive : null]}
              onPress={() => setMetodoPagamento(metodo.id)}
            >
              <View style={[styles.radio, isActive ? styles.radioActive : null]}>
                {isActive ? <View style={styles.radioDot} /> : null}
              </View>
              <FontAwesome5
                name={metodo.icon}
                size={22}
                color={metodo.color}
                style={{ marginRight: 12 }}
              />
              <Text style={[styles.metodoLabel, isActive ? styles.metodoLabelActive : null]}>
                {metodo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {valor ? `R$ ${Number(valor).toFixed(2)}` : "Consultar"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.pagarButton, (!metodoPagamento || isPaying) ? styles.buttonDisabled : null]}
          onPress={handlePagar}
          disabled={!metodoPagamento || isPaying}
        >
          <Text style={styles.pagarButtonText}>
            {isPaying ? "Processando..." : "PAGAR"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelarButton, isPaying ? styles.buttonDisabled : null]}
          onPress={() => router.back()}
          disabled={isPaying}
        >
          <Text style={styles.cancelarButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}