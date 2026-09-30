import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import type { TextInputProps } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  atualizarSenha,
  atualizarUsuario,
  loginPF,
} from "@/src/services/authApi";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
  autoComplete: TextInputProps["autoComplete"];
  textContentType: TextInputProps["textContentType"];
}

const PasswordField = React.memo(
  ({
    label,
    value,
    onChange,
    visible,
    onToggle,
    placeholder,
    autoComplete,
    textContentType,
  }: PasswordFieldProps) => (
    <View>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#BBB"
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          importantForAutofill="noExcludeDescendants"
        />

        <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
    </View>
  )
);

export default function EditProfileScreen() {
  const router = useRouter();

  const [telefone, setTelefone] = useState("");
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [telefoneAlteradoSucesso, setTelefoneAlteradoSucesso] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [senhaAlteradaSucesso, setSenhaAlteradaSucesso] = useState(false);

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const limparCampos = useCallback(() => {
    setTelefone("");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setSenhaAlteradaSucesso(false);
    setTelefoneAlteradoSucesso(false);
    setMostrarSenhaAtual(false);
    setMostrarNovaSenha(false);
    setMostrarConfirmar(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      limparCampos();
      const timer = setTimeout(limparCampos, 250);
      return () => clearTimeout(timer);
    }, [limparCampos])
  );

  const toggleSenhaAtual = useCallback(() => setMostrarSenhaAtual((v) => !v), []);
  const toggleNovaSenha = useCallback(() => setMostrarNovaSenha((v) => !v), []);
  const toggleConfirmar = useCallback(() => setMostrarConfirmar((v) => !v), []);

  const handleTelefoneChange = (text: string) => {
    let digits = text.replace(/\D/g, "").slice(0, 11);

    if (digits.length > 6) {
      digits = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 2) {
      digits = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length > 0) {
      digits = `(${digits}`;
    }

    setTelefone(digits);
  };

  const getUsuarioSessao = async () => {
    const usuarioSalvo =
      (await AsyncStorage.getItem("@fairplay:user")) ||
      (await AsyncStorage.getItem("@FairPlay:user")) ||
      (await AsyncStorage.getItem("usuario")) ||
      (await AsyncStorage.getItem("user"));

    if (!usuarioSalvo) {
      throw new Error("Usuário não encontrado. Faça login novamente.");
    }

    return JSON.parse(usuarioSalvo);
  };

  const handleSalvarPerfil = async () => {
    const telefoneSomenteNumeros = telefone.replace(/\D/g, "");

    if (telefoneSomenteNumeros.length < 10) {
      Alert.alert("Atenção", "Informe um número de telefone válido.");
      return;
    }

    setLoadingPerfil(true);
    setTelefoneAlteradoSucesso(false);

    try {
      const usuario = await getUsuarioSessao();

      const usuarioAtualizado = await atualizarUsuario(Number(usuario.id), {
        telefone: telefoneSomenteNumeros,
      });

      await AsyncStorage.setItem(
        "@fairplay:user",
        JSON.stringify({
          ...usuario,
          ...usuarioAtualizado,
        })
      );

      setTelefone("");
      setTelefoneAlteradoSucesso(true);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível salvar o telefone.");
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleSalvarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos de senha.");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Atenção", "A nova senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Atenção", "A nova senha e a confirmação não coincidem.");
      return;
    }

    setLoadingSenha(true);

    try {
      const usuario = await getUsuarioSessao();

      if (!usuario.email) {
        throw new Error("Usuário sem e-mail cadastrado.");
      }

      await loginPF({
        email: String(usuario.email).trim().toLowerCase(),
        senha: senhaAtual,
      });

      await atualizarSenha({
        email: String(usuario.email).trim().toLowerCase(),
        novaSenha: novaSenha.trim(),
      });

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setSenhaAlteradaSucesso(true);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível alterar a senha."
      );
    } finally {
      setLoadingSenha(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/perfil")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Editar Perfil</Text>

        <View style={{ width: 38 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={18} color="#2980B9" />
            </View>
            <Text style={styles.cardTitle}>Informações de Contato</Text>
          </View>

          {telefoneAlteradoSucesso && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
              <Text style={styles.successBannerText}>
                Telefone atualizado com sucesso!
              </Text>
            </View>
          )}

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={handleTelefoneChange}
            placeholder="(31) 99999-9999"
            placeholderTextColor="#BBB"
            keyboardType="phone-pad"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
          />

          <TouchableOpacity
            style={[styles.btn, loadingPerfil && styles.btnDisabled]}
            onPress={handleSalvarPerfil}
            disabled={loadingPerfil}
          >
            {loadingPerfil ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>Salvar Telefone</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          {senhaAlteradaSucesso ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#2ECC71" />
              <Text style={styles.successTitle}>Senha Alterada!</Text>
              <Text style={styles.successSubtitle}>
                Sua senha foi atualizada com sucesso.
              </Text>

              <TouchableOpacity
                style={[styles.btn, { width: "100%", marginTop: 24 }]}
                onPress={() => {
                  setSenhaAlteradaSucesso(false);
                  limparCampos();
                }}
              >
                <Text style={styles.btnText}>Concluir</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="lock-closed-outline" size={18} color="#2980B9" />
                </View>
                <Text style={styles.cardTitle}>Alterar Senha</Text>
              </View>

              <PasswordField
                label="Senha atual"
                value={senhaAtual}
                onChange={setSenhaAtual}
                visible={mostrarSenhaAtual}
                onToggle={toggleSenhaAtual}
                placeholder="Digite sua senha atual"
                autoComplete="current-password"
                textContentType="password"
              />

              <PasswordField
                label="Nova senha"
                value={novaSenha}
                onChange={setNovaSenha}
                visible={mostrarNovaSenha}
                onToggle={toggleNovaSenha}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                textContentType="newPassword"
              />

              <PasswordField
                label="Confirmar nova senha"
                value={confirmarSenha}
                onChange={setConfirmarSenha}
                visible={mostrarConfirmar}
                onToggle={toggleConfirmar}
                placeholder="Repita a nova senha"
                autoComplete="new-password"
                textContentType="newPassword"
              />

              <TouchableOpacity
                style={[styles.btn, loadingSenha && styles.btnDisabled, { marginTop: 28 }]}
                onPress={handleSalvarSenha}
                disabled={loadingSenha}
              >
                {loadingSenha ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.btnText}>Salvar Senha</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4F6F8",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#1A1A2E" },
  body: { padding: 16, paddingTop: 20 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EBF4FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A2E" },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    fontSize: 15,
    color: "#333",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#333",
  },
  eyeBtn: { paddingHorizontal: 14 },
  btn: {
    backgroundColor: "#2980B9",
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAFAF1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 8,
  },
  successBannerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#27AE60",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ECC71",
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
});