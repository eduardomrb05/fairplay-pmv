import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { supabase } from "../../src/services/supabase.js";
import { listarReservas, type ReservaApi } from "@/src/services/reservasApi";
import { formatarTelefone } from "@/src/utils/formatarTelefone";

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [statusOn, setStatusOn] = useState(true);
  const [reservas, setReservas] = useState<ReservaApi[]>([]);

  function voltarParaUsuarios() {
    router.replace("/adm-usuarios");
  }

  useEffect(() => {
    async function carregarDadosPerfil() {
      if (!id) {
        Alert.alert("Erro", "Usuário não encontrado.");
        voltarParaUsuarios();
        return;
      }

      const usuarioId = Array.isArray(id) ? id[0] : id;

      const { data, error } = await supabase
        .from("usuarios")
        .select("id, nome, email, telefone, bloqueado")
        .eq("id", usuarioId)
        .single();

      if (error || !data) {
        console.log(error);
        Alert.alert("Erro", "Não foi possível carregar esse usuário.");
        voltarParaUsuarios();
        return;
      }

      setNome(data.nome || "");
      setEmail(data.email || "");
      setTelefone(data.telefone ? formatarTelefone(data.telefone) : "");
      setStatusOn(!data.bloqueado);

      try {
        const todasReservas = await listarReservas();

        setReservas(
          todasReservas.filter(
            (item) => Number(item.usuario_id) === Number(usuarioId)
          )
        );
      } catch {
        setReservas([]);
      }
    }

    void carregarDadosPerfil();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={voltarParaUsuarios}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/Icone FairPlay oficial.png")}
            style={styles.logoFairPlay}
          />

          <View
            style={[
              styles.statusBtn,
              { backgroundColor: statusOn ? "#95A5A6" : "#E74C3C" },
            ]}
          >
            <Text style={styles.statusBtnText}>
              STATUS {statusOn ? "ON" : "OFF"}
            </Text>
          </View>
        </View>

        <View style={styles.profileArea}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera" size={30} color="#666" />
              </View>
            )}

            <View style={styles.editBadge}>
              <Ionicons name="camera-reverse-outline" size={12} color="#FFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userNameText}>{nome || "Nome não informado"}</Text>
          <Text style={styles.playerTag}>PLAYER</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{email || "E-mail não informado"}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{telefone || "Telefone não informado"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reservas do Usuário</Text>

          {reservas.length > 0 ? (
            reservas.map((item) => (
              <View key={item.id} style={styles.filledCard}>
                <View style={styles.cardIcon}>
                  <Ionicons name="tennisball-outline" size={24} color="#2980B9" />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>
                    {item.quadra_nome || `Quadra #${item.quadra_id}`}
                  </Text>

                  <Text style={styles.cardSubtitle}>
                    {item.data} • {String(item.horario).slice(0, 5)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={36} color="#BCBCBC" />
              <Text style={styles.emptyText}>Nenhuma quadra reservada</Text>
              <Text style={styles.emptySubText}>
                As reservas desse usuário aparecerão aqui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF" },
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { paddingBottom: 40, paddingTop: 10 },

  customHeader: {
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 5,
    backgroundColor: "#FFF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  logoFairPlay: { width: 60, height: 60, resizeMode: "contain" },
  statusBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15 },
  statusBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 10 },

  profileArea: { alignItems: "center", marginVertical: 10 },
  avatarWrapper: { position: "relative" },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2980B9",
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  userNameText: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  playerTag: {
    color: "#2980B9",
    fontWeight: "bold",
    letterSpacing: 2,
    fontSize: 12,
  },

  infoContainer: { paddingHorizontal: 25, marginTop: 15 },
  infoCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  infoText: { fontSize: 15, color: "#444", marginLeft: 12 },
  divider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 5 },

  section: { paddingHorizontal: 25, marginTop: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },

  emptyCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    borderStyle: "dashed",
  },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#666", marginTop: 10 },
  emptySubText: { fontSize: 13, color: "#999", marginTop: 5, textAlign: "center" },

  filledCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EBF5FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#333" },
  cardSubtitle: { fontSize: 13, color: "#666", marginTop: 3 },
});