import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Constants from '../util/Constants';
import { useRefAppSettingMutation } from '../redux/service/AppSettingService';


const deviceHeight = Dimensions.get('window').height;

const UploadPrescriptionScreen = ({ navigation }: any) => {
  const [appSettingsAPIReq, appSettingsAPIRes] = useRefAppSettingMutation();

  useEffect(() => {
    const appSettingsObj = {};
    appSettingsAPIReq(appSettingsObj);
  }, []);

  const labels = appSettingsAPIRes?.data?.Message[0]?.Labels || {};

  const getLabel = (key: string) => {
    return labels[key]?.defaultMessage || '';
  };

  const handleCross = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{getLabel("uploadpresscr_6")}</Text>
        <TouchableOpacity onPress={handleCross}>
          <Image style={[styles.closeImageStyle]}
            source={require('../images/black_cross.png')} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          borderRadius: 0.5,
          flex: 1,
          height: Platform.OS == 'ios' ? deviceHeight + 20 : deviceHeight - 150,
          borderStyle: 'dashed',
          borderWidth: 1,
          top: 10,
          marginBottom: 30,
          marginHorizontal: 25,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Constants.COLOR.UPLOAD_FILES_BG,
        }}>
        <Image source={require('../images/cloud_upload.png')} />
        <Text
          style={{
            fontSize: Constants.FONT_SIZE.XXL,
            fontWeight: '500',
            paddingVertical: 20,
          }}>
          {getLabel("uploadpresscr_1")}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: Constants.FONT_SIZE.M,
            paddingHorizontal: Platform.OS == 'ios' ? 60 : 40,
          }}>
          {getLabel("uploadpresscr_2")}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Constants.COLOR.CUSTOMER_CALL_BG_COLOR,
            marginTop: 30,
            paddingVertical: 10,
            width: deviceHeight * 0.25,
            borderRadius: 20,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: Constants.FONT_SIZE.S,
              color: Constants.COLOR.WHITE_COLOR,
            }}>
            {getLabel("uploadpresscr_3")}
          </Text>
        </TouchableOpacity>
        <Text style={{ paddingVertical: 10 }}>{getLabel("uploadpresscr_4")}</Text>
        <TouchableOpacity
          style={{
            backgroundColor: Constants.COLOR.CUSTOMER_CALL_BG_COLOR,
            paddingVertical: 10,
            width: deviceHeight * 0.25,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontSize: Constants.FONT_SIZE.S,
              color: Constants.COLOR.WHITE_COLOR,
              textAlign: 'center',
              left: Platform.OS == 'ios' ? 0 : 0,
              paddingHorizontal: 10,
            }}>
            {getLabel("uploadpresscr_5")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginTop: 25,
  },
  headerText: {
    fontSize: Constants.FONT_SIZE.XL,
    paddingVertical: 16,
    color: Constants.COLOR.BUTTON_BG,
    fontWeight: '600',
  },
  closeImageStyle: {
    alignSelf: 'flex-end',
    marginVertical: 16,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
});

export default UploadPrescriptionScreen;
