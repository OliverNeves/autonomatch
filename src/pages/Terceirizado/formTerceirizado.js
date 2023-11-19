import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Background, SubmitButton, SubmitText } from '../Login/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import atualizarUser from '../../contexts/auth';
import { auth } from '../../contexts/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const validationSchema = Yup.object().shape({
  telefone: Yup.string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  dtNasc: Yup.string()
    .required('Data de Nascimento é obrigatória')
    .matches(/^\d{2}\/\d{2}\/\d{2}$/, 'Data de Nascimento inválida'),
  especialidade: Yup.string().required('Especialidade é obrigatória'),
  experiencia: Yup.string().required('Experiência é obrigatória'),
});

export default function FormTerceirizado({userData}) {
  const navigation = useNavigation();
  const user = auth.currentUser;
  
  return (
    <Background>
      <Formik
        initialValues={userData || {
          username: '',
          email: '',
          telefone: '',
          dtNasc: '',
          especialidade: '',
          experiencia: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          

          atualizarUser(
            user.uid,
            values.telefone,
            values.dtNasc,
            values.especialidade,
            values.experiencia
          );

          navigation.replace('HomeTerceirizado');
        }}
      >
        {(props) => (
          <View style={styles.container}>
            <TextInput
              label="Nome"
              value={props.values.username}
              onChangeText={props.handleChange('username')}
              style={styles.input}
            />
            <TextInput
              style={styles.input}
              label={'Telefone'}
              placeholder='(00) 00000-0000'
              keyboardType='phone-pad'
              onChangeText={(text) => {
                const unmaskedText = text.replace(/\D/g, '').substring(0, 11);

                const maskedText = unmaskedText.replace(
                  /(\d{2})(\d{0,5})(\d{0,4})/,
                  '($1) $2-$3'
                );
            
                props.handleChange('telefone')(unmaskedText);
                props.setFieldValue('telefone', maskedText);
              }}
              value={props.values.telefone}
              error={props.touched.telefone && props.errors.telefone}
            />
            
            <TextInput
              style={styles.input}
              label={'Data de Nascimento'}
              placeholder='dd/mm/aa'
              keyboardType='numeric'
              onChangeText={(text) => {
                const unmaskedText = text.replace(/\D/g, '').substring(0, 8);
              
                const maskedText = unmaskedText.replace(
                  /(\d{2})(\d{2})(\d{0,2})/,
                  '$1/$2/$3'
                );

                props.handleChange('dtNasc')(unmaskedText);
                props.setFieldValue('dtNasc', maskedText);
              }}
              value={props.values.dtNasc}
              error={props.touched.dtNasc && props.errors.dtNasc}
            />
            <Picker
              style={styles.input}
              selectedValue={props.values.especialidade}
              onValueChange={(itemValue) =>
                props.setFieldValue('especialidade', itemValue)
              }
            >
              <Picker.Item label="Especialidade" value="" />
              <Picker.Item label="Auxiliar de Cozinha" value="auxiliar" />
              <Picker.Item label="Cozinheiro(a)" value="cozinheiro" />
              <Picker.Item label="Garçom / Garçonete" value="garcom" />
              <Picker.Item label="Serviços Gerais" value="sgerais" />
            </Picker>
            <TextInput
              multiline
              style={styles.input}
              label={'Experiência'}
              onChangeText={props.handleChange('experiencia')}
              value={props.values.experiencia}
              error={props.touched.experiencia && props.errors.experiencia}
            />

            <SubmitButton onPress={props.handleSubmit} style={styles.botao}>
              <SubmitText>Enviar</SubmitText>
            </SubmitButton>
          </View>
        )}
      </Formik>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    color: '#121212',
    marginTop: 10,
  },
  botao: {
    marginTop: 20,
  },
});
