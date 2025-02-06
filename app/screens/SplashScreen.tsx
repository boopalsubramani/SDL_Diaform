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
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.NO_INTERNET,
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
          source={{ uri: appSettingsAPIRes?.data?.Message[0].Flash_Logo }}
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




























