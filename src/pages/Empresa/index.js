import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, Modal, FlatList, ScrollView } from "react-native"
import { Text, Searchbar, Card } from 'react-native-paper';
import { Background, Container } from '../Login/styles';
import Feather from "react-native-vector-icons/Feather"
import { deslogar } from '../../contexts/auth';
import Icon from 'react-native-vector-icons/EvilIcons'
import { getDatabase, ref, onValue } from 'firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Picker } from '@react-native-picker/picker';
import { abrirWhatsApp } from './perfilEmpresa';



export default function HomeEmpresa({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedFunction, setSelectedFunction] = useState('');



    // Substitua isso pela lógica para buscar os usuários do banco de dados
    const buscarFuncionariosTerceirizados = (setFuncionarios) => {
        const db = getDatabase();
        const terceirizadosRef = ref(db, 'users'); // Substitua 'usuarios' pelo caminho real no seu banco de dados

        onValue(terceirizadosRef, (snapshot) => {
            const data = snapshot.val();
            const terceirizados = [];

            for (const key in data) {
                const usuario = data[key];
                if (usuario.tipo === 'terceirizado') {
                    terceirizados.push({
                        id: key,
                        nome: usuario.username,
                        telefone: usuario.telefone,
                        especialidade: usuario.especialidade,
                        email: usuario.email,
                        dtNasc: usuario.dtNasc,
                        experiencia: usuario.experiencia
                    });
                }
            }

            setFuncionarios(terceirizados);
        });
    };

    useEffect(() => {
        buscarFuncionariosTerceirizados(setFuncionarios); // Substitua setFuncionarios pela função que atualiza o estado dos funcionários
    }, []);

    return (
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

            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#121212" style={styles.searchIcon} />
                <Searchbar
                    placeholder="Pesquisar"
                    onChangeText={query => setSearchQuery(query)}
                    value={searchQuery}
                    style={styles.searchbar}
                    icon={() => <Icon name="search" size={40} color="#121212" style={{ right: 8 }} />}
                    clearIcon={() => <Feather name="x" color="#121212" size={30} />}
                />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Feather name="filter" size={20} color="#000" style={styles.filterIcon} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={funcionarios.filter(item => (
                    (selectedFunction === '' || item.especialidade === selectedFunction) &&
                    (item.nome.toLowerCase().includes(searchQuery.toLowerCase()))
                ))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card} onPress={() => setSelectedUser(item)}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.nome}</Text>
                            <Text style={styles.cardSubtitle}>{
                                item.especialidade === 'cozinheiro' ? 'Cozinheiro(a)' :
                                    item.especialidade === 'auxiliar' ? 'Auxiliar de Cozinha' :
                                        item.especialidade === 'garcom' ? 'Garçom / Garçonete' :
                                            item.especialidade === 'sgerais' ? 'Serviços Gerais' :
                                                item.especialidade
                            }</Text>
                            {/* Adicione outros campos conforme necessário */}
                        </Card.Content>
                    </Card>
                )}
            />

            <Modal
                animationType="slide"
                transparent={false}
                visible={selectedUser !== null}
                onRequestClose={() => {
                    setSelectedUser(null);
                }}
            >
                {selectedUser && (
                    <Background>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedUser(null)}
                        >
                            <Feather name="x" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.containerDados}>
                            <View style={styles.user}>
                                <FontAwesome name="user" size={115} color="#469CAC" />
                            </View>
                        </View>
                        <View style={styles.dadosContainer}>
                            <Text style={styles.dados}>Nome: {selectedUser.nome}</Text>
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
                            <TouchableOpacity
                                style={styles.contratar}
                                onPress={() => {
                                    // Adicione aqui a lógica para se candidatar ao evento
                                    setSelectedUser(null);
                                }}
                            >
                                <Text style={styles.textStyle}>Contratar</Text>
                            </TouchableOpacity>
                        </View>

                    </Background>
                )}
            </Modal>
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
                            selectedValue={selectedFunction}
                            style={{ height: 50, width: 150 }}
                            onValueChange={(itemValue, itemIndex) => setSelectedFunction(itemValue)}
                        >
                            <Picker.Item label="Limpar Filtro" value="" />
                            <Picker.Item label="Cozinheiro(a)" value="cozinheiro" />
                            <Picker.Item label="Auxiliar de Cozinha" value="auxiliar" />
                            <Picker.Item label="Garçom / Garçonete" value="garcom" />
                            <Picker.Item label="Serviços Gerais" value="sgerais" />
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
    },
    searchbar: {
        flex: 1,
        paddingHorizontal: 30, // Ajuste conforme necessário
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
    user: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 30,
        borderRadius: 100,
        height: 130,
        width: 130,
        marginBottom: 20,
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
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
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
});