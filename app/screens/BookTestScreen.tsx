// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import NavigationBar from '../common/NavigationBar';
// import BookTestHeader from './BookTestHeader';
// import ChoosePatientScreen from './ChoosePatientScreen';
// import CalendarScreen from './CalendarScreen';
// import PaymentDetailScreen from './PaymentDetailScreen';
// import ButtonNext from '../common/NextButton';
// import ButtonBack from '../common/BackButton';
// import BookTestSearchScreen from './BookTestSearchScree';
// import ChooseTestScreen from './ChooseTestScreen';
// import FinalPaymentScreen from './FinalPaymentScreen';

// const deviceHeight = Dimensions.get('window').height;

// const BookTestScreen = ({ navigation }: any) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [subStep, setSubStep] = useState(1);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
//   const [selectedPhysicianDetails, setSelectedPhysicianDetails] = useState(null);

//   const goToNextStep = () => {
//     if (selectedPatientDetails && selectedPhysicianDetails) {
//       if (currentStep === 1) {
//         if (subStep < 3) {
//           setSubStep(subStep + 1);
//         } else {
//           setCurrentStep(2);
//           setSubStep(1);
//         }
//       } else if (currentStep === 2 && selectedDate && selectedTime) {
//         setCurrentStep(3);
//         setSubStep(1);
//       }
//     } else {
//       Alert.alert('Please select both patient and physician details before proceeding.');
//     }
//   };
// console.log('currentStep',currentStep);
// console.log('substep',subStep);


//   const goToPreviousStep = () => {
//     if (currentStep === 1 && subStep > 1) {
//       setSubStep(subStep - 1);
//     } else if (currentStep === 1 && subStep === 1) {
//       return;
//     } else if (currentStep === 2) {
//       setCurrentStep(1);
//       setSubStep(3);
//     } else if (currentStep === 3) {
//       setCurrentStep(2);
//       setSubStep(1);
//     }
//   };

//   const handleDateTimeSelection = (date: string, time: string) => {
//     setSelectedDate(date);
//     setSelectedTime(time);
//   };

//   return (
//     <View style={styles.MainContainer}>
//       {!(currentStep === 1 && subStep === 3) && (
//         <>
//           <NavigationBar title="Book Test" />
//           <BookTestHeader selectValue={currentStep} />
//         </>
//       )}

//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         {/* Step 1 */}
//         {currentStep === 1 && subStep === 1 && (
//           <ChoosePatientScreen
//             showHeader={false}
//             selectedPatientDetails={selectedPatientDetails}
//             setSelectedPatientDetails={setSelectedPatientDetails}
//             selectedPhysicianDetails={selectedPhysicianDetails}
//             setSelectedPhysicianDetails={setSelectedPhysicianDetails}
//           />
//         )}
//         {currentStep === 1 && subStep === 2 && (
//           <ChooseTestScreen
//             navigation={navigation}
//             showHeader={false}
//           />
//         )}
//         {currentStep === 1 && subStep === 3 && (
//           <BookTestSearchScreen showHeader={false} />
//         )}

//         {/* Step 2 */}
//         {currentStep === 2 && (
//           <CalendarScreen
//             showHeader={true}
//             navigation={navigation}
//             onDateTimeSelect={handleDateTimeSelection}
//           />
//         )}

//         {/* Step 3 */}
//         {currentStep === 3 && subStep === 1 && (
//           <PaymentDetailScreen navigation={navigation} showHeader={true} />
//         )}

//         {currentStep === 3 && subStep === 2 && (
//           <FinalPaymentScreen navigation={navigation} showHeader={false} />
//         )}
//       </ScrollView>

//       {/* Navigation Buttons */}
//       <View
//         style={[
//           styles.navigationContainer,
//           currentStep === 1 && subStep === 1
//             ? { justifyContent: 'flex-end' }
//             : { justifyContent: 'space-between' },
//         ]}
//       >
//         {!(currentStep === 1 && subStep === 1) && !(currentStep === 1 && subStep === 3) && (
//           <TouchableOpacity onPress={goToPreviousStep}>
//             <ButtonBack />
//           </TouchableOpacity>
//         )}
//         {!(currentStep === 1 && subStep === 3) && (
//           <TouchableOpacity onPress={goToNextStep}>
//             <ButtonNext />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// export default BookTestScreen;

// const styles = StyleSheet.create({
//   MainContainer: {
//     flex: 1,
//     backgroundColor: '#FBFBFB',
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   navigationContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#FBFBFB',
//   },
// });




import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import ChoosePatientScreen from './ChoosePatientScreen';
import ChooseTestScreen from './ChooseTestScreen';
import BookTestSearchScreen from './BookTestSearchScree';
import CalendarScreen from './CalendarScreen';
import PaymentDetailScreen from './PaymentDetailScreen';
import FinalPaymentScreen from './FinalPaymentScreen';
import ButtonNext from '../common/NextButton';
import ButtonBack from '../common/BackButton';

const BookTestScreen = ({ navigation }: any) => {
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [selectedPhysicianDetails, setSelectedPhysicianDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleNext = () => {
    if (!selectedPatientDetails || !selectedPhysicianDetails) {
      Alert.alert('Please select both patient and physician details.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert('Please select a date and time.');
      return;
    }

    // Proceed to next section (payment or finalization)
    setPaymentDetails({});  // Just a placeholder for the final step
  };

  const handleBack = () => {
    // Handle going back (could go back to patient/physician selection)
    setPaymentDetails(null);  // Go back to previous step
  };

  return (
    <View style={styles.MainContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Patient & Physician Selection */}
        {!selectedPatientDetails || !selectedPhysicianDetails ? (
          <ChoosePatientScreen
            selectedPatientDetails={selectedPatientDetails}
            setSelectedPatientDetails={setSelectedPatientDetails}
            selectedPhysicianDetails={selectedPhysicianDetails}
            setSelectedPhysicianDetails={setSelectedPhysicianDetails}
          />
        ) : (
          // Test Selection
          !selectedDate || !selectedTime ? (
            <ChooseTestScreen navigation={navigation} />
          ) : (
            // Calendar & Time Selection
            <CalendarScreen
              onDateTimeSelect={(date: string, time: string) => {
                setSelectedDate(date);
                setSelectedTime(time);
              }}
            />
          )
        )}

        {/* Payment Details */}
        {selectedDate && selectedTime && (
          <PaymentDetailScreen navigation={navigation} />
        )}

        {/* Final Payment Confirmation */}
        {paymentDetails && <FinalPaymentScreen navigation={navigation} />}
      </ScrollView>

      {/* Navigation Buttons */}
      {/* <View style={styles.navigationContainer}>
        {paymentDetails && (
          <TouchableOpacity onPress={handleBack}>
            <ButtonBack />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleNext}>
          <ButtonNext />
        </TouchableOpacity>
      </View> */}
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
  navigationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FBFBFB',
    justifyContent: 'flex-end',
   
  },
});

export default BookTestScreen;


