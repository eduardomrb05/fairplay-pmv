import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E9E9E9",
  },
  keyboardWrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#E9E9E9",
    paddingTop: 20,
    paddingBottom: 40,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 10,
    padding: 8,
  },

  backText: {
    fontSize: 26,
    color: "#000",
    fontWeight: "600",
  },

  logoRow: {
    alignItems: "flex-start",
    marginBottom: 20,
    height: 100,
    justifyContent: "center",
    width:"100%",
  },

  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
  },

  form: {
    width: "100%",
    paddingHorizontal: 32,
  },

  label: {
    fontSize: 16,
    color: "#1E1E1E",
    marginBottom: 8,
    marginLeft: 2,
  },

  input: {
    width: "100%",
    height: 42,
    borderWidth: 1.2,
    borderColor: "#4A4A4A",
    borderRadius: 21,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "transparent",
    color: "#000",
    fontSize: 15,
  },

  button: {
    width: 150,
    height: 48,
    backgroundColor: "#E9C933",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 14,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
});