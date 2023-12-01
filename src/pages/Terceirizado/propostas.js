import React, { useState } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { Card } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Background } from '../Login/styles';

export default function YourComponent() {
  const [isModalVisible, setModalVisible] = useState(false);

  const data = [
    { eventId: '1', nomeEvento: 'Festa', data: '10/01/2024', candidato: 'Anna Festas' },
    { eventId: '2', nomeEvento: 'After', data: '10/01/2024', candidato: 'Lucas Matheus' },
    // Adicione mais dados conforme necessário
  ];
  const data2 = [
    { eventId: '1', nomeEvento: 'Aniversário da Maria', data: '15/03/2024', candidato: '+Diversão' },
    { eventId: '2', nomeEvento: 'Casamento do Enzo', data: '07/08/2024', candidato: 'Lux Events' },
    // Adicione mais dados conforme necessário
  ];

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.candidaturaText}>{item.nomeEvento}</Text>
        <Text style={styles.candidaturaText}>{item.data}</Text>
        <Text style={styles.candidaturaText}>{item.candidato}</Text>
        <TouchableOpacity onPress={() => { /* Ação de exclusão simulada */ }}>
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <Background>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="dollar" size={30} color="green" />
        </TouchableOpacity>
        <Text style={styles.texto}>Propostas Recebidas:</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.eventId}
          renderItem={renderItem}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.texto}>Eventos Confirmados</Text>
            <FlatList
              data={data2}  // Substitua pelos eventos aceitos pelo usuário
              keyExtractor={(item) => item.eventId}
              renderItem={renderItem}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{fontSize: 20, color:"#fff"}}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texto: {
    color: "#fff",
    fontSize: 25,
    alignSelf: 'center',
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    
  },
  candidaturaText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#469CAC',
    
    width: '100%', // Ocupar toda a largura
    height: '100%', // Ocupar toda a altura
  },
  closeButton: {
    backgroundColor: '#121212',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    alignSelf: 'center',
    marginBottom: 10
  },
  texto: {
    color: "#fff",
    fontSize: 25,
    alignSelf: 'center',
    padding: 15,
  },
});
