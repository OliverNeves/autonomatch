import React, {useState} from "react";
import {Platform, StyleSheet, Text, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {Background, Container, AreaInput, Input, SubmitButton, SubmitText, } from '../Login/styles'
import { auth } from "../../contexts/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";


export default function Reset(){
    const [email, setEmail] = useState('');

    function redefinirSenha(email){
        sendPasswordResetEmail(auth, email)
        .then(() => {Alert.alert("Um e-mail para redefinição de senha foi enviado para a sua caixa postal")})
        .catch((error) => Alert.alert(error.message))
    }
    
    return(
        <Background>
            <Container

            behavior={Platform.OS === 'ios' ? 'padding' : ''}
            enabled
            >
                <FontAwesome
                name="lock"
                size={150}
                color="black"
                />

                <Text style={styles.texto}>
                    Digite seu email que nós enviaremos um link para a criação de uma nova senha.
                </Text>
    
                <AreaInput>
                    <Input 
                    placeholder="Digite seu Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    />
                    
                </AreaInput>
    
    
                <SubmitButton onPress={() => redefinirSenha(email)}>
                    <SubmitText>Enviar Link</SubmitText>
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
        marginBottom: 20,
        textAlign: "center",
        alignSelf: "center",
        fontSize: 17,
    }
})