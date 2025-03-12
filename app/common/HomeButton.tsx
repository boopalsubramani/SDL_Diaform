import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Image, I18nManager } from 'react-native';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';
import { useSelector } from 'react-redux';

const deviceHeight = Dimensions.get('window').height;

const ButtonHome = () => {
  const { settings, labels } = useAppSettings();
  const selectedLanguage = useSelector(state => state.appSettings.selectedLanguage);

  useEffect(() => {
    I18nManager.forceRTL(selectedLanguage.Alignment === 'rtl');
  }, [selectedLanguage]);

  const getLabel = (key: string) => {
    return labels[key]?.defaultMessage || '';
  };

  return (
    <View style={styles.homeView}>
      <Image
        style={styles.homeImage}
        source={require('../images/homeWhite.png')}
        resizeMode="contain"
      />
      <Text style={styles.homeText}>{getLabel('btnhome_1')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  homeView: {
    flexDirection: 'row',
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  homeImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    marginLeft: 8,
    marginRight: 4,
    alignSelf: 'center',
  },
  homeText: {
    fontSize: 16, // Replace Constants.FONT_SIZE.M with a fixed value
    color: '#FFFFFF', // Replace Constants.COLOR.WHITE_COLOR with a hex value
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
});

export default ButtonHome;
