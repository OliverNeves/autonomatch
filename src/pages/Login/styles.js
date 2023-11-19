import styled from "styled-components/native";


export const Background = styled.View`
flex: 1;
background-color: #469CAC;
`

export const Container = styled.KeyboardAvoidingView`
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-top: -40px;
`;

export const Logo = styled.Image`
    margin-bottom: 25px;
    width: 41%;
    height: 20%;

`;

export const AreaInput = styled.View`
    flex-direction: row;
    padding-top: 10px;

`;

export const Input = styled.TextInput`
    background-color: #fff;
    width: 90%;
    font-size: 17px;
    padding: 10px;
    color: #121212;
    margin-bottom: 10px;
    border-radius: 20px;
`;

export const SubmitButton = styled.TouchableOpacity`
    width: 90%;
    height: 45px;
    border-radius: 20px;
    background-color: #151A24;
    margin-top: -4px;
    align-items: center;
    justify-content: center;

`;

export const SubmitText = styled.Text`
    font-size: 20px;
    color: #fff
`;

export const Reset = styled.TouchableOpacity`
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const ResetText = styled.Text`
    color: white;
`;

export const Cadastrar = styled.TouchableOpacity`
    flex: 0.1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-bottom: 30px;
`;

export const CadastrarText = styled.Text`
    color: white;
    align-items: center;
    padding-right: 5px;
`;
export const Registro = styled.Text`
    color: white;
    font-weight: bold;
    font-size: 17px;
`;

