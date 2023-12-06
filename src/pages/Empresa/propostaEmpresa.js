import React, { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Background } from '../Login/styles';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome'


export default function PropostaEmpresa() {
  const [propostas, setPropostas] = useState([]);
  const db = getDatabase()
  useEffect(() => {
    // Substitua 'propostas' pelo caminho real no seu banco de dados
    const propostasRef = ref(db, 'propostas');

    const unsubscribe = onValue(propostasRef, (snapshot) => {
      const propostasArray = [];

      snapshot.forEach((childSnapshot) => {
        const proposta = childSnapshot.val();
        propostasArray.push(proposta);
      });

      setPropostas(propostasArray);
    });

    // Limpar o listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

  const removerProposta = (idEvento) => {
    const propostasRef = ref(db, `propostas/${idEvento}`);
  
    // Remove a proposta com o ID correspondente
    remove(propostasRef)
      .then(() => {
        console.log('Proposta removida com sucesso');
      })
      .catch((error) => {
        console.error('Erro ao remover proposta:', error.message);
      });
  };
  
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.candidaturaText}>{item.nomeTerceirizado}</Text>
        <Text style={styles.candidaturaText}>{item.nomeEvento}</Text>
        <Text style={styles.candidaturaText}>{item.dataEvento}</Text>
        <TouchableOpacity onPress={() => removerProposta(item.idEvento)}>
          <FontAwesome name="trash" color="red" size={25}/>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <Background>
      <Text style={styles.texto}>Propostas Enviadas</Text>
      <FlatList
        data={propostas}
        keyExtractor={(item) => item.idEvento}
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
