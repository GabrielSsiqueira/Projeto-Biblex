import React from 'react';
import { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Pressable, SafeAreaView } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { Login } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen(){
    const  navigation = useNavigation();
    const {login} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleLogin = async () => {
        try{
            const resposta = await Login(email, senha);

            if(resposta && resposta.id_usuario){
                const dadosUsuario = {
                    'id_usuario': resposta.id_usuario,
                    'nome': resposta.nome,
                    'email': resposta.email,
                    'tipo_usuario': resposta.tipo_usuario,
                    'foto_perfil': resposta.foto_perfil,
                };

                await login(dadosUsuario);
                setMensagem('Login Realizado!');
                navigation.navigate('dashboard');
            }else{
                setMensagem('Credenciais Invalidas!');
            }

           
        }catch(err){
            console.error('erro ao fazer login', err)
            setMensagem('Erro ao fazer login');
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.avatarCircle}>
                    <Image style={styles.avatarCircle} source={require('../../assets/icon-192.png')}></Image>  
                </View>
            </View>


            <View style={styles.bottonSection}>
                <Text style={styles.title}>Tela de Login</Text>

                <Text style={styles.label}>E-mail:</Text>
                <View style={styles.inputContainer}>
                    <Input 
                        placeholder="Digite Seu Email" style={styles.input} value={email} onChangeText={setEmail} 
                    />
                </View>

                <Text style={styles.label}>Senha:</Text>
                <View style={styles.inputContainer}>
                    <Input 
                        placeholder="Digite Sua Senha" style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} 
                    />
                </View>

                <Button title='Entrar' onPress={handleLogin} />
               
                <View style={styles.passwordContainer}>
                    <Pressable onPress={() => navigation.navigate('cadastro')}>
                        <Text style={styles.linkText}>Criar Conta.</Text>
                    </Pressable>
                </View>

                <View style={styles.signupContainer}>
                
                    <Text style={styles.text}>Esqueceu a Senha? {''}
                        <Pressable onPress={() => navigation.navigate('esqueciSenha')}>
                            <Text style={styles.linkText}>Clique Aqui.</Text>
                        </Pressable>
                    </Text>
                </View>
               

                

                <Text style={styles.message}>{mensagem}</Text>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
   container:{
        flex:1,
        backgroundColor: '#f2f2f2',
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
        backgroundColor: '#f3deb3',
        borderColor:'#d4a055',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    input:{
        flex: 1,
        height: 50,
        color: '#5e3c11',
    },
    title:{
        fontSize:32,
        textAlign: 'center',
        fontWeight:'bold',
        marginBottom:30,
        color: '#5e3c11',
        fontFamily:'serif',
    },
    message:{
        color:'red',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    signupContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    passwordContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:30,
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
}); 