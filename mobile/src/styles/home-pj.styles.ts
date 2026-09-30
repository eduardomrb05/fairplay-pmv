import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E9E9E9",
  },
  container: {
    flexGrow: 1,
    paddingTop: 114,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#DDE3B8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  primaryButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E9C933",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sortRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  sortChip: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  sortChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  sortChipTextActive: {
    color: "#FFFFFF",
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  seeAllButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  seeAllButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
  quadraCard: {
    backgroundColor: "#F8F9EF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9DEC0",
    padding: 12,
    marginBottom: 10,
  },
  quadraCardContent: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  quadraImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
  },
  quadraDetails: {
    flex: 1,
  },
  quadraNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  quadraInfo: {
    marginTop: 4,
    fontSize: 13,
    color: "#4B5563",
  },
  quadraActions: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#2563EB",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 10,
    fontSize: 14,
    color: "#111827",
  },
  modalActions: {
    marginTop: 6,
    flexDirection: "row",
    gap: 10,
  },
  modalActionButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancel: {
    backgroundColor: "#E5E7EB",
  },
  modalSave: {
    backgroundColor: "#16A34A",
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  modalActionTextLight: {
    color: "#FFFFFF",
  },
});
