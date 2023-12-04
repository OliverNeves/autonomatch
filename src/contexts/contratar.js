import { getDatabase, ref, get, update} from "firebase/database";
import { pegarToken } from "../pages/Login";
import messaging from '@react-native-firebase/messaging'


  // export const contratar = async (selectedUser, selectedEvent) => {
  //   try {
  //     if (!selectedUser || !selectedEvent) {
  //       throw new Error('Usuário ou evento inválido.');
  //     }
  
  //     const terceirizadoId = selectedUser && selectedUser.id;
  //     const eventId = selectedEvent && selectedEvent.id;

  
      
  //     const token = await pegarToken(terceirizadoId); 
  
      
  //     // await sendNotification(token, 'Você foi contratado!');
  
  //     console.log('Terceirizado contratado e notificado com sucesso.');
  
  //     // Diminua a vaga apropriada
  //     await diminuirVaga(selectedUser, selectedEvent);
  
  //   } catch (error) {
  //     console.error('Erro ao contratar e notificar o terceirizado:', error);
  //   }
  // };
  

  export const diminuirVaga = async (selectedUser, selectedEvent) => {
    // Obtenha as IDs do usuário e do evento
    const userUid = selectedUser ? selectedUser.userId : null;
    const nomeEvento = selectedEvent ? selectedEvent.nomeEvento : null;
  
    // Verifique se as IDs estão definidas
    
  
    const db = getDatabase();
  
    // Buscar a especialidade do usuário
    const userRef = ref(db, `users/${userUid}`);
    const userSnapshot = await get(userRef);
    const user = userSnapshot.val();


    if (!user) {
        throw new Error(`Usuário com id ${userUid} não encontrado.`);
    }

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
    const eventRef = ref(db, `eventos/${userUid}/${nomeEvento}`);
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