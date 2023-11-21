import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, Modal } from "react-native"
import { Text, Card, Searchbar } from 'react-native-paper';
import { Background } from '../Login/styles';
import Feather from "react-native-vector-icons/Feather"
import { deslogar } from '../../contexts/auth';
import { FlatList, View } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import Icon from 'react-native-vector-icons/EvilIcons'
import { Picker } from '@react-native-picker/picker';


export default function HomeTerceirizado({ navigation }) {
    const [eventos, setEventos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEmployeeType, setSelectedEmployeeType] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);



    useEffect(() => {
        const db = getDatabase();
        const eventosRef = ref(db, 'eventos');

        onValue(eventosRef, (snapshot) => {
            const data = snapshot.val();
            const temp = [];
            for (let id in data) {
                temp.push({ id, ...data[id] });
            }
            setEventos(temp);
        });
    }, []);
    const calcularTotalVagas = (evento) => {
        return (
            evento.cozinheiroCount +
            evento.auxiliarCount +
            evento.garcomCount +
            evento.servicosGeraisCount
        );
    };

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

            <View style={styles.searchContainer}>
                
                <Searchbar
                    placeholder="Pesquisar"
                    onChangeText={query => setSearchQuery(query)}
                    value={searchQuery}
                    style={styles.searchbar}
                    icon={() => <Icon name="search" size={40} color="#121212" style={{ right: 8 }} />}
                />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Feather name="filter" size={20} color="#000" style={styles.filterIcon} />
                </TouchableOpacity>

            </View>
            <FlatList
                data={eventos.filter(item => item.nomeEvento.toLowerCase().includes(searchQuery.toLowerCase()))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card} onPress={() => setSelectedEvent(item)}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.nomeEvento}</Text>
                            <Text style={styles.cardSubtitle}>{`Total de Vagas: ${calcularTotalVagas(item)}`}</Text>
                            <Text>{item.data}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Picker
                            selectedValue={selectedEmployeeType}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue, itemIndex) => setSelectedEmployeeType(itemValue)}
                        >
                            <Picker.Item label="Limpar Filtro" value="" />
                            <Picker.Item label="Garçom / Garçonete" value="garcomCount" />
                            <Picker.Item label="Auxiliar de Cozinha" value="auxiliarCount" />
                            <Picker.Item label="Cozinheiro(a)" value="cozinheiroCount" />
                            <Picker.Item label="Serviços Gerais" value="servicosGeraisCount" />
                        </Picker>
                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#121212" }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedEvent !== null}
                onRequestClose={() => {
                    setSelectedEvent(null);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                        setSelectedEvent(null);
                    }}
                >
                    <Text style={styles.textStyle}>X</Text>
                </TouchableOpacity>
                        {selectedEvent && (
                            <>
                                <Text style={styles.textoModal}>Evento: {selectedEvent.nomeEvento}</Text>
                                <Text style={styles.textoModal}>Local: {selectedEvent.local}</Text>
                                <Text style={styles.textoModal}>Data: {selectedEvent.data}</Text>
                                <Text style={styles.textoModal}>Horário: {selectedEvent.horario}</Text>
                                <Text style={styles.textoModal}>Vagas Auxiliar de Cozinha: {selectedEvent.auxiliarCount}</Text>
                                <Text style={styles.textoModal}>Vagas Cozinheiro(a): {selectedEvent.cozinheiroCount}</Text>
                                <Text style={styles.textoModal}>Vagas Garçom / Garçonete: {selectedEvent.garcomCount}</Text>
                                <Text style={styles.textoModal}>Vagas Serviços Gerais: {selectedEvent.servicosGeraisCount}</Text>
                                
                                <TouchableOpacity
                                    style={{ ...styles.openButton,  backgroundColor: "#121212" }}
                                    onPress={() => {
                                        // Adicione aqui a lógica para se candidatar ao evento
                                        setSelectedEvent(null);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Candidatar-se</Text>
                                </TouchableOpacity>
            
                            </>
                        )}
                    </View>
                </View>
            </Modal>

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
    card: {
        margin: 10,
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    searchIcon: {
        position: 'absolute',
        left: 15,
    },
    filterIcon: {
        marginLeft: 10,
        marginTop: 15
    },
    searchbar: {
        flex: 1,
        paddingHorizontal: 30,
        marginTop: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#121212",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', // Ajuste conforme necessário
        alignSelf: 'center',
        backgroundColor: "#469CAC"
    },
    closeButton: {
        backgroundColor: "#121212",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        alignSelf: 'flex-end',
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 20
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    textoModal:{
        color: "#FFF",
        alignSelf: 'flex-start',
        margin: 2

    }
});
