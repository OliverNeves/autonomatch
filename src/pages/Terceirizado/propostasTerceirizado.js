import React, {useState, useEffect} from 'react';
import {
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import {Card} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Background} from '../Login/styles';
import {getDatabase, ref, onValue, remove} from 'firebase/database';
import {auth} from '../../contexts/firebaseConfig';
import { diminuirVaga } from '../../contexts/contratar';

export default function YourComponent() {
  const [propostas, setPropostas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [contratacoes, setContratacoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const user = auth.currentUser;


  useEffect(() => {
    const terceirizadoId = auth.currentUser.uid;
    const db = getDatabase();
    const eventosRef = ref(db, 'eventos');
    const contratacoesRef = ref(db, 'contratacoes');

    onValue(eventosRef, snapshot => {
      const data = snapshot.val();
      setEventos(data || {});
    });

    onValue(contratacoesRef, snapshot => {
      const data = snapshot.val();
      const tempContratacoes = [];
      for (let contratacaoId in data) {
        const contratacao = data[contratacaoId];
        tempContratacoes.push({ id: contratacaoId, ...contratacao });
      }
      setContratacoes(tempContratacoes);
    });

    onValue(eventosRef, snapshot => {
      const data = snapshot.val();
      const tempPropostas = [];
      for (let eventoId in data) {
        const evento = data[eventoId];
        if (evento.propostas) {
          for (let propostaId in evento.propostas) {
            const proposta = evento.propostas[propostaId];
            if (proposta.idTerceirizado === terceirizadoId) {
              tempPropostas.push({id: propostaId, ...proposta});
            }
          }
        }
      }
      setPropostas(tempPropostas);
    });

    
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDelete = item => {
    const db = getDatabase();
    const propostaRef = ref(
      db,
      `eventos/${item.idEvento}/propostas/${item.id}`,
    );
    remove(propostaRef)
      .then(() => {
        console.log('Proposal deleted successfully!');
        // Atualize o estado local após a remoção bem-sucedida
        setPropostas(propostas.filter(proposta => proposta.id !== item.id));
      })
      .catch(error => {
        console.error('Error deleting proposal:', error);
      });
  };

  const renderItem = ({item}) => {
    
    if (!item) {
      return null;
    }

    const idTerceirizado = item.idTerceirizado
    const especialidade = item.especialidadeTerceirizado
    const evento = item.id
    
    
    return (
      <TouchableOpacity>
        <Card style={styles.card}>
          <Card.Content
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.candidaturaText}> {item.nomeEvento}</Text>
            <Text style={styles.candidaturaText}> {item.dataEvento}</Text>
            <Text style={styles.candidaturaText}>{item.nomeEmpresa}</Text>
            <TouchableOpacity onPress={() => diminuirVaga( {idTerceirizado, especialidade}, evento)}>
              <FontAwesome name="check" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <FontAwesome name="trash" size={24} color="red" />
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderContratacao = ({ item }) => {
    if (!item) {
      return null;
    }
  
    console.log(item); // Adicionei para verificar o conteúdo de item
  
    // Modifique a verificação para considerar o evento associado ao usuário atual
    if (item.eventId && eventos[item.eventId]?.nomeUsuario === user.username) {
      return (
        <Card style={styles.card}>
          <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.candidaturaText}> {item.nomeEvento}</Text>
            <Text style={styles.candidaturaText}> {item.dataEvento}</Text>
            <Text style={styles.candidaturaText}>{item.nomeEmpresa}</Text>
          </Card.Content>
        </Card>
      );
    } else {
      return null;
    }
  };
  

  return (
    <Background>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <FontAwesome name="dollar" size={30} color="green" />
        </TouchableOpacity>
        <Text style={styles.texto}>Propostas Recebidas:</Text>

        <FlatList
          data={propostas}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Conteúdo do modal aqui */}
              <Text style={styles.texto}>Contratações:</Text>
              {contratacoes.length > 0 ? (
                <FlatList
                  data={contratacoes}
                  keyExtractor={item => item.idContratacao}
                  renderItem={renderContratacao}
                />
              ) : (
                <Text style={styles.texto}>Sem contratações disponíveis.</Text>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.texto}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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
    padding: 0,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },
  texto: {
    color: '#fff',
    fontSize: 25,
    alignSelf: 'center',
    padding: 15,
  },
});
