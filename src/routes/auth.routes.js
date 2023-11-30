import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Reset from '../pages/Reset'
import MensagemEmpresa from '../pages/Empresa/mensagemEmpresa';
import PerfilEmpresa from '../pages/Empresa/perfilEmpresa';
import HomeEmpresa from '../pages/Empresa';
import HomeTerceirizado from '../pages/Terceirizado';
import MensagemTerceirizado from '../pages/Terceirizado/mensagemTerceirizado';
import PerfilTerceirizado from '../pages/Terceirizado/perfilTerceirizado';
import FormEmpresa from '../pages/Empresa/formEmpresa';
import FormTerceirizado from '../pages/Terceirizado/formTerceirizado';
import MeusEventos from '../pages/Empresa/meusEventos';
import Proposta from '../pages/Terceirizado/propostas';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function RotaEmpresa(){
    return(
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
        }}
        >
            <Tab.Screen
            name='HomeEmpresa'
            component={HomeEmpresa}
            options={{
                tabBarLabel: "HOME",
                tabBarIcon: ({color, size}) =>{
                    return <Feather name="home" color={color} size={size}/>
                }
            }}
            />
            <Tab.Screen
            name='MeusEventos'
            component={MeusEventos}
            options={{
                tabBarLabel: "Eventos",
                tabBarIcon: ({color, size}) =>{
                    return <MaterialIcons name="event-available" color={color} size={size}/>
                }
            }}
            />
            <Tab.Screen
            name='Mensagem'
            component={MensagemEmpresa}
            options={{
                tabBarLabel: "PROPOSTA",
                tabBarIcon: ({color, size}) =>{
                    return <FontAwesome name="handshake-o" color={color} size={size}/>
                }
            }}
            />
            
            <Tab.Screen
            name='Perfil'
            component={PerfilEmpresa}
            options={{
                tabBarLabel: "PERFIL",
                tabBarIcon: ({color, size}) =>{
                    return <Feather name="user" color={color} size={size}/>
                }
            }}
            />

        </Tab.Navigator>
    )
}

function RotaTerceirizado(){
    return(
        <Tab.Navigator>
            <Tab.Screen
            name='HOME'
            component={HomeTerceirizado}
            options={{
                headerShown: false,
                tabBarLabel: "HOME",
                tabBarIcon: ({color, size}) =>{
                    return <Feather name="home" color={color} size={size}/>
                }
            }}
            />
            <Tab.Screen
            name='HomeTerceirizado'
            component={MensagemTerceirizado}
            options={{
                headerShown: false,
                tabBarLabel: "CANDIDATURAS",
                tabBarIcon: ({color, size}) =>{
                    return <AntDesign name="solution1" color={color} size={size}/>
                }
            }}
            />
            <Tab.Screen
            name='Proposta'
            component={Proposta}
            options={{
                headerShown: false,
                tabBarLabel: "PROPOSTA",
                tabBarIcon: ({color, size}) =>{
                    return <FontAwesome name="handshake-o" color={color} size={size}/>
                }
            }}
            />
            <Tab.Screen
            name='Perfil'
            component={PerfilTerceirizado}
            options={{
                headerShown: false,
                tabBarLabel: "PERFIL",
                tabBarIcon: ({color, size}) =>{
                    return <Feather name="user" color={color} size={size}/>
                }
            }}
            />
        </Tab.Navigator>
    )
}

function AuthRoutes(){
    return(
        <AuthStack.Navigator>
            <AuthStack.Screen
            name='Login'
            component={Login}
            options={{
                headerShown: false,
            }}
            />

            <AuthStack.Screen
            name='Cadastro'
            component={Cadastro}
            options={{
                headerTransparent: true,
                headerTintColor: '#FFF',
                headerTitle: 'Voltar',
                headerBackTitleVisible: false,

            }}
            />
            <AuthStack.Screen
            name='Reset'
            component={Reset}
            options={{
                headerTransparent: true,
                headerTintColor: '#FFF',
                headerTitle: 'Voltar',
                headerBackTitleVisible: false,

            }}
            />
            <AuthStack.Screen
            name='HomeEmpresa'
            component={RotaEmpresa}
            options={{
                headerShown: false,
            }}
            />
            <AuthStack.Screen
            name='HomeTerceirizado'
            component={RotaTerceirizado}
            options={{
                headerShown: false,
            }}
            />
            <AuthStack.Screen
            name='FormEmpresa'
            component={FormEmpresa}
            options={{
                headerShown: false,
            }}
            />
            <AuthStack.Screen
            name='FormTerceirizado'
            component={FormTerceirizado}
            options={{
                headerShown: false,
            }}
            />
            
        </AuthStack.Navigator>
       
    )
    
}

export default AuthRoutes;