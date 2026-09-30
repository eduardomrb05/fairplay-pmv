import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";

type SalesChartProps = {
  labels: string[];
  series: {
    nome: string;
    cor: string;
    valores: number[];
  }[];
  altura?: number;
};

export function SalesChart({ labels, series, altura = 180 }: SalesChartProps) {
  const [largura, setLargura] = useState(0);

  function handleLayout(event: LayoutChangeEvent) {
    setLargura(event.nativeEvent.layout.width);
  }

  const todosValores = series.flatMap((serie) => serie.valores);
  const maxValor = Math.max(...todosValores, 1);

  function gerarPontosPixel(valores: number[]) {
    const total = valores.length;
    return valores.map((valor, index) => {
      const x = total > 1 ? (index / (total - 1)) * largura : largura / 2;
      const y = altura - (valor / maxValor) * altura;
      return { x, y };
    });
  }

  return (
    <View style={stylesChart.wrapper}>
      <View style={[stylesChart.plotArea, { height: altura }]} onLayout={handleLayout}>
        {[0, 25, 50, 75, 100].map((linha) => (
          <View key={linha} style={[stylesChart.gridLine, { top: `${linha}%` as never }]} />
        ))}

        {largura > 0 &&
          series.map((serie) => {
            const pontos = gerarPontosPixel(serie.valores);

            return (
              <View key={serie.nome} style={StyleSheet.absoluteFill} pointerEvents="none">
                {pontos.slice(0, -1).map((ponto, index) => {
                  const proximo = pontos[index + 1];
                  const dx = proximo.x - ponto.x;
                  const dy = proximo.y - ponto.y;
                  const comprimento = Math.sqrt(dx * dx + dy * dy);
                  const anguloRad = Math.atan2(dy, dx);
                  const anguloDeg = (anguloRad * 180) / Math.PI;

                                    return (
                    <View
                      key={`${serie.nome}-segmento-${index}`}
                      style={{
                        position: "absolute",
                        left: ponto.x,
                        top: ponto.y - 1,
                        width: comprimento,
                        height: 2,
                        backgroundColor: serie.cor,
                        transform: [{ rotate: `${anguloDeg}deg` }],
                        transformOrigin: "0% 50%",
                      } as never}
                    />
                  );
                })}

                {pontos.map((ponto, index) => (
                  <View
                    key={`${serie.nome}-ponto-${index}`}
                    style={[
                      stylesChart.dot,
                      {
                        left: ponto.x - 3.5,
                        top: ponto.y - 3.5,
                        backgroundColor: serie.cor,
                      },
                    ]}
                  />
                ))}
              </View>
            );
          })}
      </View>

      <View style={stylesChart.labelsRow}>
        {labels.map((label) => (
          <Text key={label} style={stylesChart.labelText}>
            {label}
          </Text>
        ))}
      </View>

      <View style={stylesChart.legendRow}>
        {series.map((serie) => (
          <View key={serie.nome} style={stylesChart.legendItem}>
            <View style={[stylesChart.legendDot, { backgroundColor: serie.cor }]} />
            <Text style={stylesChart.legendText}>{serie.nome}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const stylesChart = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  plotArea: {
    width: "100%",
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 6,
  },
  labelText: {
    fontSize: 10,
    color: "#6B7280",
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "600",
  },
});