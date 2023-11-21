import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Modal, Image } from 'react-native'
import { Background } from '../Login/styles';
import Icon from 'react-native-vector-icons/FontAwesome'
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../../contexts/firebaseConfig';
import FormTerceirizado from './formTerceirizado';
import { Formik } from 'formik';
import { launchImageLibrary } from 'react-native-image-picker';


export default function PerfilTerceirizado() {
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);


  useEffect(() => {
    // Função para buscar os dados do usuário no banco de dados
    const fetchUserData = async () => {
      const db = getDatabase();
      const user = auth.currentUser;
      const userId = user.uid;

      try {
        const userSnapshot = await get(ref(db, 'users/' + userId));
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.val());
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  function galeria() {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Image Picker Cancelado');
        return;
      } else if (response.error) {
        console.log('Gerou Erro', response.errorMessage);
        return;
      }
      console.log(response.assets);
      setFotoSelecionada(response.assets[0].uri);
    });
  }

  return (
    <Background>

      {userData && (
        <><View style={styles.header}>
          <Text style={styles.texto}>Perfil</Text>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Icon
              name="edit"
              size={30}
              color='#fff'
            />
          </TouchableOpacity>
        </View>
          <View style={styles.container}>
            <TouchableOpacity onPress={galeria}>
              {fotoSelecionada ? (
                <Image source={{ uri: fotoSelecionada }} style={styles.userImage} />
              ) : (
                <View style={styles.user}>
                  <Icon name="user" size={115} color="#469CAC" />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.dadosContainer}>
            <Text style={styles.dados}>Nome: {userData.username}</Text>
            <Text style={styles.dados}>Telefone: {userData.telefone.startsWith('+55') ? userData.telefone : '+55' + userData.telefone}</Text>
            <Text style={styles.dados}>Email: {userData.email}</Text>
            <Text style={styles.dados}>Data de Nascimento: {userData.dtNasc}</Text>
            <Text style={styles.dados}>Especialidade: {
              userData.especialidade === 'cozinheiro' ? 'Cozinheiro(a)' :
                userData.especialidade === 'auxiliar' ? 'Auxiliar de Cozinha' :
                  userData.especialidade === 'garcom' ? 'Garçom / Garçonete' :
                    userData.especialidade === 'sgerais' ? 'Serviços Gerais' :
                      userData.especialidade
            }</Text>
            <Text style={styles.dados}>Experiência: </Text>
            <ScrollView style={{ borderColor: '#5B8BDF', borderWidth: 2, width: '100%', height: 240, padding: 10, marginTop: 10 }}>
              <Text style={styles.dados}>{userData.experiencia}</Text>
            </ScrollView>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Formik
              initialValues={userData || {}}
            >
              {() => (
                <>
                  <FormTerceirizado userData={userData} />
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!isModalVisible)}
                  >
                    <Text style={styles.textStyle}>Fechar</Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

    </Background>
  );
}

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    height: '100%'
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  texto: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
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
    color: 'white',
    fontSize: 20
  },
  dadosContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    marginTop: -170,
    padding: 20
  },
  button: {
    position: 'absolute',
    right: 10,
  },
  userImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
    marginTop: 40
  },
});