import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { TopBar } from "@/src/components/TopBar";
import { AvaliacaoQuadraModal } from "@/src/components/AvaliacaoQuadraModal";
import { listarQuadras, type QuadraApi } from "@/src/services/quadrasApi";
import { buscarUsuarioSessao, limparUsuarioSessao } from "@/src/storage/usuarioSession";
import { styles } from "@/src/styles/quadras.styles";
import { supabase } from "@/src/services/supabase";
import { getQuadraImageSource } from "@/src/utils/quadraImages";

export default function TelaListaQuadras() {
  const { modalidadeSelecionada } = useLocalSearchParams<{ modalidadeSelecionada?: string }>();

  const [quadras, setQuadras] = useState<QuadraApi[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [quadraParaAvaliar, setQuadraParaAvaliar] = useState<QuadraApi | null>(null);

  useEffect(() => {
    async function inicializarTela() {
      try {
        setLoading(true);
        const usuarioLogado = await buscarUsuarioSessao();

        if (!usuarioLogado) {
          Alert.alert("Acesso negado", "Você precisa estar logado para ver as quadras.");
          router.replace("/login-pf");
          return;
        }

        const dados = await listarQuadras();
        
        if (dados && modalidadeSelecionada) {
          const dadosFiltrados = dados.filter(
            (quadra) => quadra.tipo?.toLowerCase().trim() === modalidadeSelecionada.toLowerCase().trim()
          );
          setQuadras(dadosFiltrados);
        } else if (dados) {
          setQuadras(dados);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    }

    void inicializarTela();
  }, [modalidadeSelecionada]);

  // FUNÇÃO PARA SALVAR NO BANCO
  async function enviarAvaliacaoAoBanco(estrelas: number, comentario: string) {
    if (!quadraParaAvaliar) return;

    const usuario = await buscarUsuarioSessao();
    
    const { error } = await supabase
      .from('avaliacoes')
      .insert([
        { 
          quadra_id: quadraParaAvaliar.id, 
          usuario_id: usuario?.id, 
          estrelas: estrelas, 
          comentario: comentario 
        }
      ]);

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao salvar avaliação: " + error.message);
    } else {
      Alert.alert("Sucesso", "Avaliação enviada com sucesso!");
      setModalVisible(false);
    }
  }

  function renderItemQuadra({ item }: { item: QuadraApi }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardInfoContainer}>
          <Text style={styles.nomeQuadra}>{item.nome}</Text>
          <Text style={styles.infoTexto}>Esporte: {item.tipo || "Nao informado"}</Text>
          <Text style={styles.infoTexto}>
            Valor: {typeof item.preco === "number" ? `R$ ${item.preco.toFixed(2).replace(".", ",")}/h` : "Preco sob consulta"}
          </Text>
          <Text style={styles.infoTexto}>Complexo: {item.empresa_nome || "FairPlay"}</Text>
        </View>

        <View style={styles.cardAcoesContainer}>
          <View style={styles.botoesContainer}>
            <TouchableOpacity 
              style={styles.botaoAvaliar}
              onPress={() => {
                setQuadraParaAvaliar(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.textoBotao}>Avaliar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.botaoAgendar}
              onPress={() => router.push({ pathname: "/reserva/[quadraId]", params: { quadraId: String(item.id) } })}
            >
              <Text style={styles.textoBotao}>Agendar</Text>
            </TouchableOpacity>
          </View>
          <Image source={getQuadraImageSource(item)} style={styles.imagemQuadra} resizeMode="cover" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ width: '100%', maxWidth: 480, alignSelf: 'center', flex: 1 }}>
        <TopBar onBack={() => router.back()} enableMenu tipoUsuario="pf" onLogout={async () => { await limparUsuarioSessao(); router.replace("/escolher-tipo"); }} />

        {loading ? (
          <View style={styles.loadingBox}><ActivityIndicator size="large" color="#2D81D5" /></View>
        ) : (
          <FlatList
            data={quadras}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItemQuadra}
            contentContainerStyle={styles.content}
          />
        )}
      </View>

      <AvaliacaoQuadraModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSend={enviarAvaliacaoAoBanco} 
      />
    </View>
  );
}