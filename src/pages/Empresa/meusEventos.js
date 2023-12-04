import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {Background} from '../Login/styles';
import {getDatabase, ref, get, remove} from 'firebase/database';
import {auth} from '../../contexts/firebaseConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function MeusEventos() {
  const [eventos, setEventos] = useState([]);
  const navigation = useNavigation()
    const user = auth.currentUser;
    const userId = user.uid;

    const excluirEvento = async eventId => {
      try {
        const user = auth.currentUser;
        const userId = user.uid;
        const db = getDatabase();
  
        const eventoRef = ref(db, `eventos/${userId}/${eventId}`);
  
        await remove(eventoRef);
  
        console.log('Evento excluído com sucesso!');
  
        const novosEventos = eventos.filter(evento => evento.eventId !== eventId);
        setEventos(novosEventos);
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    };

  const buscarEventos = async () => {
    const db = getDatabase();
    const eventosRef = ref(db, `eventos/${userId}`);

    try {
      const eventosSnapshot = await get(eventosRef);
      const eventosData = eventosSnapshot.val();

      if (eventosData) {
        const eventosArray = Object.values(eventosData).map(evento => evento);
        setEventos(eventosArray);
      } else {
        setEventos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      buscarEventos();
    }
  }, [userId]);

  const paginaCandidatos = (evento) => {
    console.log(evento);
    navigation.navigate('PagCandidatos', { evento });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => paginaCandidatos(item)}>
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nomeEvento}</Text>
        <Text style={styles.cardTitle}>{item.data}</Text>
        <Text style={styles.cardTitle}>{item.local}</Text>
        <TouchableOpacity
        onPress={() => excluirEvento(item.eventId)}>
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
    </TouchableOpacity>
  );

  return (
    <Background>
      <Text style={styles.title}>Meus Eventos</Text>
    <View style={styles.container}>
    
      <FlatList
        data={eventos}
        renderItem={renderItem}
        keyExtractor={(item) => item.eventId}
      />
    </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  cardContent:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    color: '#fff',
    fontSize: 25,
    alignSelf: 'center',
    padding: 10,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});



