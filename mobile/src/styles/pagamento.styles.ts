import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E9E9E9",
  },
  container: {
    flexGrow: 1,
    paddingTop: 112,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },
  card: {
    borderRadius: 14,
    backgroundColor: "#DDE3B8",
    padding: 14,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  metodoItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  metodoItemActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: "#2563EB",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  metodoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  metodoLabelActive: {
    color: "#1D4ED8",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2F7DBA",
  },
  pagarButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E9C933",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pagarButtonText: {
    color: "#1F2937",
    fontSize: 17,
    fontWeight: "700",
  },
  cancelarButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelarButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});