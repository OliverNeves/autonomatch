import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, Linking} from 'react-native'
import { Background, Container } from '../Login/styles';
import Icon from 'react-native-vector-icons/FontAwesome'
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../../contexts/firebaseConfig';
import FormEmpresa from './formEmpresa';
import { Formik } from 'formik';

const openWhatsApp = (phone) => {
  let formattedPhone = phone.startsWith('+55') ? phone : '+55' + phone;
  let url = 'whatsapp://send?phone=' + formattedPhone;
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      return Linking.openURL(url);
    } else {
      console.log("Não é possível abrir o WhatsApp");
    }
  });
};



export default function PerfilEmpresa() {
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

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
  }, []); // A dependência vazia faz com que a busca seja feita apenas uma vez ao montar o componente

  return (
    <Background>
      
        {userData && (
          <><View style={styles.header}>
          <Text style={styles.texto}>Perfil</Text>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)} >
              <Icon
              name="edit"
              size={30}
              color='#fff'
              />
          </TouchableOpacity>
         </View>
          <View style={styles.container}>
            <View style={styles.user}>
              <Icon name="user" size={115} color="#469CAC" />
            </View>
          </View>
          <View style={styles.dadosContainer}>
            <Text style={styles.dados}>Nome: {userData.username}</Text>
            <TouchableOpacity onPress={() => openWhatsApp(userData.telefone)}>
              <Text style={styles.dados}>Telefone: {userData.telefone}</Text>
            </TouchableOpacity>
            <Text style={styles.dados}>Email: {userData.email}</Text>
            <Text style={styles.dados}>Mais informações: </Text>
            <View style={{borderColor: '#151A24', borderWidth: 2, width: '100%', height: 240, padding: 10, marginTop: 10}}>
              <Text style={styles.dados}>{userData.experiencia}</Text>
            </View>
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
          {props => (
            <>
            <FormEmpresa userData={userData} />
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
    height:'100%'
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
  header:{
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
  container:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  user:{
    alignItems:'center',
    backgroundColor: 'white',
    marginTop: 30,
    borderRadius: 100,
    height: 130,
    width:130,
    marginBottom: 20,
  },
  dados:{
    color: 'white',
    fontSize: 20
  },
  dadosContainer:{
    flex:1,
    justifyContent: 'flex-start',
    alignItems:"flex-start",
    marginTop: -170,
    padding: 20
  },
  button: {
    position: 'absolute',
    right: 10,
    
},
});
