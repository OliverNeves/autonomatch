import React, {useState, useEffect} from "react";
import {Platform, Keyboard, ActivityIndicator, TouchableOpacity} from 'react-native';
import { TextInput, HelperText } from "react-native-paper";
import { Alerta } from "../../componentes/Alerta";
import { auth } from "../../contexts/firebaseConfig";
import { getDatabase, ref, get } from "firebase/database";
import Feather from 'react-native-vector-icons/Feather'

import {Background, Container, Logo, AreaInput, SubmitButton, SubmitText,
    Reset, ResetText,Cadastrar, CadastrarText, Registro
} from './styles';

import {useNavigation} from '@react-navigation/native';
import { realizarLogin } from "../../contexts/auth";

export default function Login(){
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [statusError, setStatusError] = useState('')
    const [mensagemError, setMensagemError] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);


    useEffect(() => {
      const estadoUsuario = auth.onAuthStateChanged(usuario => {
        if (usuario) {
          setIsLoading(true); // Inicia o indicador de carregamento
          const db = getDatabase();
          const userRef = ref(db, 'users/' + usuario.uid);
  
          get(userRef)
            .then(snapshot => {
              const userData = snapshot.val();
  
              if (userData && (userData.tipo === "empresa" || userData.tipo === "terceirizado")) {
                if (userData.tipo === "empresa") {
                  navigation.replace('HomeEmpresa');
                } else {
                  navigation.replace('HomeTerceirizado');
                }
              } else {
                // Caso o tipo de usuário não seja reconhecido
                // Você pode adicionar uma lógica aqui para lidar com isso
              }
            })
            .catch(error => {
              console.error("Erro ao obter informações do usuário:", error);
            })
            .finally(() => {
              setIsLoading(false); // Finaliza o indicador de carregamento
            });
        }
      });
  
      return () => estadoUsuario();
    }, []);
      

    async function handleLogin(){
        Keyboard.dismiss();

        if(email == ''){
            setMensagemError('O email é obrigatório');
            setStatusError('email')
        }else if(senha == ''){
            setMensagemError('A senha é obrigatória');
            setStatusError('senha')
        }else{
            const resultado = await realizarLogin(email, senha, navigation);
            if(resultado === 'Email ou senha não conferem'){
                setStatusError('firebase');
                setMensagemError(resultado);
            }else{
                setEmail('')
                setSenha('')
            }
        }
        
      }
    
    

   return(
    <Background>

        <Container
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
        >
            <Logo
            source={require('../../assets/Logo.png')}
            />

            <AreaInput>
                <TextInput
                    label="Digite seu Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                    underlineColor="transparent"
                    error={statusError === 'email'}
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

            {isLoading ? ( // Renderiza o indicador de carregamento se isLoading for true
                    <ActivityIndicator size="large" color="#ffffff" />
                    ) : (

            <SubmitButton activeOpacity={0.8} onPress={handleLogin}>
                <SubmitText>Entrar</SubmitText>
            </SubmitButton>
            )}
            <Reset onPress={ () => navigation.navigate('Reset')}>
                <ResetText>
                    Esqueci a Senha
                </ResetText>
            </Reset>



        </Container>

        <Cadastrar onPress={ () => navigation.navigate('Cadastro')}>
                <CadastrarText>
                    Não possui conta?
                </CadastrarText>
                <Registro>
                    Registre-se
                </Registro>
        </Cadastrar>

    </Background>
   )
}

const styles = {
    input: {
        width: "90%",
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
      
}