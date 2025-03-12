import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Constants from "../util/Constants";
import DeviceInfo from 'react-native-device-info';
import { useAppSettings } from '../common/AppSettingContext';
import SpinnerIndicator from '../common/SpinnerIndicator';
import { RootStackParamList } from '../routes/Types';

const deviceHeight = Dimensions.get('window').height;

type NavigationProp = StackNavigationProp<RootStackParamList, "SplashScreen">;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isConnected, setIsConnected] = useState(true);
  const [appVersion, setAppVersion] = useState('');
  const { settings } = useAppSettings();

  useEffect(() => {
    setAppVersion(DeviceInfo.getVersion());

    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setIsConnected(false);
        Alert.alert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.NO_INTERNET,
          [{ text: 'OK', onPress: () => console.log('Alert closed') }]
        );
      } else {
        setIsConnected(true);
      }
    });

    const timeout = setTimeout(() => {
      if (isConnected && settings) {
        navigation.replace("Login");
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [isConnected, settings, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {settings?.Message?.[0]?.Flash_Logo && (
          <Image
            resizeMode="contain"
            source={{ uri: settings.Message[0].Flash_Logo }}
            style={styles.image}
          />
        )}
      </View>
      <SpinnerIndicator />
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


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, Alert, Dimensions, Linking } from 'react-native';
// import { StackNavigationProp } from "@react-navigation/stack";
// import { useNavigation } from '@react-navigation/native';
// import NetInfo from '@react-native-community/netinfo';
// import DeviceInfo from 'react-native-device-info';
// import { useAppSettings } from '../common/AppSettingContext';
// import SpinnerIndicator from '../common/SpinnerIndicator';
// import { RootStackParamList } from '../routes/Types';
// import axios from 'axios';
// import config from '../Config.json';

// const deviceHeight = Dimensions.get('window').height;

// type NavigationProp = StackNavigationProp<RootStackParamList, "SplashScreen">;

// const SplashScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [isConnected, setIsConnected] = useState(true);
//   const { settings } = useAppSettings();

//   useEffect(() => {
//     const currentVersion = DeviceInfo.getVersion();

//     const unsubscribe = NetInfo.addEventListener(state => {
//       if (!state.isConnected) {
//         setIsConnected(false);
//         Alert.alert('Error', 'No internet connection. Please check your network.', [{ text: 'OK' }]);
//       } else {
//         setIsConnected(true);
//       }
//     });

//     const checkForUpdate = async () => {
//       try {
//         const response = await axios.get(`${config.API_BASE_URL}`);
//         const { mnt, mnt_msg, vra } = response.data; 

//         // Check for maintenance mode
//         if (mnt === 1) {
//           Alert.alert('Maintenance Mode', mnt_msg, [{ text: 'OK' }]);
//           return;
//         }

//         // Check for version update
//         const latestVersion = vra?.lver;
//         if (latestVersion && latestVersion !== currentVersion) {
//           Alert.alert(
//             'Update Available',
//             'A new version of the app is available. Please update for the best experience.',
//             [
//               { text: 'Update', onPress: () => Linking.openURL(config.UPDATE_URL) },
//               { text: 'Later', onPress: () => navigation.replace("Login") },
//             ]
//           );
//         } else {
//           setTimeout(() => navigation.replace("Login"), 3000);
//         }
//       } catch (error) {
//         console.error('Error checking version:', error);
//         setTimeout(() => navigation.replace("Login"), 3000);
//       }
//     };

//     if (isConnected) {
//       checkForUpdate();
//     }

//     return () => {
//       unsubscribe();
//     };
//   }, [isConnected, navigation]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.imageContainer}>
//         {settings?.Message?.[0]?.Flash_Logo && (
//           <Image
//             resizeMode="contain"
//             source={{ uri: settings.Message[0].Flash_Logo }}
//             style={styles.image}
//           />
//         )}
//       </View>
//       <SpinnerIndicator />
//       <Text style={styles.versionText}>App Version: {DeviceInfo.getVersion()}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   imageContainer: {
//     alignSelf: 'center',
//   },
//   image: {
//     width: deviceHeight * (5 / 10),
//     height: deviceHeight * (3 / 28),
//   },
//   versionText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: 'gray',
//   },
// });

// export default SplashScreen;
