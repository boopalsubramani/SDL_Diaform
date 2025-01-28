


// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// const PaymentScreen = () => {
//   const [selectedOption, setSelectedOption] = useState(null);

//   const handleOptionPress = (option: any) => {
//     setSelectedOption(option);
//   };

//   const renderRadioButton = (option: string | null) => {
//     return selectedOption === option ? (
//       <View style={styles.radioButtonSelected} />
//     ) : (
//       <View style={styles.radioButtonUnselected} />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[styles.option, selectedOption === 'withInvoice' && styles.selected]}
//         onPress={() => handleOptionPress('withInvoice')}
//       >
//         {renderRadioButton('withInvoice')}
//         <Text style={styles.optionText}>With invoice</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.option, selectedOption === 'withoutInvoice' && styles.selected]}
//         onPress={() => handleOptionPress('withoutInvoice')}
//       >
//         {renderRadioButton('withoutInvoice')}
//         <Text style={styles.optionText}>Without invoice</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.option, selectedOption === 'deposit' && styles.selected]}
//         onPress={() => handleOptionPress('deposit')}
//       >
//         {renderRadioButton('deposit')}
//         <Text style={styles.optionText}>Deposit</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingVertical: 10,
//     paddingHorizontal:10
//   },
//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 6,
//     borderRadius: 4,
//     backgroundColor: '#fff',
//   },
//   selected: {
//     borderColor: '#007bff',
//   },
//   optionText: {
//     fontSize: 12,
//     marginLeft: 15,
//   },
//   radioButtonSelected: {
//     width: 12,
//     height: 12,
//     borderRadius: 8,
//     backgroundColor: 'black',
//   },
//   radioButtonUnselected: {
//     width: 12,
//     height: 12,
//     borderRadius: 8,
//     borderColor: '#ccc',
//     borderWidth: 2,
//   },
// });

// export default PaymentScreen;




import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions, } from 'react-native';
import NavigationBar from '../common/NavigationBar';

const deviceHeight = Dimensions.get('window').height;

const PaymentScreen = () => {
  const [selectedOption, setSelectedOption] = useState('With invoice');

  const options = ['With invoice', 'Without invoice', 'Deposit'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar title="Payments"/>
      <View style={styles.container}>
        <View style={styles.toggleGroup}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => setSelectedOption(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require('../images/search.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require('../images/calenderBlack.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },

  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#000',
  },
  iconGroup: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});

export default PaymentScreen;

