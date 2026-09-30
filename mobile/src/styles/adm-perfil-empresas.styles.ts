import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 22,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 14,
  },
  logo: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  statusButton: {
    backgroundColor: "#F04438",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 22,
    marginLeft: "auto",
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  icon: {
    fontSize: 22,
  },
  menu: {
    fontSize: 32,
    color: "#1F6FA8",
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#F4FBCB",
    borderRadius: 18,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 4,
    marginBottom: 14,
  },
  info: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    marginBottom: 6,
    color: "#111111",
  },
  bold: {
    fontWeight: "800",
  },
  photoBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 90,
  },
  photoIcon: {
    fontSize: 52,
    color: "#111111",
  },
  photoText: {
    fontSize: 13,
    marginTop: 6,
  },
  editButton: {
    backgroundColor: "#F4FBCB",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111111",
  },
  blueButton: {
    backgroundColor: "#1F7DBB",
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  yellowButton: {
    backgroundColor: "#F5C51B",
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  redButton: {
    backgroundColor: "#F04438",
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },
  chartBox: {
    height: 210,
    backgroundColor: "#F4F4F4",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  chartLine: {
    fontSize: 38,
    color: "#1F7DBB",
  },
  chartText: {
    marginTop: 12,
    fontSize: 15,
    color: "#333333",
  },
  contractText: {
    textAlign: "center",
    fontSize: 18,
    color: "#111111",
    marginBottom: 30,
  },
  backButton: {
  width: 36,
  height: 36,
  alignItems: "center",
  justifyContent: "center",
},

backText: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#000",
},
});