import React, {useState} from "react";
import {Platform, StyleSheet, Text} from 'react-native';


import FontAwesome from 'react-native-vector-icons/FontAwesome'

import {Background, Container, AreaInput, Input, SubmitButton, SubmitText, } from '../Login/styles'

export default function Reset(){
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
                    />
                </AreaInput>
    
    
                <SubmitButton>
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