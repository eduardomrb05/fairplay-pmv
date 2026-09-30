import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DDE3B8",
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F7DBA",
    marginBottom: 12,
  },

  innerBox: {
    backgroundColor: "#EEF1D8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#B8BE94",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    color: "#333",
  },

  value: {
    fontSize: 13,
    color: "#333",
    textAlign: "right",
  },
});