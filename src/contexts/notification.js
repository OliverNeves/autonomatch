import messaging from 'firebase/messaging';
import fetch from 'node-fetch';

async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
}

async function sendNotification(evento, user) {
    // Enviar notificação
    const message = {
        to: '/topics/all', // Tópico ou token do dispositivo do criador do evento
        notification: {
            title: "Novo candidato",
            body: `Um usuário se candidatou ao seu evento ${evento.nomeEvento}`,
        },
        data: { eventoId: evento.id }, // você pode querer incluir dados adicionais aqui
    };

    // Enviar a mensagem para o FCM
    await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=<sua-chave-do-servidor-firebase>', // substitua <sua-chave-do-servidor-firebase> pela sua chave do servidor Firebase
        },
        body: JSON.stringify(message),
    });
}

// Chame esta função em algum lugar em seu código
requestUserPermission();

export { requestUserPermission, sendNotification };
