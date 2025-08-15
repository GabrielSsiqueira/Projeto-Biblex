const BASE_URL ='http://192.168.2.117:5001';
const versao = "ACF";
const dataHoje = new Date().toISOString().split('T')[0];

export const getLivros = async () => {
    try{
        const response = await fetch(`${BASE_URL}/biblia/versoes/${versao}/livros`); 
        const data = await response.json();
        return data;
    }catch(error){
        console.error('Erro ao buscar livros: ', error.message);
        return [];
    }
    
}

export const abrirCapitulos = async (livroId) => {
    try {
        const response = await fetch(`${BASE_URL}/biblia/livros/${livroId}/capitulos`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao buscar capítulos do livro ${livroId}:`, error.message);
        return null;
    }
};

/** 
 * @param {int} livroSelecionado - id do livro
 * @param {number} cap - Número do capitulo
*/

// Rota para buscar todos os versículos de um capítulo específico
export const abrirVersiculos = async (capituloId) => {
    try {
        const response = await fetch(`${BASE_URL}/biblia/versoes/${versao}/capitulos/${capituloId}/versiculos`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao buscar versículos do capítulo ${capituloId}:`, error.message);
        return null;
    }
}

export const getVersiculoDiario = async () => {
    try{
        const response = await fetch(`${BASE_URL}/biblia/versiculo-diario?data=${dataHoje}`);

        if(!response.ok){
            throw new Error("Erro ao buscar versiculo diario");
        }
        const data = await response.json()
        return data;
    }catch(error){
        console.error("Error no getVersiculoDiario", error);
        return null;
    }
};

