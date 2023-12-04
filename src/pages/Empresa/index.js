import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import {Text, Searchbar, Card} from 'react-native-paper';
import {Background} from '../Login/styles';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import {abrirWhatsApp} from './perfilEmpresa';
import {getDatabase, ref, onValue, get, push} from 'firebase/database';
import {auth} from '../../contexts/firebaseConfig';
import { deslogar } from '../../contexts/auth';

export default function HomeEmpresa({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [currentUserEvents, setCurrentUserEvents] = useState([]);
  const [modalVisibleEvents, setModalVisibleEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const db = getDatabase();
  const currentUser = auth.currentUser;

  const abrirModalEventos = async () => {
    const userEventsRef = ref(db, `eventos/${currentUser.uid}`);
    const snapshot = await get(userEventsRef);

    if (snapshot.exists()) {
      setCurrentUserEvents(Object.values(snapshot.val()));
      // Abre o modal de eventos
      setModalVisibleEvents(true);
    } else {
      // Não há eventos para exibir
      console.log('O usuário atual não criou nenhum evento.');
    }
  };

  const buscarFuncionariosTerceirizados = setFuncionarios => {
    const terceirizadosRef = ref(db, 'users');

    onValue(terceirizadosRef, snapshot => {
      const data = snapshot.val();
      const terceirizados = [];

      for (const key in data) {
        const usuario = data[key];
        if (usuario.tipo === 'terceirizado') {
          terceirizados.push({
            id: key,
            nome: usuario.username,
            telefone: usuario.telefone,
            especialidade: usuario.especialidade,
            email: usuario.email,
            dtNasc: usuario.dtNasc,
            experiencia: usuario.experiencia,
          });
        }
      }

      setFuncionarios(terceirizados);
    });
  };

  useEffect(() => {
    buscarFuncionariosTerceirizados(setFuncionarios);
  }, []);

  const enviarProposta = (evento, terceirizado) => {
    const propostasRef = ref(db, 'propostas'); // Substitua 'propostas' pelo caminho real no seu banco de dados

    const novaProposta = {
      idEvento: evento.eventId,
      dataEvento: evento.data,
      nomeEmpresa: evento.nomeUsuario,
      nomeEvento: evento.nomeEvento,
      idTerceirizado: terceirizado.id,
      nomeTerceirizado: terceirizado.nome,
      especialidadeTerceirizado: terceirizado.especialidade,
      // Adicione outros campos conforme necessário
    };

    // Salve a nova proposta no banco de dados
    push(propostasRef, novaProposta)
      .then(() => {
        console.log('Proposta salva com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao salvar proposta:', error);
      });
  };

  return (
    <Background>
      <View style={styles.header}>
        <Text style={styles.texto}>Candidatos</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => deslogar(navigation)}>
          <Feather name="log-out" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#121212"
          style={styles.searchIcon}
        />
        <Searchbar
          placeholder="Pesquisar"
          onChangeText={query => setSearchQuery(query)}
          value={searchQuery}
          style={styles.searchbar}
          icon={() => (
            <Icon name="search" size={40} color="#121212" style={{right: 8}} />
          )}
          clearIcon={() => <Feather name="x" color="#121212" size={30} />}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Feather
            name="filter"
            size={20}
            color="#000"
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={funcionarios.filter(
          item =>
            (selectedFunction === '' ||
              item.especialidade === selectedFunction) &&
            item.nome.toLowerCase().includes(searchQuery.toLowerCase()),
        )}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card style={styles.card} onPress={() => setSelectedUser(item)}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSubtitle}>
                {item.especialidade === 'cozinheiro'
                  ? 'Cozinheiro(a)'
                  : item.especialidade === 'auxiliar'
                  ? 'Auxiliar de Cozinha'
                  : item.especialidade === 'garcom'
                  ? 'Garçom / Garçonete'
                  : item.especialidade === 'sgerais'
                  ? 'Serviços Gerais'
                  : item.especialidade}
              </Text>
              {/* Adicione outros campos conforme necessário */}
            </Card.Content>
          </Card>
        )}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={selectedUser !== null}
        onRequestClose={() => {
          setSelectedUser(null);
        }}>
        {selectedUser && (
          <Background>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedUser(null)}>
              <Feather name="x" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={styles.containerDados}>
              <View style={styles.user}>
                <FontAwesome name="user" size={115} color="#469CAC" />
              </View>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dados}>Nome: {selectedUser.nome}</Text>
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
              <TouchableOpacity
                style={styles.contratar}
                onPress={() => {
                  abrirModalEventos();
                }}>
                <Text style={styles.textStyle}>Convidar</Text>
              </TouchableOpacity>
            </View>
          </Background>
        )}
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Picker
              selectedValue={selectedFunction}
              style={{height: 50, width: 150}}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedFunction(itemValue)
              }>
              <Picker.Item label="Limpar Filtro" value="" />
              <Picker.Item label="Cozinheiro(a)" value="cozinheiro" />
              <Picker.Item label="Auxiliar de Cozinha" value="auxiliar" />
              <Picker.Item label="Garçom / Garçonete" value="garcom" />
              <Picker.Item label="Serviços Gerais" value="sgerais" />
            </Picker>
            <TouchableOpacity
              style={{...styles.openButton, backgroundColor: '#121212'}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleEvents}
        onRequestClose={() => {
          setModalVisibleEvents(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.dados}>Seus Eventos</Text>
            <FlatList
              data={currentUserEvents}
              keyExtractor={item => item.eventId}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedEvent(item);
                    setSelectedUser(selectedUser); // Certifique-se de incluir o usuário selecionado
                    enviarProposta(item, selectedUser);
                  }}>
                  <Card>
                    <Card.Content style={styles.cardModal}>
                      <Text style={{color: '#121212', fontSize: 20}}>
                        {item.nomeEvento}
                      </Text>
                      <Text style={{color: '#121212', fontSize: 20}}>
                        Data: {item.data}
                      </Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={{...styles.openButton, backgroundColor: '#121212'}}
              onPress={() => {
                setModalVisibleEvents(false);
              }}>
              <Text style={styles.textStyle}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  texto: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  button: {
    position: 'absolute',
    right: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
  },
  filterIcon: {
    marginLeft: 10,
  },
  searchbar: {
    flex: 1,
    paddingHorizontal: 30, // Ajuste conforme necessário
  },
  card: {
    margin: 10,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#121212',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Ajuste conforme necessário
    alignSelf: 'center',
    backgroundColor: '#469CAC',
  },
  xp: {
    color: '#469CAC',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cardModal: {
    flexDirection: 'row',
  },
});
