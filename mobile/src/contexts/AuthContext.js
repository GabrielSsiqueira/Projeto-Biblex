import React, {createContext, useState, useEffect } from "react";
import  AsyncStorage  from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarUsuario = async () =>{
            try{
                const userData = await AsyncStorage.getItem('@user');

                if(userData){
                    setUser(JSON.parse(userData));
                }
            }catch(error){
                console.log('Erro ao carregar Usuário', error);
            }finally{
                setLoading(false);
            }
        };

        carregarUsuario();
    }, []);

    const atualizarUsuario = async (novosDados) => {
        const  usuarioAtualizado = {...user, ...novosDados};
        setUser(usuarioAtualizado);
        await AsyncStorage.setItem('@user', JSON.stringify(usuarioAtualizado));
    }

    const login = async (dadosUsuario) => {
        setUser(dadosUsuario);
        await AsyncStorage.setItem('@user', JSON.stringify(dadosUsuario));
    };

    const logout = async () =>{
        setUser(null);
        await AsyncStorage.removeItem('@user');
    };

    return(
        <AuthContext.Provider value={{user,loading, atualizarUsuario , login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
