import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { auth } from "./firebaseConfig";
import {getDatabase, ref, set, get, update} from "firebase/database"


function erros(error){
  let mensagem = '';
  switch(error.code){
    case AuthErrorCodes.EMAIL_EXISTS:
      mensagem = "Esse email já está em uso";
      break;
    case AuthErrorCodes.INVALID_EMAIL:
      mensagem = "Esse email é inválido";
      break;
    case AuthErrorCodes.WEAK_PASSWORD:
      mensagem = "A senha precisa de no mínimo 6 caracteres";
      break;
    default:
      mensagem = console.log(error)
  }
  return mensagem;
}


export async function realizarCadastro(nome, email, senha, tipo, navigation){
  if (nome && email && senha && tipo) {
    const resultado = await createUserWithEmailAndPassword(auth, email, senha)
      .then((dadosUsuario) => {
        const dados = dadosUsuario.user;

        salvarUser(dados.uid, nome, email, tipo);

        if (tipo === "empresa") {
          navigation.replace('FormEmpresa');
        } else if (tipo === "terceirizado") {
          navigation.replace('FormTerceirizado');
        } else {
          alert("Selecione entre Empresa e Terceirizado");
        }        
        return "sucesso";
      })
      .catch((error) => {
        return erros(error)
      });
      return resultado;
  } else {
    alert("Preencha todos os campos antes de cadastrar.");
  }
};

export async function realizarLogin(email, senha, navigation){
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);

    
    const user = userCredential.user;
    const db = getDatabase();
    const userRef = ref(db, 'users/' + user.uid);

    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (userData.tipo === "empresa") {
      navigation.replace('HomeEmpresa');
    } else if (userData.tipo === "terceirizado") {
      navigation.replace('HomeTerceirizado');
    } else {
      return "Usuário não cadastrado"
    }    
  } catch (error) {
    return "Email ou senha não conferem"
  }
};

export function deslogar(navigation){
  auth.signOut();
  navigation.replace('Login');
}


function salvarUser(userId, name, email, tipo){
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    tipo: tipo,
  });
}

export default function atualizarUser(userId, telefone, dtNasc, especialidade, experiencia) {
  const db = getDatabase();
  update(ref(db, 'users/' + userId), {
    telefone: telefone,
    dtNasc: dtNasc,
    especialidade: especialidade,
    experiencia: experiencia,
  });
}
