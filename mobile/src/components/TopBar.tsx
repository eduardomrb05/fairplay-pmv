import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/src/styles/topBar.styles";

type TopBarProps = {
  onBack?: () => void;
  onNotifications?: () => void;
  enableMenu?: boolean;
  tipoUsuario?: "pf" | "pj";
  onProfile?: () => void | Promise<void>;
  onSettings?: () => void | Promise<void>;
  onLogout?: () => void | Promise<void>;
};

export function TopBar({
  onBack,
  onNotifications,
  enableMenu,
  tipoUsuario,
  onProfile,
  onSettings,
  onLogout,
}: TopBarProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  function closeMenu() {
    setMenuVisible(false);
  }

  async function runMenuAction(action?: () => void | Promise<void>) {
    closeMenu();
    if (action) {
      await action();
    }
  }

  async function handleProfile() {
    if (onProfile) {
      await runMenuAction(onProfile);
      return;
    }

    if (tipoUsuario === "pj") {
      router.push("/perfil-empresa");
      closeMenu();
      return;
    }

    if (tipoUsuario === "pf") {
      router.push("/perfil");
      closeMenu();
      return;
    }

    await runMenuAction(() => Alert.alert("Perfil", "Tela de perfil em breve."));
  }

  async function handleQuadras() {
    closeMenu();
    if (tipoUsuario === "pj") {
      router.push("/home-pj");
      return;
    }
    router.push("/quadras");
  }

  async function handleMensagens() {
    closeMenu();
    router.push("/mensagens");
  }

  async function handleHomeEmpresa() {
    closeMenu();
    router.push("/home-pj");
  }

  async function handleSettings() {
    if (onSettings) {
      await runMenuAction(onSettings);
      return;
    }
    await runMenuAction(() => Alert.alert("Configuracoes", "Tela de configuracoes em breve."));
  }

  async function handleLogout() {
    if (onLogout) {
      await runMenuAction(onLogout);
      return;
    }
    await runMenuAction(() => Alert.alert("Sair", "Acao de sair nao configurada nesta tela."));
  }

  return (
    <>
      {menuVisible ? <TouchableOpacity style={styles.menuBackdrop} onPress={closeMenu} /> : null}

      <View style={styles.container}>
        <View style={styles.row}>
          {onBack ? (
            <TouchableOpacity style={styles.iconButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={20} color="#111827" />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}

          <View style={styles.centerArea}>
            <Image
              source={require("../../assets/images/Icone FairPlay oficial.png")}
              style={styles.logo}
            />
          </View>

          {enableMenu ? (
            <TouchableOpacity style={styles.iconButton} onPress={() => setMenuVisible((current) => !current)}>
              <Ionicons name="menu" size={22} color="#111827" />
            </TouchableOpacity>
          ) : onNotifications ? (
            <TouchableOpacity style={styles.iconButton} onPress={onNotifications}>
              <Ionicons name="notifications-outline" size={20} color="#111827" />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>

        {menuVisible ? (
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
              <Text style={styles.menuItemText}>Perfil</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />

            {tipoUsuario === "pf" ? (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={handleQuadras}>
                  <Text style={styles.menuItemText}>Quadras</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={handleMensagens}>
                  <Text style={styles.menuItemText}>Mensagens</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
              </>
            ) : null}

            {tipoUsuario === "pj" ? (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={handleHomeEmpresa}>
                  <Text style={styles.menuItemText}>Minhas quadras</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={handleMensagens}>
                  <Text style={styles.menuItemText}>Mensagens</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
              </>
            ) : null}

            {tipoUsuario === "pf" ? (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
                  <Text style={styles.menuItemText}>Configuracoes</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
              </>
            ) : null}

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuItemText, styles.menuItemDangerText]}>Sair</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </>
  );
}
