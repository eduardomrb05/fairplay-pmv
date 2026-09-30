import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import { styles } from "../../src/styles/home.styles";

import { TopBar } from "@/src/components/TopBar";
import { SearchBar } from "../../src/components/SearchBar";
import { SportCard } from "../../src/components/SportCard";
import { CenterCard } from "../../src/components/CenterCard";
import { NextGameCard } from "../../src/components/NextGameCard";
import Menu from "../../src/components/Menu";
import { listarQuadras, type QuadraApi } from "@/src/services/quadrasApi";
import { CourtsMap } from "@/src/components/CourtsMap";
import { limparUsuarioSessao } from "@/src/storage/usuarioSession";
import { getQuadraImageSource, getSportImage } from "@/src/utils/quadraImages";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type MapRegion = Coordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

function getEndereco(quadra: QuadraApi) {
  const endereco = [quadra.rua, quadra.numero, quadra.bairro, quadra.cidade]
    .filter((item) => item && item.trim().length > 0)
    .join(", ");
  return endereco;
}

function calcularDistanciaKm(origem: Coordinate, destino: Coordinate) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const raioTerraKm = 6371;
  const deltaLat = toRad(destino.latitude - origem.latitude);
  const deltaLng = toRad(destino.longitude - origem.longitude);
  const lat1 = toRad(origem.latitude);
  const lat2 = toRad(destino.latitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return raioTerraKm * c;
}

