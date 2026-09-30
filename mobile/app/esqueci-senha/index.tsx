import { verificarEmail } from "@/src/services/authApi";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../../src/styles/esqueci-senha.styles";

export default function EsqueciSenha() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEnviar() {
    const emailFormatado = email.trim().toLowerCase();

    if (!emailFormatado) {
      return Alert.alert(
        "Atenção",
        "Preencha o e-mail cadastrado."
      );
    }

    try {
      setLoading(true);

      await verificarEmail({
        email: emailFormatado,
      });

      router.push({
        pathname: "/esqueci-senha-codigo",
        params: {
          email: emailFormatado,
        },
      });

    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert("Erro", error.message);
      }

      Alert.alert(
        "Erro",
        "E-mail não encontrado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/FairPlay nome abaixo.png")}
        style={styles.logo}
      />

      <View style={styles.form}>
        <Text style={styles.label}>
          E-mail cadastrado
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleEnviar}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Verificando..."
              : "Enviar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}