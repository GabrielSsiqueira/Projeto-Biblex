import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { getLivros, abrirCapitulos, abrirVersiculos } from '../services/bibleApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


const BibleScreen = () => {
    const [livros, setLivros] = useState([]);
    const [livroSelecionado, setLivroSelecionado] = useState(null);
    const [capitulos, setCapitulos] = useState([]);
    const [capituloSelecionado, setCapituloSelecionado] = useState(null);
    const [versiculos, setVersiculos] = useState([]);

    function reordenarLivros(livros) {
        const livrosOrdenados = [...livros].sort((a, b) => a.ordem - b.ordem);
        const primeiraColuna = livrosOrdenados.slice(0, 33);
        const segundaColuna = livrosOrdenados.slice(33, 66);
        const resultado = [];

        for (let i = 0; i < 33; i++) {
            if (primeiraColuna[i]) resultado.push(primeiraColuna[i]);
            if (segundaColuna[i]) resultado.push(segundaColuna[i]);
        }
        return resultado;
    }

    useEffect(() => {
        const carregarLivros = async () => {
            const data = await getLivros();
            if (data) {
                const livrosReordenados = reordenarLivros(data);
                setLivros(livrosReordenados);
            }
        };
        carregarLivros();
    }, []);

    const handleLivroSelect = async (livro) => {
        setLivroSelecionado(livro);
        const data = await abrirCapitulos(livro.id);
        if (data) {
            setCapitulos(data);
        }
    };

    const handleCapituloSelect = async (capitulo) => {
        setCapituloSelecionado(capitulo);
        const data = await abrirVersiculos(capitulo.id);
        if (data) {
            setVersiculos(data);
        }
    };

    const voltarParaLivros = () => {
        setLivroSelecionado(null);
        setCapitulos([]);
        setCapituloSelecionado(null);
        setVersiculos([]);
    };

    const voltarParaCapitulos = () => {
        setCapituloSelecionado(null);
        setVersiculos([]);
    };

    // New functions for chapter navigation
    const goToPreviousChapter = () => {
        const currentIndex = capitulos.findIndex(c => c.numero === capituloSelecionado.numero);
        if (currentIndex > 0) {
            const previousChapter = capitulos[currentIndex - 1];
            handleCapituloSelect(previousChapter);
        }
    };

    const goToNextChapter = () => {
        const currentIndex = capitulos.findIndex(c => c.numero === capituloSelecionado.numero);
        if (currentIndex < capitulos.length - 1) {
            const nextChapter = capitulos[currentIndex + 1];
            handleCapituloSelect(nextChapter);
        }
    };

    const isFirstChapter = capituloSelecionado && capituloSelecionado.numero === 1;
    const isLastChapter = capituloSelecionado && capituloSelecionado.numero === capitulos.length;


    return (
        <SafeAreaView style={styles.container}>
            {/* Tela de Livros */}
            {!livroSelecionado && (
                <>
                    <Text style={styles.titulo}>
                        <Icon name="book" size={24} color="#654321" /> Livros
                    </Text>
                    <FlatList
                        data={livros}
                        keyExtractor={(item) => String(item.id)}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.livroCard} onPress={() => handleLivroSelect(item)}>
                                <Text style={styles.livroNome}>{item.nome}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    />
                </>
            )}

            {/* Tela de Capítulos */}
            {livroSelecionado && !capituloSelecionado && (
                <>
                    <TouchableOpacity onPress={voltarParaLivros}>
                        <Text style={styles.voltar}>
                            <Icon name="arrow-left" size={24} color="#654321" /> Voltar
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.titulo}>
                        <Icon name="book-open-page-variant-outline" size={24} color="#654321" /> {livroSelecionado.nome} - Capítulos
                    </Text>
                    <FlatList
                        data={capitulos}
                        keyExtractor={(item) => String(item.id)}
                        numColumns={4}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.capituloCard} onPress={() => handleCapituloSelect(item)}>
                                <Text style={styles.capituloTexto}>{item.numero}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.capitulosContainer}
                    />
                </>
            )}

            {/* Tela de Versículos */}
            {capituloSelecionado && versiculos.length > 0 && (
                <>
                    <TouchableOpacity onPress={voltarParaCapitulos}>
                        <Text style={styles.voltar}>
                            <Icon name="arrow-left" size={24} color="#654321" /> Voltar
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.titulo}>
                        {livroSelecionado.nome} - Capítulo {capituloSelecionado.numero}
                    </Text>
                    <FlatList
                        data={versiculos}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <View style={styles.versiculoCard}>
                                <Text style={styles.versiculoTexto}>
                                    <Text style={styles.versiculoNumero}>{item.numero}. </Text>
                                    {item.texto}
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={styles.versiculosContainer}
                    />

                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={[styles.footerButton, isFirstChapter && styles.footerButtonDisabled]}
                            onPress={goToPreviousChapter}
                            disabled={isFirstChapter}>
                            <Text style={styles.footerButtonText}>
                                <Icon name="arrow-left-circle" size={20} color={isFirstChapter ? "#a9a9a9" : "#654321"} /> Anterior
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.footerButton, isLastChapter && styles.footerButtonDisabled]}
                            onPress={goToNextChapter}
                            disabled={isLastChapter}>
                            <Text style={styles.footerButtonText}>
                                Próximo <Icon name="arrow-right-circle" size={20} color={isLastChapter ? "#a9a9a9" : "#654321"} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff2d6',
        padding: 16,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 16,
        textAlign: 'center',
        color: '#5e3c11',
    },
    livroCard: {
        backgroundColor: '#f6e2b3',
        padding: 12,
        margin: 8,
        borderRadius: 12,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    livroNome: {
        fontSize: 16,
        color: '#4a3210',
        fontWeight: '600',
    },
    voltar: {
        color: '#5e3c11',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    capitulosContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff2d6',
    },
    capituloCard: {
        backgroundColor: '#d3b270',
        margin: 3,
        borderRadius: 8,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    capituloTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
    versiculosContainer: {
        paddingBottom: 50,
    },
    versiculoCard: {
        backgroundColor: '#f6e2b3',
        padding: 12,
        marginVertical: 4,
        borderRadius: 8,
    },
    versiculoTexto: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4a3210', // Corrigido para uma cor mais escura
    },
    versiculoNumero: {
        fontWeight: 'bold',
        color: '#d3b270',
    },
     // New styles for the footer
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f6e2b3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#d3b270',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#d3b270',
    },
    footerButtonDisabled: {
        backgroundColor: '#e0e0e0',
    },
    footerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 5,
    },
});

export default BibleScreen;