import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import Constants from "../util/Constants";
import Spinner from 'react-native-spinkit';
import DeviceInfo from 'react-native-device-info';
import { useRefAppSettingMutation } from '../redux/service/AppSettingService';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get("window").width;

const SplashScreen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(true);
  const [appVersion, setAppVersion] = useState('');

  const [appSettingsAPIReq, appSettingsAPIRes] =
    useRefAppSettingMutation();

  //useeffect for Logo
  useEffect(() => {
    const appSettingsObj = {

    };
    appSettingsAPIReq(appSettingsObj);
  }, []);


  useEffect(() => {
    const version = DeviceInfo.getVersion();
    setAppVersion(version);

    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setIsConnected(false);
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.',
          [{ text: 'OK', onPress: () => console.log('Alert closed') }]
        );
      } else {
        setIsConnected(true);
      }
    });

    const timeout = setTimeout(() => {
      if (isConnected) {
        navigation.navigate('Login');
      } else {
      }
    }, 5000);

    // Cleanup listeners and timeout
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [isConnected, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          source={{ uri: appSettingsAPIRes?.data?.Message[0].Flash_Logo}}
          style={styles.image}
        />
      </View>
      <Spinner
        style={{
          marginTop: deviceHeight / 10,
          alignItems: 'center',
          alignSelf: 'center',
        }}
        isVisible={true}
        size={40}
        type={'Wave'}
        color={Constants.COLOR.THEME_COLOR}
      />
      <Text style={styles.versionText}>App Version: {appVersion}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    alignSelf: 'center',
  },
  image: {
    width: deviceHeight * (5 / 10),
    height: deviceHeight * (3 / 28),
  },
  versionText: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  },
});

export default SplashScreen;




// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

// const SplashScreen = () => {
//   const [users, setUsers] = useState([]); // State to store user data
//   const [loading, setLoading] = useState(true); // State to manage loading

//   // Fetch data from the API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('https://gorest.co.in/public/v2/users');
//         const data = await response.json();
//         setUsers(data); // Update the user state with the fetched data
//         setLoading(false); // Stop the loading indicator
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         setLoading(false); // Stop loading even if there's an error
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Render each user item
//   const renderUser = ({ item }) => (
//     <View style={styles.userCard}>
//       <Text style={styles.name}>{item.name}</Text>
//       <Text style={styles.email}>{item.email}</Text>
//       <Text style={styles.info}>Gender: {item.gender}</Text>
//       <Text style={styles.info}>Status: {item.status}</Text>
//     </View>
//   );

//   // If loading, show a loading spinner
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={users}
//         renderItem={renderUser}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   listContainer: {
//     padding: 16,
//   },
//   userCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 12,
//     elevation: 3,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   email: {
//     fontSize: 14,
//     color: '#555',
//     marginVertical: 4,
//   },
//   info: {
//     fontSize: 12,
//     color: '#777',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default SplashScreen;


