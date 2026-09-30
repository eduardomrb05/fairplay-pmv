import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../src/services/supabase";
import { cancelarConta, uploadFotoPerfil } from "@/src/services/authApi";
import { cancelarReserva } from "@/src/services/reservasApi";

import Menu  from "../../src/components/Menu";

type UsuarioPerfil = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  idade?: string;
  foto?: string | null;
};

export default function UserProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [atualizandoSenha, setAtualizandoSenha] = useState(false);

  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [idade, setIdade] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  const [modalCancelarConta, setModalCancelarConta] = useState(false);
  const [cancelandoConta, setCancelandoConta] = useState(false);
  const [cancelandoReservaId, setCancelandoReservaId] = useState<number | null>(null);
  const [modalConfirmarCanceloReserva, setModalConfirmarCanceloReserva] = useState(false);
  const [reservaIdParaCancelar, setReservaIdParaCancelar] = useState<number | null>(null);

  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    carregarDadosPerfil();
  }, []);

  const formatarDataBR = (dataString: string) => {
    if (!dataString) return "Não informada";

    try {
      const [ano, mes, dia] = dataString.split("T")[0].split("-");
      return `${dia}/${mes}/${ano}`;
    } catch {
      return dataString;
    }
  };

  const formatarHorario = (horario: string) => {
    if (!horario) return "Não informado";
    return String(horario).slice(0, 5);
  };

  const getReservasByDate = (data: string): any[] => {
    const dataParsed = data.split("T")[0];
    return reservas.filter((r) => r.data.split("T")[0] === dataParsed);
  };

  const generateCalendar = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    
    const diasMes = ultimoDia.getDate();
    const diaInicio = primeiroDia.getDay();
    
    const dias = [];
    
    for (let i = 0; i < diaInicio; i++) {
      dias.push(null);
    }
    
    for (let i = 1; i <= diasMes; i++) {
      dias.push(i);
    }
    
    return dias;
  };

  const temReservaNoDay = (dia: number | null) => {
    if (!dia) return false;
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaStr = String(dia).padStart(2, "0");
    const dataFormatada = `${ano}-${mes}-${diaStr}`;
    
    return reservas.some((r) => r.data.split("T")[0] === dataFormatada);
  };

  async function handleCancelarConta() {
    if (!usuarioId) {
      return Alert.alert("Erro", "Usuário não encontrado.");
    }

    setModalCancelarConta(false);

    try {
      setCancelandoConta(true);
      console.log("Iniciando cancelamento de conta para ID:", usuarioId);

      await cancelarConta(usuarioId);
      console.log("Conta cancelada com sucesso!");

      // Limpar dados do armazenamento
      await Promise.all([
        AsyncStorage.removeItem("@fairplay:user"),
        AsyncStorage.removeItem("@FairPlay:user"),
        AsyncStorage.removeItem("usuario"),
        AsyncStorage.removeItem("user"),
      ]);

      // Redirecionar para tela inicial
      await router.replace({ pathname: "/escolher-tipo" });
      return;
    } catch (error) {
      setCancelandoConta(false);
      console.error("Erro ao cancelar conta:", error);
      if (error instanceof Error) {
        return Alert.alert("Erro", error.message);
      }
      Alert.alert("Erro", "Não foi possível cancelar sua conta.");
    }
  }

  async function carregarDadosPerfil() {
    try {
      setLoading(true);

      const usuarioSalvo =
        (await AsyncStorage.getItem("@fairplay:user")) ||
        (await AsyncStorage.getItem("@FairPlay:user")) ||
        (await AsyncStorage.getItem("usuario")) ||
        (await AsyncStorage.getItem("user"));

      if (!usuarioSalvo) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login-pf");
        return;
      }

      const usuario = JSON.parse(usuarioSalvo);
      const idUsuario = Number(usuario.id);

      console.log("ID DO USUÁRIO LOGADO:", idUsuario);

      if (!idUsuario) {
        Alert.alert("Erro", "ID do usuário não encontrado no app.");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("id, nome, email, telefone, idade, foto")
        .eq("id", idUsuario)
        .maybeSingle<UsuarioPerfil>();

      if (userError) throw userError;

      if (!userData) {
        Alert.alert("Erro", "Usuário não encontrado no banco.");
        return;
      }

      setUsuarioId(userData.id);
      setNome(userData.nome || "");
      setEmail(userData.email || "");
      setTelefone(userData.telefone || "");
      setIdade(userData.idade || "");
      setFoto(userData.foto || null);

      await carregarReservas(userData.id);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function carregarReservas(idUsuario: number) {
    try {
      setLoadingReservas(true);

      const { data, error } = await supabase
        .from("reservas")
        .select(`
          id,
          usuario_id,
          quadra_id,
          data,
          horario,
          quadra:quadra_id (*)
        `)
        .eq("usuario_id", idUsuario)
        .order("data", { ascending: true });

      if (error) throw error;

      console.log("RESERVAS DO USUÁRIO:", data);

      setReservas(data || []);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
      Alert.alert("Erro", "Não foi possível carregar suas reservas.");
    } finally {
      setLoadingReservas(false);
    }
  }

  function handleCancelarReserva(reservaId: number) {
    console.log("Abrindo modal de confirmação para reserva ID:", reservaId);
    setReservaIdParaCancelar(reservaId);
    setModalConfirmarCanceloReserva(true);
  }

  async function confirmarCancelamento() {
    if (!reservaIdParaCancelar) return;

    try {
      console.log("Iniciando cancelamento da reserva:", reservaIdParaCancelar);
      setCancelandoReservaId(reservaIdParaCancelar);
      await cancelarReserva(reservaIdParaCancelar);
      console.log("Reserva cancelada com sucesso!");
      Alert.alert("Sucesso", "Reserva cancelada com sucesso.");
      setModalConfirmarCanceloReserva(false);
      if (usuarioId) {
        await carregarReservas(usuarioId);
      }
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      Alert.alert("Erro", "Não foi possível cancelar a reserva: " + JSON.stringify(error));
    } finally {
      setCancelandoReservaId(null);
      setReservaIdParaCancelar(null);
    }
  }

  async function pickAndUploadImage() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão necessária",
        "Você precisa permitir o acesso à galeria para mudar a foto."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;

    const file = result.assets[0];
    setFoto(file.uri);

    try {
      setUploading(true);

      if (!usuarioId) {
        throw new Error("Usuário não encontrado.");
      }

      const fileExt = String(file.uri.split(".").pop() || "jpg").split("?")[0];
      const fileName = `${usuarioId}-${Date.now()}.${fileExt}`;
      const filePath = `${usuarioId}/${fileName}`;

      const response = await fetch(file.uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const base64 = Array.from(bytes)
        .map((byte) => String.fromCharCode(byte))
        .join("");
      const base64String = globalThis.btoa(base64);
      const extension = fileExt;

      const { publicUrl } = await uploadFotoPerfil(usuarioId, {
        base64: base64String,
        extension,
      });

      if (!publicUrl) {
        throw new Error("Não foi possível obter a URL pública da imagem.");
      }

      setFoto(publicUrl);
      Alert.alert("Sucesso", "Sua foto de perfil foi salva!");

      await carregarDadosPerfil();
    } catch (error: any) {
      console.error("Erro ao enviar foto:", error);
      Alert.alert("Erro", error.message || "Falha ao fazer upload da foto.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2980B9" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meu Perfil</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            onPress={pickAndUploadImage}
            disabled={uploading}
            style={styles.avatarContainer}
          >
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera" size={30} color="#666" />
              </View>
            )}

            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color="#FFF" />
              </View>
            )}

            <View style={styles.avatarBadge}>
              <Ionicons name="camera-reverse" size={12} color="#FFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{nome || "Seu Nome"}</Text>
          <Text style={styles.userRole}>PLAYER</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#555" />
            <Text style={styles.infoText}>{email || "E-mail não informado"}</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#555" />
            <Text style={styles.infoText}>
              {telefone || "Telefone não informado"}
            </Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#555" />
            <Text style={styles.infoText}>
              Idade: {formatarDataBR(idade)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btnEditProfile}
          onPress={() => router.push("/editar-perfil")}
        >
          <Ionicons name="create-outline" size={18} color="#FFF" />
          <Text style={styles.btnEditText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnCancelAccount}
          onPress={() => setModalCancelarConta(true)}
        >
          <Ionicons name="trash-outline" size={18} color="#FFF" />
          <Text style={styles.btnEditText}>Cancelar Conta</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Quadras Reservadas</Text>

        {loadingReservas ? (
          <ActivityIndicator color="#2980B9" style={{ marginVertical: 20 }} />
        ) : reservas.length > 0 ? (
          reservas.map((reserva, index) => (
            <View key={`reserva-${index}`} style={styles.reservaCard}>
              <View style={styles.reservaThumb}>
                {reserva.quadra?.foto ? (
                  <Image
                    source={{ uri: reserva.quadra.foto }}
                    style={styles.reservaThumbImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="football-outline" size={30} color="#777" />
                )}
              </View>

              <View style={styles.reservaDetails}>
                <Text style={styles.reservaTextBold}>
                  {reserva.quadra?.nome || "Quadra"}
                </Text>

                <Text style={styles.reservaText}>
                  {reserva.quadra?.tipo || "Esporte"}
                </Text>

                <Text style={styles.reservaText}>
                  Data: {formatarDataBR(reserva.data)}
                </Text>

                <Text style={styles.reservaText}>
                  Horário: {formatarHorario(reserva.horario)}
                </Text>

                <Text style={styles.reservaTextPrice}>
                  R$ {Number(reserva.quadra?.preco || 0)
                    .toFixed(2)
                    .replace(".", ",")}
                </Text>
              </View>

              <View style={styles.reservaActionColumn}>
                <TouchableOpacity
                  style={styles.btnActionBlue}
                  onPress={() =>
                    router.push({
                      pathname: "/reserva/[quadraId]/pagamento",
                      params: { quadraId: String(reserva.quadra_id) },
                    })
                  }
                >
                  <Text style={styles.btnActionText}>PAGAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnActionRed}
                  onPress={() => handleCancelarReserva(Number(reserva.id))}
                  disabled={cancelandoReservaId === Number(reserva.id)}
                >
                  <Text style={styles.btnActionText}>
                    {cancelandoReservaId === Number(reserva.id) ? "Cancelando..." : "Cancelar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={30} color="#999" />
            <Text style={styles.emptyText}>Nenhuma quadra reservada</Text>
            <Text style={styles.emptySubText}>
              Suas próximas partidas aparecerão aqui.
            </Text>
          </View>
        )}

        <View style={styles.agendaContainer}>
          <Text style={styles.agendaHeaderTitle}>Agenda</Text>

          {reservas.length > 0 ? (
            <>
              <View style={styles.calendarContainer}>
                <View style={styles.calendarWeekDays}>
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((dia) => (
                    <Text key={dia} style={styles.calendarWeekDay}>
                      {dia}
                    </Text>
                  ))}
                </View>

                <View style={styles.calendarGrid}>
                  {generateCalendar().map((dia, index) => {
                    const temReserva = temReservaNoDay(dia);
                    return (
                      <View
                        key={`cal-${index}`}
                        style={[
                          styles.calendarDay,
                          temReserva && styles.calendarDayWithReserva,
                        ]}
                      >
                        {dia && (
                          <Text
                            style={[
                              styles.calendarDayText,
                              temReserva && styles.calendarDayTextActive,
                            ]}
                          >
                            {dia}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.agendaLegend}>
                <View style={styles.agendaLegendItem}>
                  <View style={styles.agendaLegendCircle} />
                  <Text style={styles.agendaLegendText}>Dias com reservas</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={[styles.emptyText, { marginTop: 10 }]}>
              Agenda vazia
            </Text>
          )}
        </View>
      </ScrollView>

      <Modal visible={modalCancelarConta} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cancelar Conta</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja cancelar sua conta? Esta ação não pode ser desfeita.
            </Text>

            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={handleCancelarConta}
              disabled={cancelandoConta}
            >
              <Text style={styles.modalButtonText}>
                {cancelandoConta ? "Cancelando..." : "Sim, cancelar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonDismiss}
              onPress={() => setModalCancelarConta(false)}
              disabled={cancelandoConta}
            >
              <Text style={styles.modalDismissText}>Não, manter conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalConfirmarCanceloReserva}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cancelar Reserva</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja cancelar esta reserva?
            </Text>

            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={confirmarCancelamento}
              disabled={cancelandoReservaId !== null}
            >
              <Text style={styles.modalButtonText}>
                {cancelandoReservaId !== null ? "Cancelando..." : "Sim, cancelar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonDismiss}
              onPress={() => {
                setModalConfirmarCanceloReserva(false);
                setReservaIdParaCancelar(null);
              }}
              disabled={cancelandoReservaId !== null}
            >
              <Text style={styles.modalDismissText}>Não, manter reserva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8F9FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60, alignItems: "center" },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#EAEAEA",
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },

  profileHeader: { alignItems: "center", marginTop: 10, marginBottom: 20 },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EBEBEB",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: { justifyContent: "center", alignItems: "center" },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2980B9",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F8F9FA",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 45,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  userRole: {
    fontSize: 13,
    color: "#3498DB",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  infoBox: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    paddingVertical: 5,
  },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 15 },
  infoText: { fontSize: 15, color: "#333", marginLeft: 10 },
  infoDivider: { height: 1, backgroundColor: "#EAEAEA", marginHorizontal: 15 },

  btnEditProfile: {
    width: "100%",
    backgroundColor: "#2980B9",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  btnCancelAccount: {
    width: "100%",
    backgroundColor: "#E74C3C",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  btnEditText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    alignSelf: "flex-start",
    marginBottom: 15,
    marginTop: 30,
  },

  reservaCard: {
    width: "100%",
    backgroundColor: "#F3F6D1",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#3498DB",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  reservaDetails: { flex: 1, marginRight: 10 },
  reservaTextBold: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  reservaText: { fontSize: 13, color: "#000", marginBottom: 2 },
  reservaTextPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2980B9",
    marginTop: 5,
  },

  reservaActionColumn: { justifyContent: "center", gap: 6, marginRight: 10 },
  btnActionBlue: {
    backgroundColor: "#2980B9",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  btnActionRed: {
    backgroundColor: "#E74C3C",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  btnActionText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },

  reservaThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 10,
  },
  reservaThumbImage: {
    width: "100%",
    height: "100%",
  },

  emptyContainer: {
    width: "100%",
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "bold",
    marginTop: 10,
  },
  emptySubText: { fontSize: 13, color: "#999", marginTop: 5 },

  agendaContainer: {
    width: "100%",
    backgroundColor: "#EBF0C8",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  agendaHeaderTitle: {
    fontSize: 20,
    color: "#3498DB",
    marginBottom: 15,
    fontWeight: "bold",
  },

  /* diaAtual* styles removed — field no longer displayed */

  calendarContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  calendarWeekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarWeekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 5,
  },
  calendarDayWithReserva: {
    backgroundColor: "#3498DB",
  },
  calendarDayText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  calendarDayTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },

  agendaLegend: {
    marginBottom: 15,
  },
  agendaLegendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  agendaLegendCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3498DB",
    marginRight: 8,
  },
  agendaLegendText: {
    fontSize: 12,
    color: "#666",
  },

  agendaListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 10,
  },

  agendaCard: {
    backgroundColor: "#F0F3D8",
    borderWidth: 1,
    borderColor: "#C8CFA4",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  agendaColLeft: { justifyContent: "space-between" },
  agendaColRight: { alignItems: "flex-end", justifyContent: "space-between" },

  agendaText: { fontSize: 14, color: "#333", marginBottom: 4 },
  agendaTextValue: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    textAlign: "right",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 22,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtonCancel: {
    backgroundColor: "#E74C3C",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  modalButtonDismiss: {
    backgroundColor: "#F0F0F0",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalDismissText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
});