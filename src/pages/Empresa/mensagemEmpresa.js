import React from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Background } from '../Login/styles';

export default function YourComponent() {
  const data = [
    { eventId: '1', nomeEvento: 'Festa', data: '10/01/2024', candidato: 'Fernando' },
    { eventId: '2', nomeEvento: 'After', data: '10/01/2024', candidato: 'Lucas Matheus' },
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
      <Text style={styles.texto}>Propostas Enviadas:</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.eventId}
        renderItem={renderItem}
      />
    </View>
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
    fontWeight: 'bold'
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Alinhe verticalmente os itens no centro
    padding: 16,
  },
});
