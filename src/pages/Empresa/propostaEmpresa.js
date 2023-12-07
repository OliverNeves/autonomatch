import React, { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Background } from '../Login/styles';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { auth } from '../../contexts/firebaseConfig';


export default function PropostaEmpresa() {
  const [propostas, setPropostas] = useState([]);
  const db = getDatabase();
  const empresaId = auth.currentUser.uid; // ID do usuário empresa

  useEffect(() => {
    const eventosRef = ref(db, 'eventos');

    const unsubscribe = onValue(eventosRef, (snapshot) => {
      const propostasArray = [];

      snapshot.forEach((childSnapshot) => {
        const evento = childSnapshot.val();
        if (evento[empresaId] && evento[empresaId].propostas) {
          for (let propostaId in evento[empresaId].propostas) {
            const proposta = evento[empresaId].propostas[propostaId];
            propostasArray.push({ id: propostaId, ...proposta });
          }
        }
      });

      setPropostas(propostasArray);
    });

    // Limpar o listener ao desmontar o componente
    return () => unsubscribe();
  }, [empresaId]);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.candidaturaText}>{item.nomeTerceirizado}</Text>
        <Text style={styles.candidaturaText}>{item.nomeEvento}</Text>
        <Text style={styles.candidaturaText}>{item.dataEvento}</Text>
        {/* Adicione aqui qualquer outra informação que deseja exibir */}
      </Card.Content>
    </Card>
  );

  return (
    <Background>
      <Text style={styles.texto}>Propostas Aceitas</Text>
      <FlatList
        data={propostas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texto: {
    color: '#fff',
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
});
