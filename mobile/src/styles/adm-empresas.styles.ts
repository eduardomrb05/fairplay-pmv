import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 30,
  },

  header: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  backText: {
    fontSize: 28,
    color: "#000000",
    marginRight: 12,
  },

  logo: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },

  registerButton: {
    marginLeft: "auto",
    backgroundColor: "#F1CA29",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },

  registerText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  listContent: {
    paddingBottom: 30,
    gap: 14,
  },

  card: {
    minHeight: 168,
    backgroundColor: "#F2F9C8",
    borderRadius: 22,
    paddingHorizontal: 35,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  infoArea: {
    justifyContent: "center",
    flex: 1,
  },

  infoText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },

  rightArea: {
    alignItems: "center",
    justifyContent: "space-between",
  },

  companyIcon: {
    width: 55,
    height: 55,
    resizeMode: "contain",
    marginTop: 10,
  },

  buttonsArea: {
    alignItems: "center",
    gap: 7,
  },

  statusBadge: {
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusYellow: {
    backgroundColor: "#F1CA29",
  },

  statusRed: {
    backgroundColor: "#F44336",
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  accessButton: {
    backgroundColor: "#2D74B8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  accessText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});