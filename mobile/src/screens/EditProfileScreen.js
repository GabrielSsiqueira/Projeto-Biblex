import React, {useContext, useEffect, useState } from 'react';
import {
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Image, 
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from "../contexts/AuthContext";
import * as ImagePicker  from 'expo-image-picker';
import { tornarAutor, atualizarFotoPerfil } from "../services/api";

const EditProfileScreen = () => {
    const {user, atualizarUsuario} = useContext(AuthContext);
    const [mostrarCampos, setMostraCampos] = useState(false);

    const [FuncaoMinisterial, setFuncaoMinisterial] = useState('');
    const [IgrejaLocal, setIgrejaLocal] = useState('');
    const [TempoMinisterial, setTempoMinisterial] = useState('');



    const handleUpdatePhoto = async () =>{
       
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            base64: true,
            quality:1,
            selectionLimit: 1,
            mediaTypes: 'images'
        })


        if(!result|| result.canceled || !result.assets || !result.assets.length){
            console.log('Imagem não selecionada ou picker cancelado!')
            return;
        }

        const base64 = result.assets[0].base64;
        const novaFoto = `data:image/jpeg;base64,${base64}`;

        console.log('nova foto', novaFoto);

        try{
            await atualizarFotoPerfil(user.id_usuario, novaFoto);
            await atualizarUsuario({foto_perfil: novaFoto});
            alert('Foto atualizada com sucesso');
        }catch(error){
            alert('Erro ao atualizar Perfil');
        }


    }

    const handleMakeAuthor = () =>{
       setMostraCampos(true);
    };

    const handleSalvar = async () => {
        try{
            const dados = {
                tipo_usuario: 'autor',
                funcao_ministerial: FuncaoMinisterial,
                igreja_local: IgrejaLocal,
                tempo_ministerial: TempoMinisterial,
            };

            const resposta = await tornarAutor(user.id_usuario, dados);

            if(!resposta.ok){
                alert('Erro ao Atualizar para Autor.');
            }

            alert('informações salvas com sucesso');

            await atualizarUsuario({tipo_usuario: 'autor'})
        }catch(error){
            console.error('Erro ao salvar', error);
            alert('Erro ao Salvar Informações');
        }
    }

    return (
        <ScrollView style={styles.scrollViewContainer}>

            <View style={styles.topSection}>
                <Text style={styles.title}>Meu Perfil</Text>

                <TouchableOpacity onPress={handleUpdatePhoto} style={styles.imageContainer}>
                    <Image source={{ uri:user.foto_perfil} } style={styles.profileImage} />
                    <View style={styles.cameraIcon}>
                        <Icon name="camera" size={24} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
            
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Nome:</Text>
                    <TextInput 
                       style={styles.input}
                       value={user.nome}
                       editable={false}
                       placeholder="Nome Completo"
                    />
                           
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>E-mail:</Text>
                    <TextInput 
                       style={styles.input}
                       value={user.email}
                       keyboardType="email-address"
                       autoCapitalize="none"
                       editable={false}
                       placeholder="E-mail"
                    />
                           
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Tipo Usuário:</Text>
                    <TextInput 
                       style={styles.input}
                       value={user.tipo_usuario}
                       editable={false}
                       placeholder="Tipo Usuário"
                    />
                           
                </View>

                {user.tipo_usuario === 'comum' && !mostrarCampos &&(
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleMakeAuthor}>
                        <Text style={styles.secondaryButtonText}>Tornar Usuário Autor</Text>
                    </TouchableOpacity>
                )}
                {mostrarCampos && (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Função Ministerial:</Text>
                        <TextInput style={styles.input} value={FuncaoMinisterial} onChangeText={setFuncaoMinisterial} placeholder="ex: pastor, Envagelista.." /> 

                        <Text style={styles.label}>Igreja Local:</Text>
                        <TextInput style={styles.input} value={IgrejaLocal} onChangeText={setIgrejaLocal} placeholder="ex: 1 Igreja Batista de Alagoas" /> 

                        <Text style={styles.label}>Tempo Ministerial:</Text>
                        <TextInput style={styles.input} value={TempoMinisterial} onChangeText={setTempoMinisterial} placeholder="ex: 4 anos" /> 

                        <TouchableOpacity style={styles.logoutButton} onPress={handleSalvar}>
                            <Text style={styles.LogoutButtonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>

                   
                   
                )}
               
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer:{
        flex:1,
        backgroundColor:'#f8f8f8'
    },
    topSection:{
       flex: 1,
       backgroundColor: '#8A2BE2',
       justifyContent: 'flex-end',
       alignItems: 'center',
       //borderBottomLeftRadius: 50,
       //borderBottomRightRadius: 50,
       paddingBottom: 40,
    },
    container:{
       padding:20,
       alignItems:'center',
       paddingBottom:40,
    },
    title:{
        fontSize: 38,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        marginTop: 20,
    },
    imageContainer:{
        marginBottom:30,
        position: 'relative',
    },
    profileImage:{
        width:150,
        height:150,
        borderRadius:75,
        borderWidth:3,
        borderColor: '#007bff'
    },
    cameraIcon:{
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    fieldContainer:{
        width: '100%',
        marginBottom: 20,
    },
    label:{
        fontSize: 16,
        color:'#555',
        marginBottom: 5
    },
    input:{
        width:'100%',
        height: 50,
        backgroundColor: '#eee',
        borderRadius: 8,
        paddingHorizontal: 15,
        borderWidth:1,
        borderColor: '#ccc',
        fontSize: 16,
        color:'#333',
    },
    button:{
        width:'100%',
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems:'center',
        marginTop: 10,
        marginBottom: 15,
    },
    buttonText:{
        color:'#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton:{
        width:'100%',
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems:'center',
        marginTop: 20,
    },
    LogoutButtonText:{
        color:'#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton:{
        width:'100%',
        height: 50,
        backgroundColor: '#28a745',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: 15,
    },
    secondaryButtonText:{
        color:'#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
})

export default EditProfileScreen;

