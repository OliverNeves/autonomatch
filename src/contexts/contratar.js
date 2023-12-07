import { getDatabase, ref, get, update, push, set, remove} from "firebase/database";
import { pegarToken } from "../pages/Login";
import messaging from '@react-native-firebase/messaging'
import { auth } from "./firebaseConfig";
import { Alert } from "react-native";

export const diminuirVaga = async (selectedUser, evento) => {
  const db = getDatabase();
  const user = auth.currentUser;
  const userId = user.uid;

  const especialidadeParaVaga = {
    'cozinheiro': 'cozinheiroCount',
    'auxiliar': 'auxiliarCount',
    'garcom': 'garcomCount',
    'sgerais': 'servicosGeraisCount',
  };

  const vaga = especialidadeParaVaga[selectedUser.especialidade];

  if (!vaga) {
    console.error('Especialidade do usuário não reconhecida:', selectedUser.especialidade);
    return;
  }

  
  console.log(selectedUser)

  const eventoRef = ref(db, `eventos/${userId}/${evento.eventId}`);

  try {
    const eventoSnapshot = await get(eventoRef);
    const eventoData = eventoSnapshot.val();

    if (!eventoData || eventoData[vaga] === undefined || eventoData[vaga] <= 0) {
      console.error('Vaga não disponível para contratação.');
      return;
    }

    const atualizacao = {};
    atualizacao[vaga] = eventoData[vaga] - 1;

    await update(eventoRef, atualizacao);

    console.log('Vaga diminuída com sucesso!');

    // Contratar usuário
    const contratacoesRef = ref(db, 'contratacoes');
    const novaContratacaoRef = push(contratacoesRef);
    await set(novaContratacaoRef, {
      nome: selectedUser.username,
      especialidade: selectedUser.especialidade,
      nomeEvento: evento.nomeEvento,
      nomeEmpresa: evento.nomeUsuario,
      eventId: evento.eventId,
      dataEvento: evento.data
    });
    Alert.alert('Parabéns','Usuário contratado com sucesso!')
    console.log('Usuário contratado com sucesso!');
  } catch (error) {
    console.error('Erro ao diminuir vaga ou contratar usuário:', error);
  }
};

export const recusarCandidatura = async (selectedUser, evento) => {
  const db = getDatabase();

  // Caminho para a candidatura do usuário no banco de dados
  const candidaturaRef = ref(db, `users/${selectedUser.userId}/candidaturas/${evento.eventId}`);

  try {
    // Remover a candidatura
    await remove(candidaturaRef);

    console.log('Candidatura do usuário recusada com sucesso!');
  } catch (error) {
    console.error('Erro ao recusar candidatura:', error);
  }
};

  
  export const sendNotification = async (token, message) => {
    try {
      await messaging().sendToDevice(token, {
        data: {
          title: 'Nova Mensagem',
          body: message,
        },
      });
      console.log('Notificação enviada com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  };