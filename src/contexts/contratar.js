import { getDatabase, ref, get, update} from "firebase/database";
import { pegarToken } from "../pages/Login";
import messaging from '@react-native-firebase/messaging'

export const contratar = async (terceirizadoId, eventId) => {
    try {
      // Aqui você confirma a contratação do terceirizado
      // ...
  
      // Depois de confirmar a contratação, obtenha o token do dispositivo do terceirizado
      const token = await pegarToken(terceirizadoId); // assumindo que obterTokenDispositivo aceita um ID de usuário como argumento
  
      // Em seguida, envie a notificação para o terceirizado
      await sendNotification(token, 'Você foi contratado!');
  
      console.log('Terceirizado contratado e notificado com sucesso.');
  
      // Diminua a vaga apropriada
      await diminuirVaga(terceirizadoId, eventId);
  
    } catch (error) {
      console.error('Erro ao contratar e notificar o terceirizado:', error);
    }
  };
  

const diminuirVaga = async (userId, eventId) => {
    const db = getDatabase();
  
    // Buscar a especialidade do usuário
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);
    const user = userSnapshot.val();
    const especialidade = user.especialidade;
  
    // Mapear a especialidade do usuário para a contagem de vagas correspondente
    const especialidadeParaVaga = {
      'cozinheiro': 'cozinheiroCount',
      'auxiliar': 'auxiliarCount',
      'garcom': 'garcomCount',
      'sgerais': 'servicosGeraisCount',
    };
    const vaga = especialidadeParaVaga[especialidade];
  
    // Buscar o evento
    const eventRef = ref(db, `eventos/${eventId}`);
    const eventSnapshot = await get(eventRef);
    const event = eventSnapshot.val();
  
    // Verificar se a especialidade do usuário corresponde a uma das vagas do evento
    if (event[vaga] > 0) {
      // Diminuir a contagem da vaga apropriada
      const updatedEvent = {
        ...event,
        [vaga]: event[vaga] - 1,
      };
  
      // Atualizar o evento no banco de dados
      await update(eventRef, updatedEvent);
    } else {
      throw new Error(`Não há vagas disponíveis para ${especialidade}.`);
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