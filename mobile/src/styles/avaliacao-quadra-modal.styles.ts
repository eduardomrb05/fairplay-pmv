import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "700",
  },
  message: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  highlight: {
    color: "#DC2626",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 14,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
    color: "#D1D5DB",
  },
  starAtiva: {
    color: "#E9C933",
  },
  comentarioInput: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    marginBottom: 16,
    textAlignVertical: "top",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  actionSim: {
    backgroundColor: "#2563EB",
  },
  actionNao: {
    backgroundColor: "#DC2626",
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  footerNote: {
    marginTop: 12,
    fontSize: 11,
    fontStyle: "italic",
    color: "#6B7280",
    textAlign: "center",
  },
});
