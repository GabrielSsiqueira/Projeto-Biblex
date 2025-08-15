import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, ImageBackground} from 'react-native';
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native';
import { getVersiculoDiario } from "../services/bibleApi";


//const versiculo = {
//    texto: 'Lâmpada para os meus pês é a tua palavra e luz para o meu caminho.',
//    referencia: 'Salmos 119:105'
//};

const planos = [
    {id: '1', titulo: 'Evangelho de João', imagem: ''},
    {id: '2', titulo: 'Provérbios Diários', imagem: ''},
    {id: '3', titulo: 'A igreja segundo Atos', imagem: ''}
];

const devocional = {
    titulo: 'Confiança em Deus',
    texto: 'Hoje, Lembre-se que mesmo em meio as tribulações, Deus está Contigo...'
};


const IndexScreen = () =>{
    const [versiculo, setVersiculo] = useState(null);

    const { user } = useContext(AuthContext);
    const navigation = useNavigation();

    const irParaPerfil = () =>{
        navigation.navigate('Perfil');
    }

    useEffect(() =>{
        const carregar = async () =>{
            const data = await getVersiculoDiario();
            setVersiculo(data);
        };
        carregar();
    },[])

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.navigate()}>
                    <Icon name="menu" size={24} color="#5e3c11"></Icon>
                </TouchableOpacity>
                
                <View style={styles.rightIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate()}>
                        <Icon name="bell-outline" size={24} color="#5e3c11"></Icon>
                    </TouchableOpacity>

                    <TouchableOpacity  style={styles.userPhoto} onPress={irParaPerfil} activeOpacity={0.7}>
                        <View style={styles.avatarContainer}>
                            <Image style={{width:40, height: 40, borderRadius:20}} source={{uri:user.foto_perfil}} />
                        </View>
                       
                    </TouchableOpacity>
                </View>
                  
            </View>

            
               
            <ScrollView style={styles.container } showsVerticalScrollIndicator={false}>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Icon name="book-open-page-variant-outline" size={20} color="#654321"></Icon>
                        Versiculo do dia
                    </Text>

                    {versiculo && versiculo.texto ? (
                        <ImageBackground source={require('../../assets/fundo-vintage.jpg')} 
                            style={styles.verseImage}
                            imageStyle={{borderRadius: 12}}
                        >
                                
                            <Text style={styles.verseText}>{versiculo.texto}</Text>
                            <Text style={styles.verseRef}>{versiculo.livro} {versiculo.capitulo}:{versiculo.versiculo}</Text>

                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => navigation.navigate()}>
                                    <Icon name="heart-outline" size={24} color="#ffffff"></Icon>
                                </TouchableOpacity>
                                

                                <TouchableOpacity onPress={() => navigation.navigate()}>
                                    <Icon name="share-outline" size={24} color="#ffffff"></Icon>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate()}>
                                    <Icon name="dots-horizontal" size={24} color="#ffffff"></Icon>
                                </TouchableOpacity>
                            </View>
                                
                        </ImageBackground>
                    ):(
                        <Text>Nenhum Versiculo Encontrado!</Text>
                    )}
                    

                   
                </View>
                

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                    <Icon name="book-outline" size={20} color="#654321"></Icon>
                        Meus Planos 
                    </Text>

                    <ScrollView horizontal 
                        showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity style={styles.planoCardPrincipal}>
                            <Image source={{}} style={styles.imagemPlano} />
                            <Text style={styles.tituloPlano}>Cristo segundo a ótica de João</Text>
                            <Text style={styles.progressoText}>5/10 dias</Text>
                            <Text styles={styles.progressBar}></Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botaoNovoPlano}>
                            <Icon name="plus" size={32} color="#8d6e63" />
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={styles.planosDestaque}>
                        <Text style={styles.sectionTitle}>
                            <Icon name="book-open-page-variant-outline" size={24} color="#654321" />
                            Planos em Destaque
                        </Text>

                        <FlatList 
                            data={planos}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.planoCard}>
                                    <Image source={{ uri: item.imagem }} style={styles.planoImagem} />
                                    <Text style={styles.planoTitulo}>{ item.titulo }</Text>
                                </View>
                            )}
                        />  

                    </View>

                   
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Icon name="hands-pray" size={20} color="#654321"></Icon>
                        Devocional do Dia
                    </Text> 

                    <View style={styles.devocionalCard}>
                        <Text style={styles.devocionalTitulo}>{ devocional.titulo }</Text>
                        <Text style={styles.devocionalTexto}>{ devocional.texto }</Text>
                    </View> 
                </View>                

                
               

            </ScrollView>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fff2d6",
    },
    topBar:{
        marginTop: 30,
        height:50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor:'#f3deb3',
        borderBottomWidth:1,
        borderBottomColor: '#d4a055',
    },
    rightIcons:{
        flexDirection:'row',
        alignItems: 'center',
        gap:30,
    },
    avatarContainer:{
        width:38,
        height:38,
        borderRadius: 19,
        borderWidth:1,
        borderColor:'#d4a055',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userPhoto:{
        width: 34,
        height:34,
        borderRadius:16,
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
    planosContainer:{
        marginTop: 10,
        paddingHorizontal: 8,
    },
    planosDestaque:{
        marginTop:10,
    },
    planoCardPrincipal:{
        width: 160,
        backgroundColor: '#fffaf0',
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset:{width:0, height: 2},
        shadowRadius: 2,
    },
    imagemPlano:{
        width:'100%',
        height:100,
        borderRadius: 8,
        marginBottom: 8,
    },
    tituloPlano:{
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        color: '#654321',
    },
    progressoText:{
        fontSize: 12,
        color:'#7b5e57',
        marginBottom: 4,
    },
    progressBar:{
        height:6,
        borderRadius: 4,
        backgroundColor:'#ffe0b2',
    },
    botaoNovoPlano:{
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
    },
    section:{
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    sectionTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#654321',
        marginBottom:10,
        fontFamily: 'serif',
    },
    verseImage:{
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        marginBottom: 8,
    },
    verseText:{
        fontSize: 12,
        fontStyle: 'italic',
        color: '#5e3c11',
        textAlign: 'center',
    },
    verseRef:{
        fontSize: 13,
        fontWeight: 'bold',
        color: '#7b5a2d',
        marginTop: 10,
    },
    planoCard:{
        backgroundColor: '#fffaf0',
        borderRadius: 10,
        padding: 10,
        marginRight: 12,
        width: 160,
        elevation: 2,
    },
    planoImagem:{
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 6,
    },
    planoTitulo:{
        fontSize: 14,
        color: '#5e3c11',
        fontWeight: 'bold',
    },
    devocionalCard:{
        backgroundColor: '#fdf2e9',
        padding: 12,
        borderRadius: 10,
    },
    devocionalTitulo:{
        fontSize: 16,
        color: '#7b4f21',
        fontWeight:'bold',
        marginBottom:6,
    },
    devocionalTexto:{
        fontSize: 14,
        color: '#5e3c11',
        lineHeight: 20
    },
    actions:{
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        justifyContent: 'center',
        gap: 20,
    }
})

export default IndexScreen;