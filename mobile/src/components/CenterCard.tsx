import { Image, type ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/centerCard.styles";

type CenterCardProps = {
  title: string;
  subtitle?: string | null;
  image?: ImageSourcePropType;
  onPress?: () => void;
};

export function CenterCard({ title, subtitle, image, onPress }: CenterCardProps) {
  return (
    <TouchableOpacity style={styles.cardWrapper} activeOpacity={0.82} onPress={onPress}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.card} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}