export default function Home() {
  const [quadras, setQuadras] = useState<QuadraApi[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [coordinatesByQuadraId, setCoordinatesByQuadraId] = useState<Record<number, Coordinate>>({});
  const [isLocating, setIsLocating] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Ref para rastrear quais IDs já foram geocodificados, evitando o loop infinito
  const geocodificadosRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    async function carregarQuadras() {
      try {
        setIsLoading(true);
        const data = await listarQuadras();
        setQuadras(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Nao foi possivel carregar as quadras.";
        Alert.alert("Home", message);
      } finally {
        setIsLoading(false);
      }
    }

    void carregarQuadras();
  }, []);

  useEffect(() => {
    async function buscarLocalizacao() {
      try {
        setIsLocating(true);
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== "granted") {
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch {
        // A Home continua funcional sem permissao de localizacao.
      } finally {
        setIsLocating(false);
      }
    }

    void buscarLocalizacao();
  }, []);

  // FIX: removido `coordinatesByQuadraId` das dependências.
  // Usamos uma ref para controlar quais quadras já foram geocodificadas,
  // evitando o loop infinito que gerava milhares de chamadas à API.
  useEffect(() => {
    async function geocodificarQuadras() {
      const quadrasComEndereco = quadras.filter((quadra) => {
        if (geocodificadosRef.current.has(quadra.id)) {
          return false;
        }
        return getEndereco(quadra).length > 0;
      });

      if (!quadrasComEndereco.length) {
        return;
      }

      // Marca como geocodificados antes de chamar a API para evitar chamadas duplicadas
      quadrasComEndereco.forEach((quadra) => geocodificadosRef.current.add(quadra.id));

      const coords = await Promise.all(
        quadrasComEndereco.map(async (quadra) => {
          try {
            const result = await Location.geocodeAsync(getEndereco(quadra));
            if (!result.length) {
              return null;
            }
            return {
              id: quadra.id,
              coordinate: {
                latitude: result[0].latitude,
                longitude: result[0].longitude,
              },
            };
          } catch {
            return null;
          }
        }),
      );

      setCoordinatesByQuadraId((prev) => {
        const next = { ...prev };
        coords.forEach((item) => {
          if (item) {
            next[item.id] = item.coordinate;
          }
        });
        return next;
      });
    }

    void geocodificarQuadras();
  }, [quadras]); // ← apenas `quadras` como dependência

  const quadrasFiltradas = useMemo(() => {
    const filtro = searchText.trim().toLowerCase();
    if (!filtro) {
      return quadras;
    }

    return quadras.filter((quadra) => {
      const valores = [
        quadra.nome,
        quadra.tipo || "",
        quadra.empresa_nome || "",
        quadra.bairro || "",
        quadra.cidade || "",
      ];
      return valores.some((value) => value.toLowerCase().includes(filtro));
    });
  }, [quadras, searchText]);

  const MODALIDADES_FIXAS = ["Beach Tenis", "Volei", "Futebol", "Futsal", "Basquete", "Tenis"];

  const modalidades = useMemo(() => {
    const tiposDoBanco = new Set(
      quadrasFiltradas
        .map((q) => q.tipo?.trim().toLowerCase())
        .filter(Boolean)
    );
    
    // CORREÇÃO AQUI: Garantindo que 't' existe antes de chamar .toLowerCase()
    const extras = quadrasFiltradas
      .map((q) => q.tipo?.trim())
      .filter((t): t is string => {
        if (!t) return false;
        return !MODALIDADES_FIXAS.map(m => m.toLowerCase()).includes(t.toLowerCase());
      });

    return [...MODALIDADES_FIXAS, ...new Set(extras)];
  }, [quadrasFiltradas]);

  const quadrasComDistancia = useMemo(() => {
    return quadrasFiltradas
      .map((quadra) => {
        const coordinate = coordinatesByQuadraId[quadra.id];
        const distanceKm = userLocation && coordinate ? calcularDistanciaKm(userLocation, coordinate) : null;
        return { ...quadra, coordinate, distanceKm };
      })
      .sort((a, b) => {
        if (a.distanceKm === null && b.distanceKm === null) {
          return a.nome.localeCompare(b.nome);
        }
        if (a.distanceKm === null) {
          return 1;
        }
        if (b.distanceKm === null) {
          return -1;
        }
        return a.distanceKm - b.distanceKm;
      });
  }, [coordinatesByQuadraId, quadrasFiltradas, userLocation]);

  const mapQuadras = quadrasComDistancia.filter((quadra) => Boolean(quadra.coordinate));

  const mapRegion: MapRegion = useMemo(() => {
    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      };
    }
    const first = mapQuadras[0]?.coordinate;
    if (first) {
      return {
        latitude: first.latitude,
        longitude: first.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      };
    }
    return {
      latitude: -19.9191,
      longitude: -43.9386,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [mapQuadras, userLocation]);

  const mapMarkers = mapQuadras
    .map((quadra) => {
      if (!quadra.coordinate) {
        return null;
      }
      return {
        id: quadra.id,
        title: quadra.nome,
        description: quadra.empresa_nome || quadra.tipo || undefined,
        coordinate: quadra.coordinate,
      };
    })
    .filter((item): item is { id: number; title: string; description: string; coordinate: Coordinate } =>
      Boolean(item),
    );

  return (
    <View style={styles.screen}>
      <TopBar
        enableMenu
        tipoUsuario="pf"
        onLogout={async () => {
          await limparUsuarioSessao();
          router.replace("/escolher-tipo");
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <SearchBar value={searchText} onChangeText={setSearchText} />

        <Text style={styles.sectionTitle}>Escolha uma modalidade</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll}>
          {modalidades.map((modalidade) => (
            <TouchableOpacity
              key={modalidade}
              onPress={() => router.push({
                pathname: "/quadras",
                params: { modalidadeSelecionada: modalidade }
              })}
            >
              <SportCard title={modalidade} image={getSportImage(modalidade)} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleInline}>Centro Esportivos</Text>
          <TouchableOpacity onPress={() => router.push("/quadras")}>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.centersScroll}>
            {quadrasComDistancia.length ? (
              quadrasComDistancia.map((quadra) => (
                <CenterCard
                  key={quadra.id}
                  title={quadra.nome}
                  subtitle={quadra.empresa_nome}
                  image={getQuadraImageSource(quadra)}
                  onPress={() => router.push(`/reserva/${quadra.id}`)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma quadra cadastrada ainda.</Text>
            )}
          </ScrollView>
        )}

        <View style={styles.mapSectionHeader}>
          <Text style={styles.sectionTitle}>Perto de voce</Text>
          {isLocating ? <Text style={styles.sectionSubtitle}>Buscando localizacao...</Text> : null}
        </View>

        <View style={styles.mapContainer}>
          <CourtsMap
            style={styles.map}
            region={mapRegion}
            userLocation={userLocation}
            markers={mapMarkers}
          />
        </View>

        <NextGameCard
          quadra={quadrasComDistancia[0]}
          distanceKm={quadrasComDistancia[0]?.distanceKm}
        />
      </ScrollView>
    </View>
  );
}