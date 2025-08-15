import React from 'react';
import {TextInput} from 'react-native';

export default function Input({placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default'})
{
    return (
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
    );
};




