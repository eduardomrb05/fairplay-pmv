import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 20,
  },

  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },

  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  bell: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  logoutButton: {
    backgroundColor: "#ef4b3f",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
    marginBottom: 20,
  },

  dashboardCard: {
    backgroundColor: "#2f7bbd",
    paddingVertical: 18,
    marginBottom: 8,
    alignItems: "center",
  },

  dashboardCardYellow: {
    backgroundColor: "#f0cf12",
    paddingVertical: 18,
    marginBottom: 8,
    alignItems: "center",
  },

  dashboardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  chartContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },

  chartText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
  },

  buttonsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 40,
  },

  yellowButton: {
    backgroundColor: "#f0cf12",
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: "center",
    marginBottom: 20,
  },

  yellowButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
});