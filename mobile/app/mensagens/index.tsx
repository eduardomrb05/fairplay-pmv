import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase'; // Ajuste o caminho se necessário

interface ChatItem {
  id: string;
  nome: string;
  dia: string;
  hora: string;
  notificacoes: number;
}

interface Contato {
  id: string;
  nome: string;
  isOficial?: boolean;
}

export default function ListaMensagens() {
  const router = useRouter();
  const [conversas, setConversas] = useState<ChatItem[]>([]); 
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados para os contatos dinâmicos
  const [contatosDisponiveis, setContatosDisponiveis] = useState<Contato[]>([]);
  const [loadingContatos, setLoadingContatos] = useState(false);

  useEffect(() => {
    buscarQuadras();
  }, []);

  const buscarQuadras = async () => {
    try {
      setLoadingContatos(true);
      
      // Busca as quadras no banco de dados
      const { data, error } = await supabase
        .from('quadras')
        .select('id, nome')
        .order('nome', { ascending: true });

      if (error) {
        console.error("Erro ao buscar quadras:", error);
        return;
      }

      if (data) {
        // Mapeia os dados do banco para o formato de Contato
        const quadrasMapeadas: Contato[] = data.map((quadra: any) => ({
          id: quadra.id.toString(), // Converte ID para string para uso na rota
          nome: quadra.nome,
          isOficial: false
        }));

        // Adiciona o contato Oficial fixo no topo + as quadras do banco
        setContatosDisponiveis([
          { id: 'oficial', nome: 'FairPlay (Oficial)', isOficial: true },
          ...quadrasMapeadas
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContatos(false);
    }
  };

  const iniciarConversa = (contato: Contato) => {
    const jaExiste = conversas.find(c => c.id === contato.id);
    
    if (!jaExiste) {
      const novoChat: ChatItem = {
        id: contato.id,
        nome: contato.nome,
        dia: 'hoje',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notificacoes: 0,
      };
      setConversas([novoChat, ...conversas]);
    }
    
    setModalVisible(false);
    router.push(`/mensagens/${contato.id}`);
  };

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/mensagens/${item.id}`)}
    >
      <View style={styles.cardInfo}>
        <Image 
          source={require('../../assets/images/Logo FairPlay.png')} 
          style={styles.logoItem} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>FairPlay: <Text style={styles.nomeCliente}>{item.nome}</Text></Text>
        </View>
      </View>
      
      <View style={styles.rightInfo}>
        <Text style={styles.timeText}>{item.dia}</Text>
        <Text style={styles.timeTextBold}>{item.hora}</Text>
        <View style={styles.bellContainer}>
          <Ionicons name="notifications" size={24} color="black" />
          {item.notificacoes > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.notificacoes}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
        </TouchableOpacity>
        <Image 
          source={require('../../assets/images/Logo FairPlay.png')} 
          style={styles.headerLogo} 
        />
      </View>
      
      <Text style={styles.pageTitle}>Mensagens</Text>
      
      {conversas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhuma conversa iniciada ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={conversas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Conversa</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {loadingContatos ? (
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
              ) : (
                contatosDisponiveis.map((contato) => (
                  <TouchableOpacity 
                    key={contato.id} 
                    style={styles.contatoRow}
                    onPress={() => iniciarConversa(contato)}
                  >
                    <Image 
                      source={require('../../assets/images/Logo FairPlay.png')} 
                      style={styles.contatoLogo} 
                    />
                    <Text style={[styles.contatoNome, contato.isOficial && styles.textoOficial]}>
                      {contato.nome}
                    </Text>
                    {contato.isOficial && (
                      <Ionicons name="checkmark-circle" size={16} color="#00bfff" style={{marginLeft: 5}} />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Botão FAB para abrir o Modal */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={35} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    height: 120, 
    marginBottom: 10 
  },
  backButton: { marginRight: 10 },
  headerLogo: { width: 110, height: 110, resizeMode: 'contain' },
  pageTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 25, marginBottom: 20 },
  listContainer: { paddingHorizontal: 15, paddingBottom: 100 },
  logoItem: { width: 50, height: 50, marginRight: 10, resizeMode: 'contain' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center'
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: 'bold' },
  nomeCliente: { fontWeight: 'normal', color: '#555' },
  rightInfo: { alignItems: 'flex-end' },
  timeText: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  timeTextBold: { fontSize: 12, color: '#333', fontWeight: 'bold', marginBottom: 5 },
  bellContainer: { position: 'relative' },
  badge: {
    position: 'absolute', top: -5, right: -5, backgroundColor: 'red',
    borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center'
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyStateText: { fontSize: 16, color: '#888' },
  fab: {
    position: 'absolute', bottom: 30, right: 20, backgroundColor: '#000',
    width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3,
  },
  
  // ESTILOS DO MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', 
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '60%', 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  contatoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  contatoLogo: { width: 35, height: 35, marginRight: 15, resizeMode: 'contain' },
  contatoNome: { fontSize: 16, color: '#333' },
  textoOficial: { fontWeight: 'bold', color: '#000' },
});