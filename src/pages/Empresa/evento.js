import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Background, Container, SubmitText } from '../Login/styles';
import { Formik, resetForm } from 'formik';
import * as Yup from 'yup';
import { getDatabase, ref, set, push, get } from 'firebase/database';
import { auth } from '../../contexts/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'


const validationSchema = Yup.object().shape({
    nomeEvento: Yup.string().required('Nome do evento é obrigatório'),
    data: Yup.string().required('Data é obrigatória').matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida'),
    local: Yup.string().required('Local é obrigatório'),
    horario: Yup.string().required('Horário é obrigatório'),
});


export default function Eventos() {
    const [cozinheiroCount, setCozinheiroCount] = useState(0);
    const [auxiliarCount, setAuxiliarCount] = useState(0);
    const [garcomCount, setGarcomCount] = useState(0);
    const [servicosGeraisCount, setServicosGeraisCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(true);
    

    const resetFormAndCounts = (props) => {
        props.resetForm(); // Clear the form fields
      
        // Reset the counts
        setCozinheiroCount(0);
        setAuxiliarCount(0);
        setGarcomCount(0);
        setServicosGeraisCount(0);
      };


    const incremento = (setter) => {
        setter((prevCount) => prevCount + 1);
    };

    const decremento = (setter) => {
        setter((prevCount) => (prevCount > 0 ? prevCount - 1 : prevCount));
    };

    const salvarDados = async (eventoData) => {
        const db = getDatabase();
        const user = auth.currentUser;
        const userId = user.uid;
      
        const eventosRef = ref(db, `eventos/${userId}`);
      
        try {
          // Generate a unique event ID
          const eventId = push(eventosRef).key;
      
          // Fetch user data (including username)
          const userSnapshot = await get(ref(db, `users/${userId}`));
          const userData = userSnapshot.val();
          
          // Add the number of employees for each category and user's name
          const eventoCompleto = {
            ...eventoData,
            eventId,
            cozinheiroCount,
            auxiliarCount,
            garcomCount,
            servicosGeraisCount,
            nomeUsuario: userData.username, // Assuming your user data has a field named 'username'
          };
      
          // Save the event data to the database
          await set(ref(db, `eventos/${userId}/${eventId}`), eventoCompleto);
      
          console.log('Dados do evento salvos com sucesso!');
        } catch (error) {
          console.error('Erro ao salvar dados do evento:', error);
        }
      };
      

    return (
        <Background>
        <ScrollView keyboardShouldPersistTaps='handled'>
            <Formik
                initialValues={{
                    nomeEvento: '',
                    local: '',
                    horario: '',
                    data: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    salvarDados(values);
                    resetFormAndCounts({ resetForm });
                    setSubmitting(false);
                }}
            >
                {(props) => (
                    <Container>
                        <Text style={styles.texto}></Text>
                        <Text style={styles.texto}></Text>
                        <Text style={styles.texto}></Text>
                        <Text style={styles.texto}></Text>
                        <TextInput
                            label="Nome do evento"
                            style={styles.input}
                            onChangeText={props.handleChange('nomeEvento')}
                            value={props.values.nomeEvento}
                            error={props.touched.nomeEvento && props.errors.nomeEvento}
                        />
                        <TextInput
                            label="Data"
                            style={styles.input}
                            placeholder='dd/mm/aaaa'
                            keyboardType='numeric'
                            onChangeText={(text) => {
                                const formattedText = text
                                  .replace(/\D/g, '')
                                  .replace(/(\d{2})(\d{0,2})(\d{0,2})/, '$1/$2/$3');

                                props.handleChange('data')(formattedText);
                                props.setFieldValue('data', formattedText);
                            }}
                            value={props.values.data}
                            error={props.touched.data && props.errors.data}
                        />
                        <TextInput
                            label="Local"
                            style={styles.input}
                            onChangeText={props.handleChange('local')}
                            value={props.values.local}
                            error={props.touched.local && props.errors.local}
                        />
                        <TextInput
                            label="Horário"
                            style={styles.input}
                            onChangeText={props.handleChange('horario')}
                            value={props.values.horario}
                            error={props.touched.horario && props.errors.horario}
                        />
                        <Text style={[styles.texto, {right: 110}]}>
                            Adicionar vagas: 
                        </Text>

                        <View style={styles.funcionarios}>
                            <View style={styles.vagas}>
                            <Text style={styles.titulo}>Cozinheiro:</Text>
                                <TouchableOpacity onPress={() => decremento(setCozinheiroCount)}>
                                    <Icon name="minus-circle" size={20} color="black" style={{left: 180}}/>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 18, color: '#121212', left: 195 }}>{cozinheiroCount}</Text>
                                <TouchableOpacity onPress={() => incremento(setCozinheiroCount)}>
                                    <Icon name="plus-circle" size={20} color="black" style={{left: 210}}/> 
                                </TouchableOpacity>
                            </View>

                            <View style={styles.vagas}>
                            <Text style={styles.titulo}>Auxiliar de Cozinha:</Text>
                                <TouchableOpacity onPress={() => decremento(setAuxiliarCount)}>
                                    <Icon name="minus-circle" size={20} color="black" style={{left: 120}}/>
                                </TouchableOpacity>
                                <Text style={{fontSize: 18, color: '#121212', left: 135}}>{auxiliarCount}</Text>
                                <TouchableOpacity onPress={() => incremento(setAuxiliarCount)}>
                                    <Icon name="plus-circle" size={20} color="black" style={{left: 150}}/>
                                </TouchableOpacity>
                            </View>

                            
                            <View style={styles.vagas}>
                            <Text style={styles.titulo}>Garçom / Garçonete:</Text>
                                <TouchableOpacity onPress={() => decremento(setGarcomCount)}>
                                    <Icon name="minus-circle" size={20} color="black" style={{left: 110}} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 18, color: '#121212', left: 125 }}>{garcomCount}</Text>
                                <TouchableOpacity onPress={() => incremento(setGarcomCount)}>
                                    <Icon name="plus-circle" size={20} color="black" style={{left: 140}}/>
                                </TouchableOpacity>
                            </View>

                            
                            <View style={styles.vagas}>
                            <Text style={styles.titulo}>Serviços Gerais:</Text>
                                <TouchableOpacity onPress={() => decremento(setServicosGeraisCount)}>
                                    <Icon name="minus-circle" size={20} color="black" style={{left: 150}}/>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 18, color: '#121212', left: 165 }}>{servicosGeraisCount}</Text>
                                <TouchableOpacity onPress={() => incremento(setServicosGeraisCount)}>
                                    <Icon name="plus-circle" size={20} color="black" style={{left: 180}}/>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
    style={styles.enviar}
    onPress={() => props.submitForm()}
>
    <Text style={styles.textButton}>Criar Evento</Text>
</TouchableOpacity>
                        </View>

                    </Container>
                )}
            </Formik>
        </ScrollView>
        </Background>
    )
}

const styles = StyleSheet.create({
    input: {
        width: '90%',
        backgroundColor: '#fff',
        color: '#121212',
        marginTop: 10,
    },
    texto: {
        color: 'white',
        fontSize: 20
    },
    vagas:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: 370,
        borderWidth: 1,
        borderColor: '#469CAC',
        height: 45,
        marginTop: 5
    },
    titulo:{
        color: '#121212',
        fontSize: 18,
        left: 10
    },
    enviar:{
        backgroundColor: '#121212',
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 25
        
    },
    textButton:{
       fontSize: 20,
       color: '#fff',
       padding: 10,
       
    }
});
