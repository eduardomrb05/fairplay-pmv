import { View, Text } from "react-native";
import { styles } from "../styles/nextGameCard.styles";
import type { QuadraApi } from "../services/quadrasApi";

type NextGameCardProps = {
  quadra?: QuadraApi;
  distanceKm?: number | null;
};

export function NextGameCard({ quadra, distanceKm }: NextGameCardProps) {
  const distanciaTexto =
    distanceKm === null || distanceKm === undefined ? "Indisponivel" : `${distanceKm.toFixed(1)} km`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proximo jogo</Text>

      <View style={styles.innerBox}>
        <View style={styles.row}>
          <Text style={styles.label}>Quadra</Text>
          <Text style={styles.value}>{quadra?.nome || "Sem agendamento"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Modalidade</Text>
          <Text style={styles.value}>{quadra?.tipo || "Nao definida"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Local</Text>
          <Text style={styles.value}>{quadra?.empresa_nome || "Nao informado"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Valor por hora</Text>
          <Text style={styles.value}>
            {typeof quadra?.preco === "number" ? `R$ ${quadra.preco.toFixed(2)}` : "Consultar"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Distancia</Text>
          <Text style={styles.value}>{distanciaTexto}</Text>
        </View>
      </View>
    </View>
  );
}