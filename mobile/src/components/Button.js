import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({title, onPress}){
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button:{
        backgroundColor: '#654321',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText:{
        color: '#fff2d6',
        fontWeight: 'bold',
        fontSize: 18,
    },
});