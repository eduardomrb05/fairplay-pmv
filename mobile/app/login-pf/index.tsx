import { loginPF } from "@/src/services/authApi";
import { salvarUsuarioSessao } from "@/src/storage/usuarioSession";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { styles } from "../../src/styles/login-pf.styles";

export default function LoginPF() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleEmailChange(text: string) {
    const semEspacos = text.replace(/\s+/g, "");
    const apenasEmailValido = semEspacos.replace(
      /[^a-zA-Z0-9@._-]/g,
      ""
    );

    setEmail(apenasEmailValido.toLowerCase());
  }

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      return Alert.alert(
        "Atenção",
        "Preencha e-mail e senha."
      );
    }

    try {
      const usuario = await loginPF({
        email: email.trim().toLowerCase(),
        senha,
      });

      await salvarUsuarioSessao(usuario);

      await AsyncStorage.setItem(
        "@fairplay:user",
        JSON.stringify(usuario)
      );

      Alert.alert(
        "Sucesso",
        "Login realizado com sucesso."
      );

      router.replace("/home");
    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert(
          "Login PF",
          error.message
        );
      }

      return Alert.alert(
        "Login PF",
        "Erro ao realizar login."
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/escolher-tipo")}
        style={styles.backButton}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/FairPlay nome abaixo.png")}
        style={styles.logo}
      />

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="email"
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/esqueci-senha")}
        >
          <Text style={styles.forgotPassword}>
            Esqueci a senha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/cadastro-pf")}
        >
          <Text style={styles.registerText}>
            Ainda não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
