import React, {useEffect, useState} from 'react';
import {Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Background} from '../Login/styles';
import {getDatabase, ref, get, remove} from 'firebase/database';
import {auth} from '../../contexts/firebaseConfig';
import {Card} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function MensagemTerceirizado() {
  const [candidaturas, setCandidaturas] = useState([]);

  const excluirCandidatura = async (eventId, randomId) => {
    try {
      const userId = auth.currentUser.uid;
      const db = getDatabase();
      const candidaturaRef = ref(
        db,
        `users/${userId}/candidaturas/${randomId}`,
      );

      await remove(candidaturaRef);

      console.log('Candidatura excluída com sucesso!');

      // Atualize o estado aqui
      // Suponha que candidaturas seja um array de objetos candidatura
      // Cada objeto candidatura tem uma propriedade randomId
      const novasCandidaturas = candidaturas.filter(
        candidatura => candidatura.randomId !== randomId,
      );
      setCandidaturas(novasCandidaturas);
    } catch (error) {
      console.error('Erro ao excluir candidatura:', error);
    }
  };

  useEffect(() => {
    const getCandidaturasUsuario = async () => {
      try {
        const db = getDatabase();
        const userId = auth.currentUser.uid;
        const candidaturasRef = ref(db, `users/${userId}/candidaturas`);

        const snapshot = await get(candidaturasRef);
        const candidaturasUsuario = [];

        if (snapshot.exists()) {
          for (let randomId in snapshot.val()) {
            const candidatura = snapshot.val()[randomId];
            // Inclua o randomId em cada objeto de candidatura
            candidatura.randomId = randomId;
            candidaturasUsuario.push(candidatura);
          }
        }

        return candidaturasUsuario;
      } catch (error) {
        console.error('Erro ao obter candidaturas:', error);
        return [];
      }
    };

    const fetchCandidaturas = async () => {
      const candidaturasUsuario = await getCandidaturasUsuario();
      setCandidaturas(candidaturasUsuario);
    };

    fetchCandidaturas();
  }, [candidaturas]);

  return (
    <Background>
      <Text style={styles.texto}>Suas Candidaturas:</Text>
      <FlatList
        data={candidaturas}
        keyExtractor={item => item.eventId}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Content style={styles.content}>
              <Text style={styles.candidaturaText}>{item.nomeEvento}</Text>
              <Text style={styles.candidaturaText}>{item.data}</Text>
              <Text style={styles.candidaturaText}>{item.horario}</Text>
              <TouchableOpacity
                onPress={() => excluirCandidatura(item.eventId, item.randomId)}>
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        )}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
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
  },
});
