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
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  card: {
    borderRadius: 14,
    backgroundColor: "#DDE3B8",
    padding: 14,
    marginBottom: 14,
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
    marginTop: 6,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  helperText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  chipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  chipText: {
    color: "#1F2937",
    fontWeight: "600",
    fontSize: 13,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 20,
    height: 42,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  actionButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2F7DBA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
