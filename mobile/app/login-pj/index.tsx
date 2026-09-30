import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../src/styles/login-pf.styles";
import { formatarCNPJ } from "../../src/utils/validarCNPJ";
import { loginPJ } from "@/src/services/authApi";
import { salvarEmpresaSessao } from "@/src/storage/empresaSession";

export default function LoginPJ() {
  const router = useRouter();

  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLoginPJ() {
    if (!cnpj.trim() || !senha.trim()) {
      return Alert.alert("Atencao", "Preencha CNPJ e senha.");
    }

    try {
      const resposta = await loginPJ({
        cnpj: cnpj.replace(/\D/g, ""),
        senha: senha.trim(),
      });

      if (resposta.tipo === "admin") {
        Alert.alert("Sucesso", "Login ADM realizado com sucesso.");
        router.replace("/adm-principal");
        return;
      }

      const empresa = resposta.usuario || resposta.empresa;

      if (!empresa) {
        return Alert.alert("Erro", "Dados da empresa nao encontrados.");
      }

      await salvarEmpresaSessao(empresa);

      Alert.alert("Sucesso", "Login PJ realizado com sucesso.");
      router.replace("/home-pj");

    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert("Login PJ", error.message);
      }

      return Alert.alert("Login PJ", "Erro ao realizar login.");
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
        <Text style={styles.label}>CNPJ</Text>
        <TextInput
          style={styles.input}
          value={cnpj}
          onChangeText={(texto) => setCnpj(formatarCNPJ(texto))}
          keyboardType="numeric"
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
          onPress={handleLoginPJ}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.forgotPassword}>
          Esqueci a senha
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/cadastro-pj")}
        >
          <Text style={styles.registerText}>
            Ainda não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
