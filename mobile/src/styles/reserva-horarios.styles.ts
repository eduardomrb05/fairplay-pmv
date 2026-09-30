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
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  dayButton: {
    width: 58,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    paddingVertical: 8,
  },
  dayButtonActive: {
    backgroundColor: "#E9C933",
    borderColor: "#E9C933",
  },
  dayText: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "700",
  },
  dayNumber: {
    marginTop: 2,
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  slotItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  slotItemBlocked: {
    backgroundColor: "#F3F4F6",
  },
  slotItemSelected: {
    backgroundColor: "#DDE3B8",
    borderColor: "#B8BE94",
  },
  slotText: {
    fontSize: 17,
    color: "#111827",
    fontWeight: "600",
  },
  slotStatus: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2F7DBA",
  },
  slotStatusBlocked: {
    color: "#DC2626",
  },
  slotStatusSelected: {
    color: "#1F2937",
  },
  summaryCard: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  summaryText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  actionButton: {
    marginTop: 14,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2F7DBA",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
