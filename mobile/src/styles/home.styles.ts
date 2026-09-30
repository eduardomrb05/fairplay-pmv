import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E9E9E9",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  content: {
    flexGrow: 1,
    paddingTop: 116,
    paddingBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 12,
    color: "#111827",
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 12,
  },

  sectionTitleInline: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  sectionLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D81D5",
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },

  sportsScroll: {
    marginBottom: 8,
  },

  centersScroll: {
    marginBottom: 6,
  },

  mapSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  loadingText: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 10,
  },

  mapContainer: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    marginTop: 8,
    overflow: "hidden",
    backgroundColor: "#CDD4DA",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  mapFallbackText: {
    fontSize: 13,
    color: "#1F2937",
    textAlign: "center",
  },

  helperText: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 12,
    color: "#4B5563",
  },

  emptyText: {
    marginTop: 4,
    marginBottom: 10,
    color: "#4B5563",
    fontSize: 13,
  },
});