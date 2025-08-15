import React, { useContext } from "react";
import { 
    StyleSheet, 
    View, 
    Text, 
    ScrollView, 
    Image, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList
} from 'react-native';
import  Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from "../contexts/AuthContext";

// Url para imagem de perfil generica
const profilePhoto = {uri: 'https://i.imgur.com/b9UaL8C.png'};

const ProfileScreen = () =>{
    const { user } = useContext(AuthContext);

    // dados de exemplo para feed
    const plans = [
        {id:1, title: 'Gênesis: Compreendendo a Criação', image: 'https://i.imgur.com/G9L5p4h.png', progress: '100'},
        {id: 2, title: 'Meditando em Salmos', image: 'https://i.imgur.com/qU3aFe.png', progress: '100'},
    ];

    const devotionals = [
        {id:1, title: 'John Pipe: Reflection on Matthew 5',  verse: 'Wisdom from Proverbs 3'},
        {id: 2, title: 'John Pipe: Reflection on Matthew 5', verse: 'Wisdom from Proverbs 3'},
    ];

    const sharedVerses = [
        {id: 1, verse: 'The God is my shepherd', referencia: '1 John 1:1', data: "03/98/2025"},
        {id:2, verse: 'For God so Loved The World..',  referencia: 'Jeremias 33:3', data: "02/08/2025"}
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            

            
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.profileHeader}>
                    <View style={styles.profilePhotoContainer}>
                        <Image source={{ uri: user.foto_perfil }} style={styles.profilePhoto} />
                    </View>
                    <Text style={styles.userName}>{ user.nome }</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Icon name="sheep" size={16} color="#654321" />
                            <Text style={styles.statText}>Usuário {user.tipo_usuario}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Planos Completos</Text>
                    <FlatList data={plans} 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.planCard}>
                                <Image source={{uri: item.image}} style={styles.planImage} />
                                <Text style={styles.planTitle}>{item.title }</Text>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBar, {width: '{$item.progress}%'}]}></View>
                                </View>

                                {item.progress === 100 ? (
                                    <Text style={styles.completed}>Concluido</Text>
                                ):(
                                    <Text style={styles.percent}>{item.progress}% Concluido</Text> 
                                )}
                                <Icon name="check-circle" size={20} color="green" style={styles.ckeckIcon} /> 
                            </View>
                        )}
                        contentContainerStyle={{paddingHorizontal:16 }}
                    />     
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Devocional</Text>
                    {devotionals.map(devotional =>(
                        <View key={devotional.id} style={styles.devotionalItem}>
                            <Icon name="book-open-page-variant-outline" size={20} color="#654321" />
                            <View style={styles.devotionalTextContainer}>
                                <Text style={styles.devotionalTitle}>{devotional.title}</Text>
                                <Text style={styles.devotionalVerse}>{devotional.verse}</Text>
                            </View>
                        </View>
                    ))}

                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Versiculos Compartilhados</Text>
                    <FlatList 
                        data={sharedVerses} 
                        keyExtrator={(item) => item.id.toString()}
                        renderItem={({ item }) =>(
                            <View style={styles.verseItem}>
                                <Text style={styles.verseText}>{ item.verse }</Text>
                                <Text style={styles.verseRef}>{ item.referencia }</Text>
                                <Text style={styles.verseData}>Compartilhado em { item.data }</Text>
                            </View>
                        )}
                    />    

                </View>
            </ScrollView>
            

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea:{
        flex:1,
        backgroundColor:'#ffe0b2',
    },
    container:{
        flex:1,
    },
    scrollContainer:{
        paddingBottom: 20,
    },
    profileHeader:{
        alignItems: 'center',
        paddingVertical: 30,
    },
    profilePhotoContainer:{
        width:100,
        height:100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#C46F0C',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        overflow: 'hidden',
        marginBottom: 10,
    },
    profilePhoto:{
        width:'100%',
        height: '100%'
    },
    userName:{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#654321',
        fontFamily: 'serif',
    },
    statsContainer:{
        flexDirection:'row',
        marginTop: 5,
    },
    statItem:{
        flexDirection:'row',
        alignItems: 'center',
        marginHorizontal:10,
    },
    statText:{
        marginLeft:5,
        color: '#654321',
        fontFamily: 'serif',
    },
    section:{
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#654321',
        marginBottom:10,
        fontFamily: 'serif',
    },
    plansContainer:{
        flexDirection: 'row',
    },
    planCard:{
       backgroundColor: '#fff7e6',
       borderRadius: 12,
       padding: 10,
       marginRight: 12,
       shadowColor:'#000',
       shadowOpacity: 0.05,
       shadowRadius: 4,
       elevation: 3,
       width:160,
       alignItems:'center',
    },
    planImage:{
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    planTitle:{
        fontSize: 14,
        fontWeight:'bold',
        textAlign: 'center',
        color: '#654321',
    },
    ckeckIcon:{
       marginTop:6,
    },
    progressBarBackground:{
        borderRadius: 4,
        height: 6,
        backgroundColor:'rgba(255,255,255,0.5)',
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressBar:{
        height:6,
        backgroundColor:'#4CAF50',
    },
    completed:{
        fontSize:12,
        color: 'green',
        textAlign: 'right',

    },
    percent:{
        fontSize: 12,
        color: '#5e3c11',
        textAlign: 'right',
    },
    devotionalItem:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff2d6',
        padding: 12,
        borderRadius:10,
        marginBottom: 8,
        elevation: 2,
    },
    devotionalTextContainer:{
        marginLeft:10,
    },
    devotionalTitle:{
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3b2300',
        fontFamily:'serif',
    },
    devotionalVerse:{
        fontSize:12,
        color: '#8c6f45',
        fontStyle: 'italic',
    },
    verseItem:{
        backgroundColor: '#fff2d6',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#d4a055'
    },
    verseText:{
        fontSize: 14,
        color: '#5e3c11',
        fontFamily:'serif',
        fontStyle: 'italic',
        marginBottom: 6,
    },
    verseRef:{
        fontSize: 13,
        fontWeight:'bold',
        fontFamily: 'serif',
        color: '#7b5a2d',
    },
    verseData:{
        fontSize:11,
        color:'#a68b6f',
        marginTop:4,
    }
});

export default ProfileScreen;