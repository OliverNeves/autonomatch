import React from 'react'
import {View, TouchableOpacity, StyleSheet} from "react-native"
import { Icon, Text, TextInput } from 'react-native-paper';
import { Background} from '../Login/styles';
import Feather from "react-native-vector-icons/Feather"
import { deslogar } from '../../contexts/auth';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export default function HomeEmpresa({navigation}){
    return(
        <Background>
                <View style={styles.header}>
                    <Text style={styles.texto}>Candidatos</Text>
                    <TouchableOpacity style={styles.button} onPress={() => deslogar(navigation)}>
                        <Feather
                        name="log-out"
                        size={30}
                        color='#fff'
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Pesquisar"
                        left={<TextInput.Icon name={() => <Feather name="search" size={24} color={"black"} />} />}
                    />
                </View>
        </Background>
    )
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
    searchBar: {
        marginTop: 10,
        alignItems: 'center',
    },
    input: {
        width: '90%',
    },
});
