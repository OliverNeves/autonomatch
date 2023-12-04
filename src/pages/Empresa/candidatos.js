import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View, Modal, ScrollView} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {getDatabase, ref, get} from 'firebase/database';
import {auth} from '../../contexts/firebaseConfig';
import { Background } from '../Login/styles';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { abrirWhatsApp } from './perfilEmpresa';

export default function Candidatos({route, navigation}) {
  const [candidaturas, setCandidaturas] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {evento} = route.params;
  const user = auth.currentUser;
  const userId = user.uid;

  const buscarCandidaturas = async eventId => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    try {
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val();

      if (usersData) {
        const candidaturasEvento = [];
        for (let userId in usersData) {
          const user = usersData[userId];
          if (user.candidaturas) {
            for (let candidaturaId in user.candidaturas) {
              const candidatura = user.candidaturas[candidaturaId];
              if (candidatura.eventId === eventId) {
                candidatura.userId = userId;
                candidatura.userData = user; 
                console.log('userId atribuído:', userId);
                candidaturasEvento.push(candidatura);
              }
            }
          }
        }

        setCandidaturas(candidaturasEvento);
      } else {
        setCandidaturas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      buscarCandidaturas(evento.eventId);
    }
  }, [userId]);

  const openUserModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    
    <TouchableOpacity onPress={() => openUserModal(item.userData)}>
      {console.log(item.userData)}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.userData.username}</Text>
          
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Background>
      <Text style={styles.title}>Candidatos</Text>
    <View style={styles.container}>
      <FlatList
        data={candidaturas}
        renderItem={renderItem}
        keyExtractor={(item) => item.candidaturaId}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.inputText}>Fechar</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeUserModal}
      >
        {selectedUser && (
          <Background>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => closeUserModal()}>
              <Feather name="x" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={styles.containerDados}>
              <View style={styles.user}>
                <FontAwesome name="user" size={115} color="#469CAC" />
              </View>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dados}>Nome: {selectedUser.username}</Text>
              <TouchableOpacity
                onPress={() => abrirWhatsApp(selectedUser.telefone)}>
                <Text style={styles.dados}>
                  Telefone: {selectedUser.telefone}{' '}
                  <FontAwesome name="whatsapp" color="green" size={23} />
                </Text>
              </TouchableOpacity>
              <Text style={styles.dados}>Email: {selectedUser.email}</Text>
              <Text style={styles.dados}>
                Data de Nascimento: {selectedUser.dtNasc}
              </Text>
              <Text style={styles.dados}>
                Especialidade:{' '}
                {selectedUser.especialidade === 'cozinheiro'
                  ? 'Cozinheiro(a)'
                  : selectedUser.especialidade === 'auxiliar'
                  ? 'Auxiliar de Cozinha'
                  : selectedUser.especialidade === 'garcom'
                  ? 'Garçom / Garçonete'
                  : selectedUser.especialidade === 'sgerais'
                  ? 'Serviços Gerais'
                  : selectedUser.especialidade}
              </Text>
              <Text style={styles.dados}>Experiência: </Text>
              <ScrollView
                style={{
                  borderColor: '#151A24',
                  borderWidth: 2,
                  width: '100%',
                  height: 150,
                  padding: 10,
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                <Text style={styles.xp}>{selectedUser.experiencia}</Text>
              </ScrollView>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity
                  style={styles.contratar}
                  onPress={() => {
                    if (selectedUser && selectedEvent) {
                      diminuirVaga( selectedUser, selectedEvent);
                    } else {
                      console.error('Usuário ou evento não selecionado.');
                    }
                  }}>
                  <Text style={styles.textStyle}>Contratar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contratar}>
                  <Text style={styles.textStyle}>Recusar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Background>
        )}
      </Modal>
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
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 25,
    alignSelf: 'center',
    padding: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: '100%',
    height: '110%',
    margin: 20,
    backgroundColor: "#469CAC",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  dados: {
    color: '#fff',
    fontSize: 20,
  },
  dadosContainer: {
    padding: 10,
  },

  containerDados: {
    alignItems: 'center',
    padding: 25,
  },
  user: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 30,
    borderRadius: 100,
    height: 130,
    width: 130,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  xp: {
    color: '#469CAC',
    fontWeight: 'bold',
    fontSize: 20,
  },
  contratar: {
    backgroundColor: '#121212',
    alignSelf: 'center',
    width: 110,
    borderRadius: 25,
    marginTop: 20,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  button: {
    width: 100,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#121212',
    marginTop: -4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  inputText: {
    color: 'white',
    fontSize: 20,
  },
});
