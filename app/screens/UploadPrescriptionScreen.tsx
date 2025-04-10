import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, I18nManager, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { height: deviceHeight } = Dimensions.get('window');

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

  const handleCross = () => navigation.goBack();

  const requestCameraPermission = async () => {
    const permission = PERMISSIONS.ANDROID.CAMERA;
    const checkPermission = await check(permission);
    if (checkPermission === RESULTS.DENIED) {
      const requestPermission = await request(permission);
      return requestPermission === RESULTS.GRANTED;
    }
    return checkPermission === RESULTS.GRANTED;
  };

  const requestStoragePermission = async () => {
    const permissions = [
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED,
    ];

    for (const permission of permissions) {
      const checkPermission = await check(permission);
      if (checkPermission === RESULTS.DENIED) {
        const requestPermission = await request(permission);
        if (requestPermission !== RESULTS.GRANTED) {
          return false;
        }
      } else if (checkPermission !== RESULTS.GRANTED) {
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = async (pickerFunction: (options: any) => Promise<any>) => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };
      const result = await pickerFunction(options);
      handleImagePickerResponse(result);
    } catch (error) {
      console.error('Failed to launch image picker:', error);
    }
  };

  const handleImagePickerResponse = (response: any) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }
    if (response.errorCode || response.errorMessage || !response.assets?.[0]?.uri) {
      console.error('ImagePicker Error:', response.errorCode, response.errorMessage);
      Alert.alert('Error', 'Failed to select image. Please try again.');
      return;
    }
    const uri = response.assets[0].uri;
    setImageUri(uri);
    navigation.navigate('ChooseTest', { imageUri: uri, selectedPatientDetails });
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      handleImagePicker(launchCamera);
    } else {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take a photo.',
        [{ text: 'OK', onPress: () => console.log('Camera permission denied') }]
      );
    }
  };

  const openImageLibrary = async () => {
    const hasPermission = await requestStoragePermission();
    if (hasPermission) {
      handleImagePicker(launchImageLibrary);
    } else {
      Alert.alert(
        'Permission Required',
        'Storage permission is required to access the photo library.',
        [{ text: 'OK', onPress: () => console.log('Storage permission denied') }]
      );
    }
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
