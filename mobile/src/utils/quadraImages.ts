import type { ImageSourcePropType } from "react-native";

const SPORT_IMAGES = {
  futebol: require("../../assets/images/futebol.png"),
  volei: require("../../assets/images/volei.png"),
  "beach tenis": require("../../assets/images/beach.png"),
  tenis: require("../../assets/images/tenis.png"),
  futsal: require("../../assets/images/futsal.png"),
  basquete: require("../../assets/images/basquete.png"),
} as const;

export function getSportImage(modalidade: string | null | undefined): ImageSourcePropType {
  const key = (modalidade || "").toLowerCase();
  return SPORT_IMAGES[key as keyof typeof SPORT_IMAGES] || SPORT_IMAGES.volei;
}

export function getQuadraImageSource(quadra: {
  foto_url?: string | null;
  tipo?: string | null;
}): ImageSourcePropType {
  const foto = quadra.foto_url?.trim();
  if (foto) {
    return { uri: foto };
  }

  return getSportImage(quadra.tipo);
}
