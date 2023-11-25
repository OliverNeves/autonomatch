import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Modal, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Background, Container } from '../Login/styles';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../../contexts/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'

export default function MeusEventos() {
    const [eventos, setEventos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [candidaturas, setCandidaturas] = useState([]);
    const [usersData, setUsersData] = useState({});


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
        console.log(usersData);

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
        <Background>
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
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.noEventsText}>Nenhum evento encontrado.</Text>
            )}
            <Modal
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
                            const candidato = usersData[item.userId];
                            if (candidato) {
                                return (
                                    <TouchableOpacity style={styles.cardCandidato}>
                                        <Text style={styles.nomeCandidato}>{candidato.username}</Text>
                                        {/* Adicione outras informações conforme necessário */}
                                    </TouchableOpacity>
                                );
                            } else {
                                return null; // ou renderize algum placeholder
                            }
                        }}
                    />
                ) : (
                    <Text>Nenhuma candidatura encontrada para este evento.</Text>
                )}
            </View>
        )}
        <TouchableOpacity style={styles.button}onPress={closeModal}>
            <Text style={styles.inputText}>Fechar</Text>
        </TouchableOpacity>
    </Background>
</Modal>

        </Background>
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
    button:{
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
    inputText:{
        color: 'white',
        fontSize: 20,
    }
});