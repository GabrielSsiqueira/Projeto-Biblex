import React , { useState } from 'react';
import { View, Text, Image, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import  { cadastrarUsuario } from '../services/api';

export default function CadastroScreen(){
    const navigation = useNavigation();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleCadastro = async () =>{
        try{
            const resposta = await cadastrarUsuario(nome,email,senha);
            setMensagem(resposta.mensagem || 'Usuário Cadastrado!');
            navigation.navigate('login'); 
        }catch(error){
            setMensagem('Erro ao Cadastrar. Verifique os dados.');
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.avatarCircle}>
                    <Image style={styles.avatarCircle} source={require('../../assets/icon-192.png')} />
                </View>
            </View>

            <View style={styles.bottonSection}>
                <Text style={styles.title}>Tela de Cadastro</Text>

                <Text>Nome:</Text>
                <View style={styles.inputContainer}>
                    <Input style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite Seu Nome"/>
                </View>

                <Text>E-mail:</Text>
                <View style={styles.inputContainer}>
                    <Input style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Digite Seu Email"/>
                </View>

                <Text>Senha:</Text>
                <View style={styles.inputContainer}>
                   
                    <Input style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="Digite Sua Senha"/>
                </View>

                <Button title='Cadastrar' onPress={handleCadastro} />

                <View style={styles.loginContainer}>
                    <Text style={styles.text}> Já Têm Conta?{''}
                        <Pressable onPress={() => navigation.navigate('login')}>
                            <Text style={styles.linkText}> Faça Login.</Text>
                        </Pressable>
                    </Text>
                </View>

                

                <Text style={styles.message}>{mensagem}</Text>
               
            </View>
        </SafeAreaView>
    )

   
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#F0F2F5',
    },
      topSection:{
       flex: 1,
       backgroundColor: '#654321',
       justifyContent: 'flex-end',
       alignItems: 'center',
       //borderBottomLeftRadius: 50,
       //borderBottomRightRadius: 50,
       paddingBottom: 40,
    },
    avatarCircle:{
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottonSection:{
        flex:2,
        backgroundColor:'#fff2d6',
        paddingHorizontal: 30,
        paddingTop:40,
    },
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcefdc',
        borderColor:'#d4a055',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    input:{
        flex: 1,
        height: 50,
        color: 'white',
    },
    title:{
        fontSize:32,
        textAlign: 'center',
        fontWeight:'bold',
        marginBottom:30,
        color: '#5e3c11',
    },
    message:{
        color:'red',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    loginContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    linkText:{
        color:'#5e3c11',
        fontSize: 15,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    text:{
        fontSize:15,
        color:'#7b5a2d',
    },
    label:{
        color:'#7b5a2d',
        fontSize: 16,
        fontFamily: 'serif',
    }
    
})