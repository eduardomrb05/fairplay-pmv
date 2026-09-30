import React from "react";
import { Modal, TouchableOpacity, Text, View } from "react-native";
import { router } from "expo-router";
import { styles } from "../styles/menu.styles";

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  tipoUsuario: "pf" | "pj";
  onLogout?: () => void | Promise<void>;
}

export default function Menu({ visible, onClose, tipoUsuario, onLogout }: MenuProps) {
  async function handleLogout() {
    onClose();
    if (onLogout) {
      await onLogout();
      return;
    }
    router.replace("/");
  }

  function navigate(path: string) {
    onClose();
    router.push(path);
  }

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>FairPlay</Text>

          <TouchableOpacity
            style={styles.menuButtonYellow}
            onPress={() => navigate(tipoUsuario === "pf" ? "/home" : "/home-pj")}
          >
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButtonBlue}
            onPress={() => navigate(tipoUsuario === "pf" ? "/perfil" : "/perfil-empresa")}
          >
            <Text style={styles.buttonText}>Minha Conta</Text>
          </TouchableOpacity>

          {tipoUsuario === "pf" ? (
            <>
              <TouchableOpacity style={styles.menuButtonBlue} onPress={() => navigate("/quadras")}>
                <Text style={styles.buttonText}>Quadras</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButtonBlue} onPress={() => navigate("/mensagens")}>
                <Text style={styles.buttonText}>Mensagens</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.menuButtonBlue} onPress={() => navigate("/home-pj")}>
                <Text style={styles.buttonText}>Quadras</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButtonBlue} onPress={() => navigate("/mensagens")}>
                <Text style={styles.buttonText}>Mensagens</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Deslogar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
