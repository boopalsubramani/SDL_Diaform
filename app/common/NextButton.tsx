import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Image, I18nManager } from 'react-native';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

const deviceHeight = Dimensions.get('window').height;

interface Language {
  Alignment: 'ltr' | 'rtl';
}

const ButtonNext = () => {
  const { labels } = useAppSettings();
  const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;

  useEffect(() => {
    I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
  }, [selectedLanguage]);

  const getLabel = (key: string) => {
    return labels[key]?.defaultMessage || '';
  };


  return (
    <View style={styles.nextMainView}>
      <Text style={styles.nextText}>{getLabel('btnnext_1')}</Text>
      <Image
        style={styles.nextImage}
        resizeMode="contain"
        source={require('../images/chevron-right.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nextMainView: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: Constants.COLOR.THEME_COLOR,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 4,
  },
  nextText: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    textAlign: 'right',
    alignItems: 'center',
    color: Constants.COLOR.WHITE_COLOR,
    fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
    fontSize: Constants.FONT_SIZE.M,
  },
  nextImage: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
});

export default ButtonNext;
