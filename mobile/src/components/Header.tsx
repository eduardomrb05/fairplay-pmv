import { View, Image, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/headre.styles";
import Menu from "./Menu";

export function Header() {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/images/FairPlay nome abaixo.png")}
        style={styles.logo}
      />

      <View style={styles.header}>
        <Text>🔔</Text>
        <Text>☰</Text>
      </View>
    </View>
  );
}