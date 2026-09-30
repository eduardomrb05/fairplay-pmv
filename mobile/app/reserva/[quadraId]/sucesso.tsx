import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const LABEL_METODO: Record<string, string> = {
  pix: "Pix",
  mastercard: "Mastercard",
  visa: "Visa",
  elo: "Elo",
  amex: "American Express",
};

function formatDatePt(dateIso: string) {
  const [year, month, day] = dateIso.split("-");
  return `${day}/${month}/${year}`;
}

export default function SucessoScreen() {
  const { quadraNome, data, horario, metodo, valor } = useLocalSearchParams<{
    quadraNome?: string;
    data?: string;
    horario?: string;
    metodo?: string;
    valor?: string;
  }>();

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.emoji}>✅</Text>
        <Text style={styles.title}>Pagamento realizado com</Text>
        <Text style={styles.highlight}>SUCESSO</Text>
        <View style={styles.divider} />
        <Text style={styles.infoLabel}>Quadra</Text>
        <Text style={styles.infoValue}>{quadraNome ?? "-"}</Text>
        <Text style={styles.infoLabel}>Data</Text>
        <Text style={styles.infoValue}>{data ? formatDatePt(data) : "-"}</Text>
        <Text style={styles.infoLabel}>Horario</Text>
        <Text style={styles.infoValue}>{horario ?? "-"}</Text>
        <Text style={styles.infoLabel}>Valor pago</Text>
        <Text style={styles.infoValue}>
          {valor ? `R$ ${Number(valor).toFixed(2)}` : "-"}
        </Text>
        <Text style={styles.infoLabel}>Forma de pagamento</Text>
        <Text style={styles.infoValue}>
          {metodo ? (LABEL_METODO[metodo] ?? metodo) : "-"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.homeButtonText}>Ir para o inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E9E9E9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  highlight: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2F7DBA",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  homeButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2F7DBA",
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});