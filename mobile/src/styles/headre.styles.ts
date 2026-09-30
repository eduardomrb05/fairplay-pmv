import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },

  logo: {
    width: 90,
    height: 32,
    resizeMode: "contain",
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  bellIcon: {
    fontSize: 22,
    color: "#000",
  },

  menuBox: {
    width: 32,
    height: 32,
    backgroundColor: "#2F7DBA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },

  menuText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});