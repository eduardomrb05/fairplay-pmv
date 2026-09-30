import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },

  menuContainer: {
    width: 260,
    height: "100%",
    backgroundColor: "#FFF",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  logo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1E2A38",
  },

  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },

  closeText: {
    fontSize: 24,
    color: "#2D6EA3",
    fontWeight: "bold",
  },

  menuButtonYellow: {
    backgroundColor: "#E7C52F",
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 12,
    alignItems: "center",
  },

  menuButtonBlue: {
    backgroundColor: "#2D6EA3",
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 12,
    alignItems: "center",
  },

  logoutButton: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
});