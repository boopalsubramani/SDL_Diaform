import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, I18nManager } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

const deviceHeight = Dimensions.get('window').height;

interface Language {
  Alignment: 'ltr' | 'rtl';
}

const UploadPrescriptionScreen = ({ navigation, route }: any) => {
  const { selectedPatientDetails } = route.params;
  const { labels } = useAppSettings();
  const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
  }, [selectedLanguage]);

  const getLabel = (key: string) => labels[key]?.defaultMessage || '';

  const handleCross = () => {
    navigation.goBack();
  };

  const openCamera = async () => {
    try {
      const result = await launchCamera({ mediaType: 'photo', quality: 1 });
      handleImagePickerResponse(result);
    } catch (error) {
      console.error('Failed to launch camera:', error);
    }
  };

  const openImageLibrary = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
      handleImagePickerResponse(result);
    } catch (error) {
      console.error('Failed to launch image library:', error);
    }
  };

  const handleImagePickerResponse = (response: any) => {
    console.log('Image Picker Response:', response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    } else if (response.errorMessage) {
      console.log('ImagePicker Error:', response.errorMessage);
      return;
    }

    const uri = response.assets?.[0]?.uri;
    if (!uri) {
      console.log('No URI found in response');
      return;
    }
    console.log('Setting image URI:', uri);
    setImageUri(uri);
    console.log('Image URI state updated:', uri);
    navigation.navigate('ChooseTest', { imageUri: uri, selectedPatientDetails });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{getLabel("uploadpresscr_6")}</Text>
        <TouchableOpacity onPress={handleCross}>
          <Image style={styles.closeImageStyle} source={require('../images/black_cross.png')} />
        </TouchableOpacity>
      </View>

      <View style={styles.uploadContainer}>
        <Image source={require('../images/cloud_upload.png')} />
        <Text style={styles.uploadText}>{getLabel("uploadpresscr_1")}</Text>
        <Text style={styles.uploadDescription}>{getLabel("uploadpresscr_2")}</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={openImageLibrary}>
          <Text style={styles.uploadButtonText}>{getLabel("uploadpresscr_3")}</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>{getLabel("uploadpresscr_4")}</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
          <Text style={styles.uploadButtonText}>{getLabel("uploadpresscr_5")}</Text>
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
  uploadContainer: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 0.5,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.COLOR.UPLOAD_FILES_BG,
  },
  uploadText: {
    fontSize: Constants.FONT_SIZE.XXL,
    fontWeight: '500',
    paddingVertical: 20,
  },
  uploadDescription: {
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.M,
    paddingHorizontal: Platform.OS === 'ios' ? 60 : 40,
  },
  uploadButton: {
    backgroundColor: Constants.COLOR.CUSTOMER_CALL_BG_COLOR,
    marginTop: 30,
    paddingVertical: 10,
    width: deviceHeight * 0.25,
    borderRadius: 20,
  },
  uploadButtonText: {
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.WHITE_COLOR,
  },
  orText: {
    paddingVertical: 10,
  },
});

export default UploadPrescriptionScreen;