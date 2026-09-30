import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { styles } from "../../src/styles/adm-principal.styles";

export default function Adm() {
  async function handleLogout() {
    try {
      await AsyncStorage.clear();

      router.replace("/escolher-tipo");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Nao foi possivel deslogar. Tente novamente."
      );
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Icone FairPlay oficial.png")}
          style={styles.logo}
        />

        <View style={styles.rightHeader}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Deslogar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.dashboardCardYellow}>
        <Text style={styles.dashboardText}>
          Total de Reservas
        </Text>
      </View>

      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardText}>
          Total Faturado{"\n"}por empresa
        </Text>
      </View>

      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardText}>
          Top Empresas
        </Text>
      </View>

      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardText}>
          Horas Alugadas{"\n"}por quadra
        </Text>
      </View>

      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardText}>
          Taxa de Ocupação
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartText}>
          Gráfico aqui
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.yellowButton}
          onPress={() => router.push("/adm-usuarios")}
        >
          <Text style={styles.yellowButtonText}>
            Usuários
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.yellowButton}
          onPress={() => router.push("/adm-empresas")}
        >
          <Text style={styles.yellowButtonText}>
            Empresas
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}