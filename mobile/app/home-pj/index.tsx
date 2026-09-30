import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { TopBar } from "@/src/components/TopBar";
import { styles } from "@/src/styles/home-pj.styles";
import { buscarEmpresaSessao, limparEmpresaSessao } from "@/src/storage/empresaSession";
import type { EmpresaApi } from "@/src/services/authApi";
import { atualizarQuadra, excluirQuadra, listarQuadras, type QuadraApi } from "@/src/services/quadrasApi";
import { getQuadraImageSource } from "@/src/utils/quadraImages";

export default function HomePJ() {
  type SortKey = "recentes" | "nome" | "preco";

  const [empresa, setEmpresa] = useState<EmpresaApi | null>(null);
  const [quadrasEmpresa, setQuadrasEmpresa] = useState<QuadraApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("recentes");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingQuadra, setEditingQuadra] = useState<QuadraApi | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editTipo, setEditTipo] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editRua, setEditRua] = useState("");
  const [editNumero, setEditNumero] = useState("");
  const [editBairro, setEditBairro] = useState("");
  const [editCidade, setEditCidade] = useState("");
  const [editCep, setEditCep] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    async function carregarSessaoEmpresa() {
      const sessao = await buscarEmpresaSessao();
      if (!sessao) {
        Alert.alert("Sessao expirada", "Faca login novamente como empresa.");
        router.replace("/login-pj");
        return;
      }
      setEmpresa(sessao);
    }

    void carregarSessaoEmpresa();
  }, []);

  const carregarQuadrasEmpresa = useCallback(async () => {
    if (!empresa) {
      return;
    }

    try {
      setIsLoading(true);
      const todasQuadras = await listarQuadras();
      setQuadrasEmpresa(todasQuadras.filter((quadra) => Number(quadra.empresa_id) === Number(empresa.id)));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nao foi possivel carregar as quadras da empresa.";
      Alert.alert("Home Empresa", message);
    } finally {
      setIsLoading(false);
    }
  }, [empresa]);

  useFocusEffect(
    useCallback(() => {
      void carregarQuadrasEmpresa();
    }, [carregarQuadrasEmpresa]),
  );

  async function handleSair() {
    await limparEmpresaSessao();
    router.replace("/login-pj");
  }

  function handleAbrirEdicao(quadra: QuadraApi) {
    setEditingQuadra(quadra);
    setEditNome(quadra.nome || "");
    setEditTipo(quadra.tipo || "");
    setEditPreco(typeof quadra.preco === "number" ? String(quadra.preco).replace(".", ",") : "");
    setEditRua(quadra.rua || "");
    setEditNumero(quadra.numero || "");
    setEditBairro(quadra.bairro || "");
    setEditCidade(quadra.cidade || "");
    setEditCep((quadra.cep || "").replace(/\D/g, ""));
    setEditModalVisible(true);
  }

  async function handleSalvarEdicao() {
    if (!empresa || !editingQuadra) {
      return;
    }

    const nomeLimpo = editNome.trim();
    const tipoLimpo = editTipo.trim();
    const precoNormalizado = editPreco.trim().replace(",", ".");
    const precoNumero = precoNormalizado ? Number(precoNormalizado) : null;

    if (!nomeLimpo) {
      return Alert.alert("Edicao de quadra", "O nome da quadra e obrigatorio.");
    }

    if (precoNormalizado && (!Number.isFinite(precoNumero) || (precoNumero ?? 0) < 0)) {
      return Alert.alert("Edicao de quadra", "Digite um preco valido.");
    }

    try {
      setIsSavingEdit(true);

      await atualizarQuadra(editingQuadra.id, {
        empresa_id: empresa.id,
        nome: nomeLimpo,
        tipo: tipoLimpo || null,
        preco: precoNumero,
        rua: editRua.trim() || null,
        numero: editNumero.trim() || null,
        bairro: editBairro.trim() || null,
        cidade: editCidade.trim() || null,
        cep: editCep.replace(/\D/g, "") || null,
      });

      setEditModalVisible(false);
      setEditingQuadra(null);
      await carregarQuadrasEmpresa();
      Alert.alert("Sucesso", "Quadra atualizada com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar quadra.";
      Alert.alert("Edicao de quadra", message);
    } finally {
      setIsSavingEdit(false);
    }
  }

  function handleSolicitarExclusao(quadra: QuadraApi) {
    if (!empresa) {
      return;
    }

    Alert.alert(
      "Excluir quadra",
      `Tem certeza que deseja excluir a quadra "${quadra.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirQuadra(quadra.id, empresa.id);
              await carregarQuadrasEmpresa();
              Alert.alert("Sucesso", "Quadra excluida com sucesso.");
            } catch (error) {
              const message = error instanceof Error ? error.message : "Erro ao excluir quadra.";
              Alert.alert("Excluir quadra", message);
            }
          },
        },
      ],
    );
  }

  function formatarEndereco(quadra: QuadraApi) {
    const endereco = [quadra.rua, quadra.numero, quadra.bairro, quadra.cidade]
      .filter((item) => item && item.trim().length > 0)
      .join(", ");
    return endereco || "Endereco nao informado";
  }

  const quadrasOrdenadas = useMemo(() => {
    const lista = [...quadrasEmpresa];

    if (sortKey === "nome") {
      return lista.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    if (sortKey === "preco") {
      return lista.sort((a, b) => {
        const precoA = typeof a.preco === "number" ? a.preco : Number.POSITIVE_INFINITY;
        const precoB = typeof b.preco === "number" ? b.preco : Number.POSITIVE_INFINITY;
        return precoA - precoB;
      });
    }

    return lista.sort((a, b) => b.id - a.id);
  }, [quadrasEmpresa, sortKey]);

  return (
    <View style={styles.screen}>
      <TopBar
        enableMenu
        tipoUsuario="pj"
        onLogout={handleSair}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Home Empresa</Text>
        <Text style={styles.subtitle}>
          {empresa ? `Bem-vindo, ${empresa.nome}.` : "Bem-vindo ao painel da sua empresa."}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gestao de quadras</Text>
          <Text style={styles.cardText}>
            Cadastre novas quadras para disponibiliza-las no app e facilitar reservas dos jogadores.
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/cadastro-quadra")}>
          <Text style={styles.primaryButtonText}>Cadastrar quadra</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Minhas quadras</Text>
        <View style={styles.sortRow}>
          <TouchableOpacity
            style={[styles.sortChip, sortKey === "recentes" ? styles.sortChipActive : null]}
            onPress={() => setSortKey("recentes")}
          >
            <Text style={[styles.sortChipText, sortKey === "recentes" ? styles.sortChipTextActive : null]}>
              Mais recentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortChip, sortKey === "nome" ? styles.sortChipActive : null]}
            onPress={() => setSortKey("nome")}
          >
            <Text style={[styles.sortChipText, sortKey === "nome" ? styles.sortChipTextActive : null]}>
              Nome
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortChip, sortKey === "preco" ? styles.sortChipActive : null]}
            onPress={() => setSortKey("preco")}
          >
            <Text style={[styles.sortChipText, sortKey === "preco" ? styles.sortChipTextActive : null]}>
              Preco
            </Text>
          </TouchableOpacity>
        </View>
        {isLoading ? <ActivityIndicator /> : null}
        {!isLoading && !quadrasEmpresa.length ? (
          <Text style={styles.emptyText}>Voce ainda nao cadastrou quadras.</Text>
        ) : null}

        {!isLoading &&
          quadrasOrdenadas.map((quadra) => (
            <View key={quadra.id} style={styles.quadraCard}>
              <View style={styles.quadraCardContent}>
                <Image
                  source={getQuadraImageSource(quadra)}
                  style={styles.quadraImage}
                  resizeMode="cover"
                />
                <View style={styles.quadraDetails}>
                  <Text style={styles.quadraNome}>{quadra.nome}</Text>
                  <Text style={styles.quadraInfo}>Modalidade: {quadra.tipo || "Nao definida"}</Text>
                  <Text style={styles.quadraInfo}>
                    Valor: {typeof quadra.preco === "number" ? `R$ ${quadra.preco.toFixed(2)}` : "Consultar"}
                  </Text>
                  <Text style={styles.quadraInfo}>Endereco: {formatarEndereco(quadra)}</Text>
                </View>
              </View>

              <View style={styles.quadraActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleAbrirEdicao(quadra)}
                >
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleSolicitarExclusao(quadra)}
                >
                  <Text style={styles.actionButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

      </ScrollView>

      <Modal visible={editModalVisible} transparent animationType="fade" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar quadra</Text>

            <Text style={styles.modalLabel}>Nome</Text>
            <TextInput value={editNome} onChangeText={setEditNome} style={styles.modalInput} />

            <Text style={styles.modalLabel}>Modalidade</Text>
            <TextInput value={editTipo} onChangeText={setEditTipo} style={styles.modalInput} />

            <Text style={styles.modalLabel}>Preco por hora (R$)</Text>
            <TextInput
              value={editPreco}
              onChangeText={setEditPreco}
              style={styles.modalInput}
              keyboardType="decimal-pad"
              placeholder="Ex: 120,00"
            />

            <Text style={styles.modalLabel}>Rua / Avenida</Text>
            <TextInput value={editRua} onChangeText={setEditRua} style={styles.modalInput} />

            <Text style={styles.modalLabel}>Numero</Text>
            <TextInput
              value={editNumero}
              onChangeText={(text) => setEditNumero(text.replace(/[^\dA-Za-z]/g, ""))}
              style={styles.modalInput}
            />

            <Text style={styles.modalLabel}>Bairro</Text>
            <TextInput value={editBairro} onChangeText={setEditBairro} style={styles.modalInput} />

            <Text style={styles.modalLabel}>Cidade</Text>
            <TextInput value={editCidade} onChangeText={setEditCidade} style={styles.modalInput} />

            <Text style={styles.modalLabel}>CEP</Text>
            <TextInput
              value={editCep}
              onChangeText={(text) => setEditCep(text.replace(/\D/g, "").slice(0, 8))}
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="Somente numeros"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalCancel]}
                onPress={() => setEditModalVisible(false)}
                disabled={isSavingEdit}
              >
                <Text style={styles.modalActionText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalSave]}
                onPress={handleSalvarEdicao}
                disabled={isSavingEdit}
              >
                <Text style={[styles.modalActionText, styles.modalActionTextLight]}>
                  {isSavingEdit ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
