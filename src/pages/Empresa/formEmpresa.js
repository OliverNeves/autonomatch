import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Background, SubmitButton, SubmitText } from '../Login/styles';
import { Formik } from 'formik';
import atualizarUser from '../../contexts/auth';
import { auth } from '../../contexts/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  telefone: Yup.string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  experiencia: Yup.string().required('Experiência é obrigatória'),
});

export default function FormEmpresa({userData}) {
  const navigation = useNavigation();

  return (
    <Background>
      <View style={styles.container}>
        <Formik
          initialValues={userData || {
            telefone: '',
            dtNasc: '',
            especialidade: '',
            experiencia: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const user = auth.currentUser;

            atualizarUser(
              user.uid,
              values.telefone,
              values.dtNasc = '',
              values.especialidade = '',
              values.experiencia
            );

            navigation.replace('HomeEmpresa');
          }}
        >
          {(props) => (
              <View style={styles.formContainer}>
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
                multiline
                style={styles.input}
                label={'Sobre'}
                keyboardType='default'
                onChangeText={props.handleChange('experiencia')}
                value={props.values.experiencia}
                error={props.touched.experiencia && props.errors.experiencia}
                autoCorrect={false}
              />

              <SubmitButton onPress={props.handleSubmit} style={styles.botao}>
                <SubmitText>Enviar</SubmitText>
              </SubmitButton>
            </View>
          )}
        </Formik>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
  },
  input: {
    backgroundColor: '#fff',
    color: '#121212',
    marginTop: 10,
  },
  botao: {
    marginTop: 20,
    marginLeft: 19,
  },
});
