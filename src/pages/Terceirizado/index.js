import React from 'react'
import {View, TouchableOpacity, StyleSheet} from "react-native"
import { Icon, Text } from 'react-native-paper';
import { Background} from '../Login/styles';
import Feather from "react-native-vector-icons/Feather"
import { deslogar } from '../../contexts/auth';

export default function HomeTerceirizado({navigation}){
    return(
        <Background>
                <View style={styles.header}>
                    <Text style={styles.texto}>Eventos</Text>
                    <TouchableOpacity style={styles.button} onPress={() => deslogar(navigation)}>
                        <Feather
                        name="log-out"
                        size={30}
                        color='#fff'
                        />
                    </TouchableOpacity>
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
});
