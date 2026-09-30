import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export function AvaliacaoQuadraModal({ visible, onClose, onSend }: any) {
  const [comentario, setComentario] = useState('');
  const [estrelas, setEstrelas] = useState(0);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.titulo}>AVALIAÇÃO DE EXPERIÊNCIA</Text>
          
          {/* Aqui você pode colocar um componente de 5 estrelas clicáveis */}
          <View style={styles.estrelasContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setEstrelas(i)}>
                <Text style={{ fontSize: 30, color: i <= estrelas ? '#FFD700' : '#CCC' }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Deixe um comentário (opcional)..."
            value={comentario}
            onChangeText={setComentario}
          />
          
          <TouchableOpacity style={styles.botaoEnviar} onPress={() => onSend(estrelas, comentario)}>
            <Text style={styles.textoBotao}>ENVIAR AVALIAÇÃO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: 'white', padding: 25, borderRadius: 15, width: '90%', alignItems: 'center' },
  titulo: { fontWeight: 'bold', marginBottom: 15 },
  estrelasContainer: { flexDirection: 'row', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', width: '100%', padding: 10, borderRadius: 8, marginBottom: 15 },
  botaoEnviar: { backgroundColor: '#8BC34A', padding: 15, borderRadius: 25, width: '100%', alignItems: 'center' },
  textoBotao: { color: 'white', fontWeight: 'bold' }
});