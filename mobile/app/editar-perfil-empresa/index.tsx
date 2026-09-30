import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { atualizarEmpresa, type EmpresaApi } from "@/src/services/authApi";
import {
  buscarEmpresaSessao,
  salvarEmpresaSessao,
} from "@/src/storage/empresaSession";
import { formatarTelefone } from "@/src/utils/formatarTelefone";

export default function EditarPerfilEmpresa() {
  const [empresa, setEmpresa] = useState<EmpresaApi | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function carregar() {
      const sessao = await buscarEmpresaSessao();
      if (!sessao) {
        Alert.alert("Sessao expirada", "Faca login novamente como empresa.");
        router.replace("/login-pj");
        return;
      }

      setEmpresa(sessao);
      setNome(sessao.nome || "");
      setTelefone(sessao.telefone ? formatarTelefone(sessao.telefone) : "");
      setRua(sessao.rua || "");
      setNumero(sessao.numero || "");
      setBairro(sessao.bairro || "");
      setCep(sessao.cep || "");
      setCidade(sessao.cidade || "");
      setEstado(sessao.estado || "");
    }

    void carregar();
  }, []);

  async function handleSalvar() {
    if (!empresa) {
      return;
    }

    if (!nome.trim()) {
      return Alert.alert("Editar dados", "Informe o nome da empresa.");
    }

    try {
      setIsSaving(true);

      const empresaAtualizada = await atualizarEmpresa(empresa.id, {
        nome: nome.trim(),
        telefone: telefone.replace(/\D/g, ""),
        rua: rua.trim() || undefined,
        numero: numero.trim() || undefined,
        bairro: bairro.trim() || undefined,
        cep: cep.replace(/\D/g, "") || undefined,
        cidade: cidade.trim() || undefined,
        estado: estado.trim().toUpperCase() || undefined,
      });

      const sessaoAtualizada = { ...empresa, ...empresaAtualizada };
      await salvarEmpresaSessao(sessaoAtualizada);

      Alert.alert("Sucesso", "Dados da empresa atualizados.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar dados.";
      Alert.alert("Editar dados", message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar dados</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={(text) => setTelefone(formatarTelefone(text))}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Rua / Avenida</Text>
        <TextInput style={styles.input} value={rua} onChangeText={setRua} />

        <Text style={styles.label}>Numero</Text>
        <TextInput style={styles.input} value={numero} onChangeText={setNumero} />

        <Text style={styles.label}>Bairro</Text>
        <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />

        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          value={cep}
          onChangeText={(text) => setCep(text.replace(/\D/g, "").slice(0, 8))}
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
          style={[styles.btn, isSaving ? styles.btnDisabled : null]}
          onPress={handleSalvar}
          disabled={isSaving}
        >
          <Text style={styles.btnText}>{isSaving ? "Salvando..." : "Salvar alteracoes"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
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
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  body: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    fontSize: 15,
    color: "#333",
  },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
