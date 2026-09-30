import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase'; // Ajuste o caminho se necessário

interface Opcao {
  label: string;
  valor: string;
}

interface Mensagem {
  id: string;
  remetente: 'cliente' | 'admin';
  texto: string;
  hora: string;
  opcoes?: Opcao[];
}

export default function Conversa() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [novaMensagem, setNovaMensagem] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDadosDaReserva();
  }, []);

  // Formata a data de YYYY-MM-DD para DD/MM/YYYY
  const formatarData = (dataString: string) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const carregarDadosDaReserva = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          id,
          data,
          horario,
          usuarios ( nome ),
          quadras ( nome )
        `)
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Erro ao buscar reserva:", error);
        return;
      }

      if (data) {
        // CORREÇÃO DO TYPESCRIPT: Forçando o tipo como 'any' temporariamente para evitar o erro de tipo 'never'
        const usuariosData = data.usuarios as any;
        const quadrasData = data.quadras as any;

        // Mapeia os dados tratando se o retorno do Supabase vier como Objeto ou Array
        const nomeUsuario = Array.isArray(usuariosData) 
          ? usuariosData[0]?.nome 
          : usuariosData?.nome || 'Cliente';

        const nomeQuadra = Array.isArray(quadrasData) 
          ? quadrasData[0]?.nome 
          : quadrasData?.nome || 'a quadra';

        const dataReserva = formatarData(data.data);
        const horarioReserva = data.horario ? data.horario.substring(0, 5) : 'horário não definido';

        // Monta a mensagem dinâmica do bot
        const mensagemInicial: Mensagem = {
          id: 'msg-1',
          remetente: 'admin',
          texto: `Olá, ${nomeUsuario}! Você deseja confirmar o aluguel da ${nomeQuadra} para o dia ${dataReserva} às ${horarioReserva}?`,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          opcoes: [
            { label: 'Sim, confirmar', valor: 'sim' },
            { label: 'Não, cancelar', valor: 'nao' }
          ]
        };

        setMensagens([mensagemInicial]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const enviarMensagemTexto = () => {
    if (novaMensagem.trim() === '') return;
    adicionarMensagemCliente(novaMensagem);
    setNovaMensagem('');
  };

  const adicionarMensagemCliente = (texto: string) => {
    const msg: Mensagem = {
      id: Date.now().toString(),
      remetente: 'cliente',
      texto: texto,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMensagens(prev => [...prev, msg]);
  };

  const selecionarOpcao = (opcao: Opcao, idMensagemOriginal: string) => {
    if (opcao.valor === 'nao') {
      router.back();
      return;
    }

    setMensagens(prev => prev.map(msg => 
      msg.id === idMensagemOriginal ? { ...msg, opcoes: undefined } : msg
    ));

    adicionarMensagemCliente(opcao.label);

    setTimeout(() => {
      const msgBot: Mensagem = {
        id: Date.now().toString(),
        remetente: 'admin',
        texto: 'Reservado com sucesso!',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMensagens(prev => [...prev, msgBot]);
    }, 1000);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
        </TouchableOpacity>
        <Image 
          source={require('../../assets/images/Logo FairPlay.png')} 
          style={styles.headerLogo} 
        />
      </View>

      <Text style={styles.contactName}>{id === 'oficial' ? 'FairPlay (Oficial)' : 'Atendimento'}</Text>

      <ScrollView contentContainerStyle={styles.chatContainer}>
        {mensagens.length === 0 ? (
          <Text style={styles.emptyChatText}>Mande um "Olá" para começar a conversa!</Text>
        ) : (
          mensagens.map((msg) => {
            const isCliente = msg.remetente === 'cliente';
            return (
              <View key={msg.id} style={{ marginBottom: 20 }}>
                <View style={[styles.messageWrapper, isCliente ? styles.wrapperCliente : styles.wrapperAdmin, { marginBottom: 5 }]}>
                  {!isCliente && (
                    <Image source={require('../../assets/images/Logo FairPlay.png')} style={styles.avatarLogo} />
                  )}
                  <View style={styles.bubbleContainer}>
                    <View style={[styles.bubble, isCliente ? styles.bubbleCliente : styles.bubbleAdmin]}>
                      <Text style={styles.messageText}>{msg.texto}</Text>
                    </View>
                    <Text style={[styles.timestamp, isCliente ? { textAlign: 'right' } : { textAlign: 'left' }]}>
                      {msg.hora}
                    </Text>
                  </View>
                  {isCliente && (
                    <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatarUser} />
                  )}
                </View>

                {msg.opcoes && !isCliente && (
                  <View style={styles.optionsContainer}>
                    {msg.opcoes.map((opcao, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.optionButton}
                        onPress={() => selecionarOpcao(opcao, msg.id)}
                      >
                        <Text style={styles.optionText}>{opcao.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChangeText={setNovaMensagem}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={enviarMensagemTexto}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 120, marginBottom: 5 },
  backButton: { marginRight: 10 },
  headerLogo: { width: 110, height: 110, resizeMode: 'contain' },
  contactName: { textAlign: 'right', fontSize: 16, fontWeight: 'bold', paddingRight: 25, marginBottom: 15, color: '#666' },
  chatContainer: { paddingHorizontal: 15, paddingBottom: 20, flexGrow: 1, justifyContent: 'flex-end' },
  emptyChatText: { textAlign: 'center', color: '#999', marginTop: 50 },
  messageWrapper: { flexDirection: 'row', alignItems: 'flex-end' },
  wrapperCliente: { justifyContent: 'flex-end' },
  wrapperAdmin: { justifyContent: 'flex-start' },
  avatarUser: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
  avatarLogo: { width: 35, height: 35, marginRight: 10, resizeMode: 'contain' },
  bubbleContainer: { maxWidth: '75%' },
  bubble: { backgroundColor: '#e6e6e6', borderWidth: 1, borderColor: '#333', padding: 15, minHeight: 50 },
  bubbleCliente: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 0 },
  bubbleAdmin: { borderTopRightRadius: 20, borderBottomRightRadius: 20, borderTopLeftRadius: 20, borderBottomLeftRadius: 0, backgroundColor: '#f0f0f0' },
  messageText: { color: '#000', fontSize: 14 },
  timestamp: { fontSize: 12, fontWeight: 'bold', color: '#666', marginTop: 5 },
  optionsContainer: { marginLeft: 45, marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#000', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15 },
  optionText: { color: '#000', fontSize: 13, fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10, maxHeight: 100, marginRight: 10 },
  sendButton: { backgroundColor: '#000', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});