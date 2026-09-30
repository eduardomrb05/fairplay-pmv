import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { cadastrarPF } from "@/src/services/authApi";
import { styles } from "../../src/styles/cadastro-pf.styles";
import { formatarTelefone } from "../../src/utils/formatarTelefone";
import { cpfTem11Digitos, formatarCPF } from "../../src/utils/validarCPF";

export default function CadastroPF() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [idade, setIdade] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validarEmail(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  async function handleCadastro() {
    console.log("CLIQUEI NO BOTÃO PF");

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();
    const cpfNumeros = cpf.replace(/\D/g, "");
    const idadeNumero = Number(idade.replace(/\D/g, ""));
    const bairroLimpo = bairro.trim();
    const cidadeLimpa = cidade.trim();
    const telefoneNumeros = telefone.replace(/\D/g, "");

    console.log("DADOS PF ANTES DA VALIDAÇÃO");
    console.log("nome:", nomeLimpo);
    console.log("email:", emailLimpo);
    console.log("senhaTamanho:", senhaLimpa.length);
    console.log("cpf:", cpfNumeros);
    console.log("cpfValido:", cpfTem11Digitos(cpf));
    console.log("idade:", idadeNumero);
    console.log("bairro:", bairroLimpo);
    console.log("cidade:", cidadeLimpa);
    console.log("telefone:", telefoneNumeros);

    if (!nomeLimpo || !emailLimpo || !senhaLimpa) {
      console.log("PAROU EM NOME/EMAIL/SENHA");
      return Alert.alert("Atenção", "Nome, e-mail e senha são obrigatórios.");
    }

    if (nomeLimpo.length < 3) {
      console.log("PAROU NO NOME CURTO");
      return Alert.alert("Atenção", "Digite um nome com pelo menos 3 caracteres.");
    }

    if (!validarEmail(emailLimpo)) {
      console.log("PAROU NO EMAIL INVÁLIDO");
      return Alert.alert("Atenção", "Digite um e-mail válido.");
    }

    if (senhaLimpa.length < 6) {
      console.log("PAROU NA SENHA CURTA");
      return Alert.alert("Atenção", "A senha deve ter no mínimo 6 caracteres.");
    }

    if (!cpfTem11Digitos(cpf)) {
      console.log("PAROU NO CPF SEM 11 DÍGITOS");
      return Alert.alert("Atenção", "Digite um CPF válido com 11 dígitos.");
    }

    if (/^(\d)\1{10}$/.test(cpfNumeros)) {
      console.log("PAROU NO CPF REPETIDO:", cpfNumeros);
      return Alert.alert("Atenção", "CPF inválido.");
    }

    if (!idade.trim() || Number.isNaN(idadeNumero) || idadeNumero < 13 || idadeNumero > 120) {
      console.log("PAROU NA IDADE:", idadeNumero);
      return Alert.alert("Atenção", "Digite uma idade válida entre 13 e 120 anos.");
    }

    if (!bairroLimpo || bairroLimpo.length < 2) {
      console.log("PAROU NO BAIRRO:", bairroLimpo);
      return Alert.alert("Atenção", "Digite um bairro válido.");
    }

    if (!cidadeLimpa || cidadeLimpa.length < 2) {
      console.log("PAROU NA CIDADE:", cidadeLimpa);
      return Alert.alert("Atenção", "Digite uma cidade válida.");
    }

    if (!telefoneNumeros || telefoneNumeros.length < 10) {
      console.log("PAROU NO TELEFONE:", telefoneNumeros);
      return Alert.alert("Atenção", "Digite um telefone válido com DDD.");
    }

    const payloadPF = {
      nome: nomeLimpo,
      email: emailLimpo,
      senha: senhaLimpa,
      cpf: cpfNumeros,
      idade: idadeNumero,
      bairro: bairroLimpo,
      cidade: cidadeLimpa,
      telefone: telefoneNumeros,
    };

    console.log("PASSOU DA VALIDAÇÃO, VAI ENVIAR PF");
    console.log("PAYLOAD PF:", payloadPF);

    try {
      setIsSubmitting(true);

      const resposta = await cadastrarPF(payloadPF);

      console.log("CADASTRO PF REALIZADO COM SUCESSO:", resposta);

      Alert.alert("Sucesso", "Cadastro PF realizado com sucesso!");
      router.push("/login-pf");
    } catch (error) {
      console.log("ERRO AO CADASTRAR PF:", error);

      if (error instanceof Error) {
        return Alert.alert("Cadastro PF", error.message);
      }

      return Alert.alert("Cadastro PF", "Erro ao cadastrar.");
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
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <Image source={require("../../assets/images/Logo FairPlay.png")} style={styles.logo} />
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
            <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              value={cpf}
              onChangeText={(texto) => setCpf(formatarCPF(texto))}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Idade</Text>
            <TextInput
              style={styles.input}
              value={idade}
              onChangeText={(text) => setIdade(text.replace(/\D/g, ""))}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Bairro</Text>
            <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />

            <Text style={styles.label}>Cidade</Text>
            <TextInput style={styles.input} value={cidade} onChangeText={setCidade} />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={(text) => setTelefone(formatarTelefone(text))}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
              onPress={handleCadastro}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>{isSubmitting ? "Criando..." : "Criar"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}