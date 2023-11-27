import { getDatabase, ref, get, update} from "firebase/database";
import { pegarToken } from "../pages/Login";
import messaging from '@react-native-firebase/messaging'

export const contratar = async (selectedUser, selectedEvent) => {
  const terceirizadoId = selectedUser.id;
  const eventId = selectedEvent.id
    try {
      
      const token = await pegarToken(terceirizadoId); 
  
      
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