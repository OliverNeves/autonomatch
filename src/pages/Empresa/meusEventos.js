import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Modal, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Background } from '../Login/styles';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../../contexts/firebaseConfig';


export default function MeusEventos() {
    const [eventos, setEventos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const openModal = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setModalVisible(false);
    };

    const buscarEventos = async () => {
        const db = getDatabase();
        const user = auth.currentUser;
        const userId = user.uid;

        const eventosRef = ref(db, `eventos/${userId}`);
        const candidaturasRef = ref(db, 'candidaturas');

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

    useEffect(() => {
        buscarEventos();
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
    transparent={true}
>
    <View style={styles.modalContainer}>
        {selectedEvent && ( // Check if selectedEvent is not null or undefined
            <View style={styles.modalContent}>
                <Text>Lista de Candidaturas para {selectedEvent.nomeEvento}:</Text>
                {candidaturas.length > 0 ? (
                    <FlatList
                        data={candidaturas}
                        keyExtractor={(item) => item.id} // Replace 'id' with the correct unique key
                        renderItem={({ item }) => (
                            <View>
                                {/* Render candidate information as needed */}
                                <Text>{item.nomeCandidato}</Text>
                                {/* Add other information */}
                            </View>
                        )}
                    />
                ) : (
                    <Text>Nenhuma candidatura encontrada para este evento.</Text>
                )}
            </View>
        )}
        <TouchableOpacity onPress={closeModal}>
            <Text>Fechar</Text>
        </TouchableOpacity>
    </View>
</Modal>
        </Background>
    );
}

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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
})

