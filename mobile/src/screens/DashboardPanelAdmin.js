import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';

const DashboardPanelAdmin = () =>{
    const [usuario, setUsuario] = useState('');

    useEffect(() =>{
        fetch('http://192.168.2.117:5001/auth/usuario-logado', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response =>{
            if(!response.ok){
                throw new Error('Não autenticado');
            }
            return response.json();
        })
        .then(data => {
            setUsuario(data);
        })
        .catch(error =>{
            console.error('erro ao buscar usuário logado:', error);
        });
    },[]);

    if(!usuario){
        return <Text>Carregando...</Text>  
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Bem vindo, {usuario.nome}</Text>

                    <Image source={{uri: 'data:image/png;base64,${usuario.foto_perfil}'}} style={styles.userPhoto} />
                </View>

                <View style={styles.content}>

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#ffe0b2',
    },
    header:{
        width:'100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        backgroundColor:'black',
        position: 'relative',
        marginTop: 25,
    },
    headerTitle:{
        fontSize:24,
        fontWeight: 'bold',
        color: '#FF7F00',
    },
    userPhoto:{
        width: 40,
        height:40,
        borderRadius:20,
        position: 'absolute',
        right: 15,
        top:10,
        borderWidth:1,
        borderColor: '#FF7F00',
    },
    content:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottonNavigation:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#ffffff',
        borderTopWidth:1,
        borderTopColor: '#E0E0E0',
    },
    navItem:{
        alignItems: 'center',
    }
})

export default DashboardPanelAdmin;