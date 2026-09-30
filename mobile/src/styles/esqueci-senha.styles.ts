import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E9E9E9",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 12,
  },
  form: {
    width: "100%",
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    color: "#1E1E1E",
    marginBottom: 8,
    marginLeft: 6,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1.2,
    borderColor: "#4A4A4A",
    borderRadius: 24,
    paddingHorizontal: 18,
    backgroundColor: "transparent",
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  button: {
    marginTop: 36,
    width: 155,
    height: 48,
    backgroundColor: "#2563EB",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 8,
  },
  backText: {
    fontSize: 24,
    color: "#000",
    fontWeight: "600",
  },
});
