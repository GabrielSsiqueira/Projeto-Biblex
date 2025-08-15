import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

const CreatePlanScreen = () => {
  const [selectedOption, setSelectedOption] = useState('CreatePlan');

  const options = [
    { id: 'CreatePlan', title: 'Criar Plano' },
    { id: 'SavedPlans', title: 'Planos Salvos' },
    { id: 'CreateDevotional', title: 'Criar Devocional' },
    { id: 'SavedDevotionals', title: 'Devocionais Salvas' },
  ];

  const renderContent = () => {
    switch (selectedOption) {
      case 'CreatePlan':
        return <Text style={styles.contentTitle}>Conteúdo para Criar Plano</Text>;
      case 'SavedPlans':
        return <Text style={styles.contentTitle}>Conteúdo para Planos Salvos</Text>;
      case 'CreateDevotional':
        return <Text style={styles.contentTitle}>Conteúdo para Criar Devocional</Text>;
      case 'SavedDevotionals':
        return <Text style={styles.contentTitle}>Conteúdo para Devocionais Salvas</Text>;
      default:
        return <Text style={styles.contentTitle}>Selecione uma opção</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={options}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === item.id && styles.selectedOptionButton,
            ]}
            onPress={() => setSelectedOption(item.id)}
          >
            <Text style={[
              styles.optionText,
              selectedOption === item.id && styles.selectedOptionText,
            ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2d6',
    padding: 20,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    backgroundColor: '#654321',
    marginTop: 15,
  },
  selectedOptionButton: {
    backgroundColor: '#e69a00',
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedOptionText: {
    color: '#654321',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#654321',
  },
});

export default CreatePlanScreen;