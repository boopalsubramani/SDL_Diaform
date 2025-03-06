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
