import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Modal, View, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Background } from '../Login/styles';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../../contexts/firebaseConfig';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { abrirWhatsApp } from './perfilEmpresa';
import { diminuirVaga } from '../../contexts/contratar';

export default function MeusEventos() {
    const [eventos, setEventos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [candidaturas, setCandidaturas] = useState([]);
    const [usersData, setUsersData] = useState({});
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);



    const openUserModal = (userId) => {
        setSelectedUser(usersData[userId]);
        setUserModalVisible(true);
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setUserModalVisible(false);
    };


    const openModal = async (event) => {
        setSelectedEvent(event);
        await buscarCandidaturas(event.eventId);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setCandidaturas([]);
        setModalVisible(false);
    };

    const buscarUsuarios = async () => {
        const db = getDatabase();
        const usersRef = ref(db, 'users');

        try {
            const usersSnapshot = await get(usersRef);
            const users = usersSnapshot.val();

            if (users) {
                setUsersData(users);
            } else {
                setUsersData({});
            }
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }


    };


    const buscarEventos = async () => {
        const db = getDatabase();
        const user = auth.currentUser;
        const userId = user.uid;

        const eventosRef = ref(db, `eventos/${userId}`);

        try {
            const eventosSnapshot = await get(eventosRef);
            const eventos = eventosSnapshot.val();

            if (eventos) {
                const eventosArray = Object.values(eventos).filter(
                    (evento) => evento && evento.nomeEvento
                );
                setEventos(eventosArray);
            } else {
                setEventos([]);
            }
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
        }
    };

    const buscarCandidaturas = async (eventId) => {
        const db = getDatabase();
        const usersRef = ref(db, 'users');

        try {
            const usersSnapshot = await get(usersRef);
            const usersData = usersSnapshot.val();

            if (usersData) {
                const candidaturasEvento = [];
                for (let userId in usersData) {
                    const user = usersData[userId];
                    if (user.candidaturas) {
                        for (let candidaturaId in user.candidaturas) {
                            const candidatura = user.candidaturas[candidaturaId];
                            if (candidatura.eventId === eventId) {
                                // Adicione o userId à candidatura para que possamos usá-lo mais tarde
                                candidatura.userId = userId;
                                candidaturasEvento.push(candidatura);
                            }
                        }
                    }
                }

                setCandidaturas(candidaturasEvento);
            } else {
                setCandidaturas([]);
            }
        } catch (error) {
            console.error('Erro ao buscar candidaturas:', error);
        }
    };




    useEffect(() => {
        buscarEventos();
        buscarUsuarios();
    }, []);


    return (
        <><Background>
            <Text style={styles.title}>Meus Eventos</Text>

            {eventos.length > 0 ? (
                <FlatList
                    data={eventos}
                    keyExtractor={(item) => item.eventId}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item)}>
                            <Card style={styles.card}>
                                <Card.Content style={styles.cardContent}>
                                    {item.nomeEvento && (
                                        <Text style={styles.cardTitle}>{item.nomeEvento}</Text>
                                    )}
                                    <Text style={styles.cardTitle}>{item.data}</Text>
                                    <TouchableOpacity onPress={() => excluirCandidatura(item.eventId)}>
                                        <FontAwesome name="trash" size={24} color="red" />
                                    </TouchableOpacity>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    )} />
            ) : (
                <Text style={styles.noEventsText}>Nenhum evento encontrado.</Text>
            )}
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={closeModal}
                transparent={false}
                style={styles.fullScreenModal}
            >
                <Background>
                    {selectedEvent && (
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Candidatos</Text>
                            {candidaturas.length > 0 ? (
                                <FlatList
                                    data={candidaturas}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => {
                                        if (item.userId) {
                                            const candidato = usersData[item.userId];
                                            if (candidato) {
                                                return (
                                                    <TouchableOpacity style={styles.cardCandidato} onPress={() => openUserModal(item.userId)}>
                                                        <Text style={styles.nomeCandidato}>{candidato.username}</Text>
                                                    </TouchableOpacity>
                                                );
                                            } else {
                                                return null;
                                            }
                                        } else {
                                            console.log('userId não definido para o item:', item);
                                            return null;
                                        }
                                    }} />
                            ) : (
                                <Text>Nenhuma candidatura encontrada para este evento.</Text>
                            )}
                        </View>
                    )}
                    <TouchableOpacity style={styles.button} onPress={closeModal}>
                        <Text style={styles.inputText}>Fechar</Text>
                    </TouchableOpacity>
                </Background>
            </Modal>
        </Background>
            <Modal
                animationType="slide"
                visible={userModalVisible}
                onRequestClose={closeUserModal}
                transparent={false}
                style={styles.fullScreenModal}
            >
                {selectedUser && (
                    <Background>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => closeUserModal()}
                        >
                            <Feather name="x" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.containerDados}>
                            <View style={styles.user}>
                                <FontAwesome name="user" size={115} color="#469CAC" />
                            </View>
                        </View>
                        <View style={styles.dadosContainer}>
                            <Text style={styles.dados}>Nome: {selectedUser.username}</Text>
                            <TouchableOpacity onPress={abrirWhatsApp(selectedUser.telefone)}>
                                <Text style={styles.dados}>Telefone: {selectedUser.telefone}</Text>
                            </TouchableOpacity>
                            <Text style={styles.dados}>Email: {selectedUser.email}</Text>
                            <Text style={styles.dados}>Data de Nascimento: {selectedUser.dtNasc}</Text>
                            <Text style={styles.dados}>Especialidade: {
                                selectedUser.especialidade === 'cozinheiro' ? 'Cozinheiro(a)' :
                                    selectedUser.especialidade === 'auxiliar' ? 'Auxiliar de Cozinha' :
                                        selectedUser.especialidade === 'garcom' ? 'Garçom / Garçonete' :
                                            selectedUser.especialidade === 'sgerais' ? 'Serviços Gerais' :
                                                selectedUser.especialidade
                            }</Text>
                            <Text style={styles.dados}>Experiência: </Text>
                            <ScrollView style={{ borderColor: '#5B8BDF', borderWidth: 2, width: '100%', height: 150, padding: 10 }}>
                                <Text style={styles.dados}>{selectedUser.experiencia}</Text>
                            </ScrollView>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    style={styles.contratar}
                                    onPress={() => {
                                        console.log(selectedUser)
                                        console.log(selectedEvent)
                                        console.log("$$$$$$$$$$$$$$$$$")
                                        if (selectedUser && selectedEvent) {
                                            diminuirVaga(selectedUser, selectedEvent);
                                        } else {
                                            console.error("Usuário ou evento não selecionado.");
                                        }
                                    }}
                                >
                                    <Text style={styles.textStyle}>Contratar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.contratar}

                                >
                                    <Text style={styles.textStyle}>Recusar</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </Background>
                )}
            </Modal></>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noEventsText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        color: "#fff",
        fontSize: 25,
        alignSelf: 'center',
        padding: 15,
    },
    fullScreenModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    cardCandidato: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 10,
        borderRadius: 10,
    },
    button: {
        width: 100,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#121212',
        marginTop: -4,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10

    },
    inputText: {
        color: 'white',
        fontSize: 20,
    },
    dados: {
        color: '#fff',
        fontSize: 20,

    },
    dadosContainer: {
        padding: 10,

    },

    containerDados: {
        alignItems: 'center',
        padding: 25
    },
    contratar: {
        backgroundColor: "#121212",
        alignSelf: 'center',
        width: 110,
        borderRadius: 25,
        marginTop: 20,
        padding: 10

    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20
    },

    user: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 30,
        borderRadius: 100,
        height: 130,
        width: 130,
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    cardContent:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});