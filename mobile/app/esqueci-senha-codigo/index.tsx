import { atualizarSenha } from "@/src/services/authApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../../src/styles/esqueci-senha.styles";

export default function EsqueciSenhaCodigo() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function handleAtualizar() {
    const emailFormatado = String(email || "").trim().toLowerCase();

    if (!emailFormatado) {
      return Alert.alert("Erro", "E-mail não informado.");
    }

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }

    if (novaSenha !== confirmarSenha) {
      return Alert.alert("Atenção", "As senhas não coincidem.");
    }

    if (novaSenha.length < 6) {
      return Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
    }

    try {
      setLoading(true);

      await atualizarSenha({
        email: emailFormatado,
        novaSenha: novaSenha.trim(),
      });

      setSucesso(true);
    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert("Erro", error.message);
      }

      Alert.alert("Erro", "Não foi possível atualizar a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/FairPlay nome abaixo.png")}
        style={styles.logo}
      />

      <View style={styles.form}>
        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          style={styles.input}
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar nova senha</Text>
        <TextInput
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAtualizar}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Atualizando..." : "Atualizar senha"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={sucesso} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.box}>
            <Text style={modalStyles.emoji}>✅</Text>
            <Text style={modalStyles.titulo}>Senha alterada!</Text>
            <Text style={modalStyles.texto}>
              A sua senha foi atualizada com sucesso.
            </Text>

            <TouchableOpacity
              style={modalStyles.botao}
              onPress={() => {
                setSucesso(false);
                router.replace("/escolher-tipo");
              }}
            >
              <Text style={modalStyles.botaoText}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    width: "80%",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  texto: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  botao: {
    backgroundColor: "#2563EB",
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  botaoText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});