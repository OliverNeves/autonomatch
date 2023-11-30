import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Image, Linking } from 'react-native'
import { Background, Container } from '../Login/styles';
import Icon from 'react-native-vector-icons/FontAwesome'
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../../contexts/firebaseConfig';
import FormEmpresa from './formEmpresa';
import { Formik } from 'formik';
import Eventos from './evento';
import { launchImageLibrary } from 'react-native-image-picker';

export const abrirWhatsApp = (telefone) => {
   

  const codigoPais = '+55';

  const numeroWhatsApp = codigoPais + telefone;

  const url = `whatsapp://send?phone=${numeroWhatsApp}`;

  Linking.openURL(url)
    .then((data) => {
      console.log('WhatsApp aberto com sucesso:', data);
    })
    .catch((error) => {
      console.error('Erro ao abrir o WhatsApp:', error);
    });
};



export default function PerfilEmpresa() {
  const [userData, setUserData] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isEventModalVisible, setEventModalVisible] = useState(false);
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
        <>
          <View style={styles.header}>
            <Text style={styles.texto}>Perfil</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setEditModalVisible(true)}
            >
              <Icon name="edit" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.evento}
              onPress={() => setEventModalVisible(true)}
            >
              <Icon name="calendar" size={30} color="#fff" />
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
            <Text style={styles.dados}>Telefone: {userData.telefone}</Text>
            <Text style={styles.dados}>Email: {userData.email}</Text>
            <Text style={styles.dados}>Mais informações: </Text>
            <View
              style={{
                borderColor: '#151A24',
                borderWidth: 2,
                width: '100%',
                height: 240,
                padding: 10,
                marginTop: 10,
                backgroundColor: 'white'
              }}
            >
              <Text style={styles.xp}>{userData.experiencia}</Text>
            </View>
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(!isEditModalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Formik initialValues={userData || {}}>
              {(props) => (
                <>
                  <FormEmpresa userData={userData} />
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setEditModalVisible(!isEditModalVisible)}
                  >
                    <Text style={styles.textStyle}>Fechar</Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        visible={isEventModalVisible}
        onRequestClose={() => setEventModalVisible(!isEventModalVisible)}
      >
        {/* Adicione aqui o conteúdo do segundo modal (calendário) */}
        {/* Pode ser outro componente, formulário, etc. */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Formik>
              <Eventos />
            </Formik>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setEventModalVisible(!isEventModalVisible)}
            >
              <Text style={styles.textStyle}>Fechar</Text>
            </TouchableOpacity>
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
    backgroundColor: "#151A24",
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
  evento: {
    position: 'absolute',
    left: 10,

  },
  userImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
    marginTop: 40
  },
  xp:{
    color: "#469CAC",
    fontWeight: 'bold',
    fontSize: 20
  }
});
