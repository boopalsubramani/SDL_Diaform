
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ChoosePatientScreen from './ChoosePatientScreen';
import ChooseTestScreen from './ChooseTestScreen';
import BookTestSearchScreen from './BookTestSearchScree';

const BookTestScreen = ({ navigation, route }: any) => {
  const [step, setStep] = useState(1);

  // Maintain step state when navigating back
  useFocusEffect(
    useCallback(() => {
      if (route?.params?.step) {
        setStep(route.params.step);
      }
    }, [route?.params?.step])
  );

  const renderScreen = () => {
    switch (step) {
      case 1:
        return <ChoosePatientScreen />;
      case 2:
        return <ChooseTestScreen />;
      case 3:
        return <BookTestSearchScreen />;
      default:
        return <ChoosePatientScreen />;
    }
  };

  return (
    <View style={styles.MainContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderScreen()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default BookTestScreen;
