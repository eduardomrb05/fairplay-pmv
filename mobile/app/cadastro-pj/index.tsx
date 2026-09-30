import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { router } from "expo-router";

import { styles } from "../../src/styles/cadastro-pj.styles";
import { cadastrarPJ } from "@/src/services/authApi";
import { formatarCNPJ, limparCNPJ, validarCNPJ } from "@/src/utils/validarCNPJ";
import { formatarTelefone } from "@/src/utils/formatarTelefone";

export default function CadastroPJ() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCadastroPJ() {
    if (
      !nome.trim() ||
      !email.trim() ||
      !senha.trim() ||
      !cnpj.trim() ||
      !telefone.trim() ||
      !rua.trim() ||
      !numero.trim() ||
      !bairro.trim() ||
      !cep.trim() ||
      !cidade.trim() ||
      !estado.trim()
    ) {
      return Alert.alert("Cadastro PJ", "Preencha todos os campos.");
    }

    const cnpjLimpo = limparCNPJ(cnpj);
    const telefoneLimpo = telefone.replace(/\D/g, "");
    const cepLimpo = cep.replace(/\D/g, "");

    if (!validarCNPJ(cnpjLimpo)) {
      return Alert.alert("Cadastro PJ", "CNPJ inválido.");
    }

    try {
      setIsSubmitting(true);

      await cadastrarPJ({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
        cnpj: cnpjLimpo,
        telefone: telefoneLimpo,
        rua: rua.trim(),
        numero: numero.trim(),
        bairro: bairro.trim(),
        cep: cepLimpo,
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
      });

      Alert.alert("Sucesso", "Cadastro PJ realizado com sucesso!");
      router.replace("/login-pj");
    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert("Cadastro PJ", error.message);
      }

      return Alert.alert("Cadastro PJ", "Erro ao cadastrar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 92 : 16}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <Image
              source={require("../../assets/images/Icone FairPlay oficial.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text.replace(/\s+/g, ""))}
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

            <Text style={styles.label}>CNPJ</Text>
            <TextInput
              style={styles.input}
              value={cnpj}
              onChangeText={(text) => setCnpj(formatarCNPJ(text))}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={(text) => setTelefone(formatarTelefone(text))}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Rua / Avenida</Text>
            <TextInput style={styles.input} value={rua} onChangeText={setRua} />

            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Bairro</Text>
            <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />

            <Text style={styles.label}>CEP</Text>
            <TextInput
              style={styles.input}
              value={cep}
              onChangeText={setCep}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Cidade</Text>
            <TextInput style={styles.input} value={cidade} onChangeText={setCidade} />

            <Text style={styles.label}>Estado</Text>
            <TextInput
              style={styles.input}
              value={estado}
              onChangeText={setEstado}
              autoCapitalize="characters"
              maxLength={2}
            />

            <TouchableOpacity
              style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
              onPress={handleCadastroPJ}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Criando..." : "Criar"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}