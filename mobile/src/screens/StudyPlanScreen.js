import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudyPlanScreen = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Plano de Estudo.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        padding: 20,
    },
    title:{
        fontSize:28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#388e3c',
    }
})

export default StudyPlanScreen;
