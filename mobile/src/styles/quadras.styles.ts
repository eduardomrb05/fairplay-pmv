import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
    paddingTop: 116,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F3FEE3",
    borderRadius: 30,
    flexDirection: "row",
    padding: 15,
    marginBottom: 15,
    elevation: 4,
  },
  cardInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nomeQuadra: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  infoTexto: {
    fontSize: 12,
    color: "#444",
    marginBottom: 2,
  },
  cardAcoesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  botoesContainer: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoAvaliar: {
    backgroundColor: "#000",
    paddingVertical: 6,
    width: 80,
    borderRadius: 20,
    marginBottom: 8,
    alignItems: "center",
  },
  botaoAgendar: {
    backgroundColor: "#2D81D5",
    paddingVertical: 6,
    width: 80,
    borderRadius: 20,
    alignItems: "center",
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  imagemQuadra: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 16,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
});
