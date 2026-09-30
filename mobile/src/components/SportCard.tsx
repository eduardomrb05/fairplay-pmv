import { View, Image, Text } from "react-native";
import { styles } from "../styles/sportCard.styles";

export function SportCard({ image, title }: any) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}