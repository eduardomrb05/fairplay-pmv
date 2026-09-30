import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.96,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.36)",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },

  topText: {
    color: "#aaa",
    fontSize: 16,
  },

  logoArea: {
    alignItems: "center",
    marginTop: 36,
  },

  logo: {
    width: 200,
    height: 150,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },

  titleBlue: {
    color: "#2F80C3",
  },

  buttonsWrapper: {
    backgroundColor: "rgba(15,23,42,0.55)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  buttonsArea: {
    gap: 16,
  },

  blueButton: {
    backgroundColor: "#2F80C3",
    height: 60,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  yellowButton: {
    backgroundColor: "#E9CA2F",
    height: 60,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})