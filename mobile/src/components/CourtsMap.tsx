import { ImageBackground, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

const MAPA_IMAGE = require("../../assets/images/mapa.png");

type Coordinate = {
  latitude: number;
  longitude: number;
};

type Region = Coordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

type CourtsMapProps = {
  style?: StyleProp<ViewStyle>;
  region: Region;
  userLocation: Coordinate | null;
  markers: {
    id: number;
    title: string;
    description?: string;
    coordinate: Coordinate;
  }[];
};

const PIN_COLORS = ["#AFA9EC", "#97C459", "#F0997B", "#7FC8E8", "#E8C46C"];

function getPinColor(index: number) {
  return PIN_COLORS[index % PIN_COLORS.length];
}

// Converte uma coordenada real (lat/lng) em uma posicao percentual (0-100)
// dentro da area visual do mapa, com base na regiao visivel atual.
function coordinateToPercent(coordinate: Coordinate, region: Region) {
  const halfLat = region.latitudeDelta / 2;
  const halfLng = region.longitudeDelta / 2;

  const minLat = region.latitude - halfLat;
  const maxLat = region.latitude + halfLat;
  const minLng = region.longitude - halfLng;
  const maxLng = region.longitude + halfLng;

  const xRatio = (coordinate.longitude - minLng) / (maxLng - minLng);
  const yRatio = 1 - (coordinate.latitude - minLat) / (maxLat - minLat);

  const clamp = (value: number) => Math.min(95, Math.max(5, value * 100));

  return {
    left: `${clamp(xRatio)}%`,
    top: `${clamp(yRatio)}%`,
  };
}

export function CourtsMap({ style, region, userLocation, markers }: CourtsMapProps) {
  return (
    <ImageBackground source={MAPA_IMAGE} style={[stylesMap.mapContainer, style]} resizeMode="cover">
      {markers.map((marker, index) => {
        const position = coordinateToPercent(marker.coordinate, region);
        return (
          <View
            key={marker.id}
            style={[stylesMap.markerWrapper, { left: position.left as never, top: position.top as never }]}
          >
            <View style={[stylesMap.pin, { backgroundColor: getPinColor(index) }]} />
            <Text style={stylesMap.markerLabel} numberOfLines={1}>
              {marker.title}
            </Text>
          </View>
        );
      })}

      {userLocation ? (
        <View
          style={[
            stylesMap.userDot,
            {
              left: coordinateToPercent(userLocation, region).left as never,
              top: coordinateToPercent(userLocation, region).top as never,
            },
          ]}
        />
      ) : null}
    </ImageBackground>
  );
}

const stylesMap = StyleSheet.create({
  mapContainer: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  markerWrapper: {
    position: "absolute",
    alignItems: "center",
    transform: [{ translateX: -12 }, { translateY: -28 }],
  },
  pin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderBottomLeftRadius: 0,
    transform: [{ rotate: "-45deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  markerLabel: {
    marginTop: 4,
    fontSize: 9,
    color: "#1F2937",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    maxWidth: 90,
    textAlign: "center",
  },
  userDot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#378ADD",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ translateX: -7 }, { translateY: -7 }],
  },
});