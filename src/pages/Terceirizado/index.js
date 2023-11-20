import React, { useEffect, useState } from 'react'
import {TouchableOpacity, StyleSheet} from "react-native"
import { Icon, Text } from 'react-native-paper';
import { Background} from '../Login/styles';
import Feather from "react-native-vector-icons/Feather"
import { deslogar } from '../../contexts/auth';
import { FlatList, View} from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function HomeTerceirizado({navigation}){
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const eventosRef = ref(db, 'eventos');

        onValue(eventosRef, (snapshot) => {
            const data = snapshot.val();
            const temp = [];
            for(let id in data) {
                temp.push({id, ...data[id]});
            }
            setEventos(temp);
        });
    }, []);

    return (
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

            <FlatList
                data={eventos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.nomeEvento}</Text>
                        <Text>{item.data}</Text>
                        <Text>{item.local}</Text>
                        <Text>{item.horario}</Text>
                        {/* Adicione aqui outros campos conforme necessário */}
                    </View>
                )}
            />
        </Background>
    );
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
