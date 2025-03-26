import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import UploadPrescriptionScreen from '../screens/UploadPrescriptionScreen';
import CollectionScreen from '../screens/CollectionScreen';
import TransactionScreen from '../screens/TransactionScreen';
import SosAlertScreen from '../screens/SosAlertScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingDetailsScreen from '../screens/BookingDetailsScreen';
import BookTestHeader from '../screens/BookTestHeader';
import BookTestSearchScreen from '../screens/BookTestSearchScreen';
import AddPatientScreen from '../screens/AddPatientScreen';
import ForgetPasswordScreen from '../screens/ForgotPasswordScreen';
import ChoosePatientScreen from '../screens/ChoosePatientScreen';
import ChooseTestScreen from '../screens/ChooseTestScreen';
import CalendarScreen from '../screens/CalendarScreen';
import PaymentDetailScreen from '../screens/PaymentDetailScreen';
import LedgerDetailsScreen from '../screens/LedgerDetailsScreen';
import BookTestScreen from '../screens/BookTestScreen';
import PaymentFailureScreen from '../screens/PaymentFailureScreen';

const Stack = createStackNavigator();
const ApplicationNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Bottom" component={BottomNavigation} />
        <Stack.Screen name="UploadPrescription" component={UploadPrescriptionScreen} />
        <Stack.Screen name="BookTestScreen" component={BookTestScreen} />
        <Stack.Screen name="Collection" component={CollectionScreen} />
        <Stack.Screen name="Transaction" component={TransactionScreen} />
        <Stack.Screen name="SosAlert" component={SosAlertScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="BookingDetail" component={BookingDetailsScreen} />
        <Stack.Screen name="Stepper" component={BookTestHeader} />
        <Stack.Screen name="BookTestSearch" component={BookTestSearchScreen} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="ChoosePatient" component={ChoosePatientScreen} />
        <Stack.Screen name="ChooseTest" component={ChooseTestScreen} />
        <Stack.Screen name="Calender" component={CalendarScreen} />
        <Stack.Screen name="PaymentDetail" component={PaymentDetailScreen} />
        <Stack.Screen name="Ledger" component={LedgerDetailsScreen} />
        <Stack.Screen name="PaymentFailure" component={PaymentFailureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ApplicationNavigation;

