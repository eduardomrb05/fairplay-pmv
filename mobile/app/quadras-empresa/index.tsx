import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { TopBar } from "@/src/components/TopBar";
import { listarQuadras, type QuadraApi } from "@/src/services/quadrasApi";
import { buscarUsuarioSessao, limparUsuarioSessao } from "@/src/storage/usuarioSession";
import { styles } from "@/src/styles/quadras.styles";

const IMAGEM_PADRAO =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop";

export default function TelaListaQuadrasEmpresa() {
  const [quadras, setQuadras] = useState<QuadraApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarQuadrasDaEmpresa() {
      try {
        setLoading(true);
        const usuarioLogado = await buscarUsuarioSessao();

        if (!usuarioLogado) {
          router.replace("/login-pj"); // Ajuste conforme sua rota de login de empresa
          return;
        }

        const dados = await listarQuadras();
        
        // Filtra apenas as quadras que pertencem à empresa logada
        // Verifique se o objeto usuarioLogado contém o id da empresa ou se a quadra traz o empresa_id
        if (dados) {
          const quadrasFiltradas = dados.filter(
            (quadra) => quadra.empresa_id === usuarioLogado.id 
          );
          setQuadras(quadrasFiltradas);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar suas quadras.");
      } finally {
        setLoading(false);
      }
    }

    void carregarQuadrasDaEmpresa();
  }, []);

  function renderItemQuadra({ item }: { item: QuadraApi }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardInfoContainer}>
          <Text style={styles.nomeQuadra}>{item.nome}</Text>
          <Text style={styles.infoTexto}>Esporte: {item.tipo || "Não informado"}</Text>
          <Text style={styles.infoTexto}>
            Valor: {typeof item.preco === "number" ? `R$ ${item.preco.toFixed(2).replace(".", ",")}/h` : "Preço sob consulta"}
          </Text>
        </View>
        <Image source={{ uri: IMAGEM_PADRAO }} style={styles.imagemQuadra} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ width: '100%', maxWidth: 480, alignSelf: 'center', flex: 1 }}>
        <TopBar 
          onBack={() => router.back()} 
          enableMenu 
          tipoUsuario="pj" 
          onLogout={async () => { 
            await limparUsuarioSessao(); 
            router.replace("/escolher-tipo"); 
          }} 
        />

        {loading ? (
          <View style={styles.loadingBox}><ActivityIndicator size="large" color="#2D81D5" /></View>
        ) : (
          <FlatList
            data={quadras}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItemQuadra}
            contentContainerStyle={styles.content}
            ListHeaderComponent={<Text style={styles.title}>Minhas Quadras</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma quadra cadastrada.</Text>}
          />
        )}
      </View>
    </View>
  );
}