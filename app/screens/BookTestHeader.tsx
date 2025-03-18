import React, { useEffect } from 'react';
import { Text, View, StyleSheet, I18nManager } from 'react-native';
import { useAppSettings } from '../common/AppSettingContext';
import Constants from '../util/Constants';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

interface Language {
  Alignment: 'ltr' | 'rtl';
}

const BookTestHeader = ({ selectValue }: any) => {
  const { labels } = useAppSettings();
  const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;

  useEffect(() => {
    I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
  }, [selectedLanguage]);

  const getLabel = (key: string) => {
    return labels[key]?.defaultMessage || '';
  };

  const getCircleStyle = (step: number) => {
    const isSelected = selectValue >= step;
    return isSelected
      ? styles.selectedCircleShapeView
      : styles.unselectCircleShapeView;
  };

  const getTextStyle = (step: number) => {
    const isSelected = selectValue >= step;
    return isSelected ? styles.selectedTextStyle : styles.unselectedTextStyle;
  };

  return (
    <View style={styles.headerStatus}>
      {/* Lab Test Step */}
      <View style={styles.containerView}>
        <View style={styles.itemView}>
          <View style={getCircleStyle(1)}>
            <Text style={getTextStyle(1)}>{getLabel('labtesthead_1')}</Text>
          </View>
          <View style={styles.dottedStyle} />
        </View>
        <Text style={styles.statusLabelStyle}>{getLabel('labtesthead_3')}</Text>
      </View>

      {/* Book Step */}
      <View style={styles.containerView}>
        <View style={styles.itemView}>
          <View style={getCircleStyle(2)}>
            <Text style={getTextStyle(2)}>{getLabel('labtesthead_8')}</Text>
          </View>
          <View style={styles.dottedStyle} />
        </View>
        <Text style={styles.statusLabelStyle}>{getLabel('labtesthead_5')}</Text>
      </View>

      {/* Patient Info Step */}
      <View style={styles.containerView}>
        <View style={styles.itemView}>
          <View style={getCircleStyle(3)}>
            <Text style={getTextStyle(3)}>{getLabel('labtesthead_4')}</Text>
          </View>
        </View>
        <Text style={styles.statusLabelStyle}>{getLabel('labtesthead_2')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStatus: {
    backgroundColor: '#ECEEF5',
    flexDirection: 'row',
    paddingVertical: 15,
  },
  selectedCircleShapeView: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: Constants.COLOR.THEME_COLOR,
    alignSelf: 'center',
  },
  unselectCircleShapeView: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    borderColor: '#666666',
    borderWidth: 0.5,
    alignSelf: 'center',
  },
  selectedTextStyle: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.WHITE_COLOR,
    alignSelf: 'center',
    padding: 5,
  },
  unselectedTextStyle: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BLACK_COLOR,
    alignSelf: 'center',
    padding: 5,
  },
  dottedStyle: {
    height: 1,
    width: '75%',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'dotted',
    position: 'absolute',
    left: 30,
  },
  statusLabelStyle: {
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.S,
    marginVertical: 4,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily:Constants.FONT_FAMILY.fontFamilyRegular,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BookTestHeader;


