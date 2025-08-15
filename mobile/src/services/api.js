const API_URL = 'http://192.168.2.117:5001';

export async function Login(email, senha) {
    try{
        const resposta = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email,senha}),
        });

        const data = await resposta.json();
        return data;
    }catch(error){
        console.error('error ao logar', error);
        throw error;
    }    
} 

export async function cadastrarUsuario(nome,email, senha) {
    try{
        const resposta = await fetch(`${API_URL}/auth/cadastrar`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nome,email,senha}),
        });

        const data = await resposta.json();
        return data;
    }catch(error){
        console.error('error ao fazer cadastrar', error);
        throw error;
    }    
} 

export const tornarAutor = async (id_usuario, dados) => {
    try{
        const resposta = await fetch(`${API_URL}/usuario/tornar-autor/${id_usuario}`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        const data = await resposta.json();
        if(!resposta.ok){
            throw new Error(data.erro || 'Erro ao salvar dados de autor');
        }
        return data;
    }catch(error){
        throw error;
    }
};

export const atualizarFotoPerfil = async (id_usuario, novaFoto) =>{
    try{
        const resposta = await fetch(`${API_URL}/usuario/atualizar-foto/${id_usuario}`,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({foto_perfil:novaFoto}),
        });
        
        if(!resposta.ok){
            throw new Error('Erro ao atualizar foto de perfil');
        }

        const dados = await resposta.json();
        return dados;
    }catch(error){
        console.error('Error ao atualizar foto de Perfil:', error);
        throw error;
    }
}
