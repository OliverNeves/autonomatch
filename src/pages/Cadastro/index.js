import React, {useState} from "react";
import {Platform, StyleSheet, View, Text, Keyboard, TouchableOpacity} from 'react-native';
import {RadioButton, TextInput, HelperText} from 'react-native-paper'
import {useNavigation} from '@react-navigation/native'
import { realizarCadastro } from "../../contexts/auth";
import { Alerta } from "../../componentes/Alerta";
import Feather from 'react-native-vector-icons/Feather'


import {Background, Container, AreaInput, SubmitButton, SubmitText, } from '../Login/styles'


export default function Cadastro(){
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('');
    const [statusError, setStatusError] = useState('')
    const [mensagemError, setMensagemError] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigation = useNavigation();

    async function handleCadastro(){
        Keyboard.dismiss();
        if(nome == ''){
            setMensagemError('Preencha com o seu nome');
            setStatusError('nome')
        }else if(email == ''){
            setMensagemError('Preencha com o seu email');
            setStatusError('email')
        }else if(senha == ''){
            setMensagemError('Digite sua senha');
            setStatusError('senha')
        }else{
            const resultado = await realizarCadastro(nome, email, senha, tipo, navigation);
            setStatusError('firebase')
            if(resultado == 'sucesso'){
                setMensagemError('Usuário cadastrado com sucesso!')
                setNome('')
                setEmail('')
                setSenha('')
                setTipo('')
            }else{
                setMensagemError(resultado)
            }
    
        }

    };


   return(
    <Background>
        
        <Container
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        >
            <Text style={styles.texto}>
                Registre-se para entrar no aplicativo
            </Text>
            
            <RadioButton.Group onValueChange={(newValue) => setTipo(newValue)} value={tipo}>
                <View style={{flexDirection: 'row'}}>
                    <RadioButton.Item 
                        label="Empresa"
                        value="empresa"
                        labelStyle={{ color: 'white' }}
                        color="white"
                        />
                    <RadioButton.Item 
                        label="Terceirizado" 
                        value="terceirizado" 
                        labelStyle={{ color: 'white' }} 
                        color="white"
                        />
                </View>
            </RadioButton.Group>

            <AreaInput>
                <TextInput
                label="Nome"
                value={nome}
                onChangeText={(text) => setNome(text)}
                style={styles.input}
                underlineColor="transparent"
                error={statusError == 'nome'}
                />
            </AreaInput>
            <HelperText type="error" visible={statusError === 'nome'} style={styles.errorText}>
                {mensagemError}
            </HelperText>

            <AreaInput>
                <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
                underlineColor="transparent"
                error={statusError == 'email'}
                />
            </AreaInput>
            <HelperText type="error" visible={statusError === 'email'} style={styles.errorText}>
                {mensagemError}
            </HelperText>

            <AreaInput>
                <TextInput
                    label="Sua Senha"
                    secureTextEntry={!mostrarSenha}
                    value={senha}
                    onChangeText={(text) => setSenha(text)}
                    style={styles.input}
                    underlineColor="transparent"
                    error={statusError === 'senha'}
                />
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                    <Feather
                    name={mostrarSenha ? 'eye' : 'eye-off'}
                    size={20}
                    color="black"
                    />
                </TouchableOpacity>
            </AreaInput>
            <HelperText type="error" visible={statusError === 'senha'} style={styles.errorText}>
                {mensagemError}
            </HelperText>

            <Alerta
            mensagem={mensagemError}
            error={statusError == 'firebase'}
            setError={setStatusError}
            />

            <SubmitButton onPress={() => handleCadastro()}>
                <SubmitText>Cadastrar</SubmitText>
            </SubmitButton>

        </Container>
    </Background>
   )
}

const styles = StyleSheet.create({
    texto:{
        color: 'white',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 40,
        textAlign: "center",
        alignSelf: "center",
        fontSize: 17,
    },
    input: {
        width: "90%",
        backgroundColor: '#FFF',
        color: '#121212',
        marginTop: -10,
       
      },
      errorText: {
        fontSize: 14,
        color: 'red', 
        margin: 0,
        alignSelf: 'flex-start',
        paddingLeft: 20, 
      },
      iconContainer: {
        position: 'absolute',
        right: 16,
        top: 20,
      },
      
})

