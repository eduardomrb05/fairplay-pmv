import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 0,
    alignItems: "center",
  },


  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingTop: 15,
  },

  header: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },


  backText: {
    fontSize: 30,
    lineHeight: 30,
    color: "#000",
  },

  logo: {
    width: 35,
    height: 35,
    marginLeft: 12,
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
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  listContent: {
    paddingBottom: 25,
    gap: 12,
  },

  card: {
    minHeight: 93,
    backgroundColor: "#F2F9C8",
    borderRadius: 22,
    paddingHorizontal: 35,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  selectedCard: {
    borderWidth: 3,
    borderColor: "#00A2FF",
  },

  infoArea: {
    justifyContent: "center",
  },

  infoText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 3,
  },

  rightArea: {
    alignItems: "center",
    justifyContent: "space-between",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 30,
  },

  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
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
    color: "#fff",
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
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});