
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';
import { useServiceBookingMutation } from '../redux/service/ServiceBookingService';
import { useUser } from '../common/UserContext';
import RNFS from 'react-native-fs';


const deviceHeight = Dimensions.get('window').height;

const UploadPrescriptionScreen = ({ route, navigation }: any) => {
  const { userData } = useUser();
  const {
    selectedTests = [],
    selectedDate,
    selectedTime,
    selectedPatientDetails,
    testData,
  } = route?.params || {};
  const { settings } = useAppSettings();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceBookingAPIReq] = useServiceBookingMutation();
  const [paymentMethod, setPaymentMethod] = useState('');


  const labels = settings?.Message?.[0]?.Labels || {};

  const getLabel = (key: string) => labels[key]?.defaultMessage || '';

  const handleCross = () => {
    navigation.goBack();
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const permissions = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ];

    for (const permission of permissions) {
      const result = await check(permission);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(`${permission} is not available on this device.`);
          return;
        case RESULTS.DENIED:
          console.log(`${permission} has not been requested / is denied but requestable.`);
          const requestResult = await request(permission);
          if (requestResult === RESULTS.GRANTED) {
            console.log(`${permission} granted.`);
          }
          return;
        case RESULTS.LIMITED:
          console.log(`${permission} is optional and not required.`);
          return;
        case RESULTS.GRANTED:
          console.log(`${permission} is already granted.`);
          return;
        case RESULTS.BLOCKED:
          console.log(`${permission} is denied and not requestable anymore.`);
          return;
      }
    }
  };

  const openCamera = async () => {
    try {
      const cameraPermission = await check(PERMISSIONS.ANDROID.CAMERA);
      if (cameraPermission === RESULTS.GRANTED) {
        const result = await launchCamera({ mediaType: 'photo' });
        handleImagePickerResponse(result);
      } else {
        const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
        if (requestResult === RESULTS.GRANTED) {
          const result = await launchCamera({ mediaType: 'photo' });
          handleImagePickerResponse(result);
        } else {
          console.log('Camera permission denied');
        }
      }
    } catch (error) {
      console.error('Failed to launch camera:', error);
    }
  };

  const openImageLibrary = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      handleImagePickerResponse(result);
    } catch (error) {
      console.error('Failed to launch image library:', error);
    }
  };


  const handleImagePickerResponse = async (response: any) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    } else if (response.errorCode) {
      console.log('ImagePicker Error:', response.errorMessage);
      return;
    }

    const uri = response.assets?.[0]?.uri;
    if (!uri) return;

    try {
      // Convert image to Base64
      const base64String = await RNFS.readFile(uri, 'base64');
      console.log("Base64 Image Selected:", base64String);

      // Set Base64 string as image URI
      setImageUri(base64String);

      // Automatically call API once image is selected
      handleUpdate(base64String);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  };


  const handleUpdate = async (base64Image: string) => {
    setIsLoading(true);

    const selectedTestDetails = selectedTests.map((test: any) => {
      const correspondingTestData = testData.find(
        (data: any) => data.Service_Name === test.Service_Name
      );
      return {
        TestType: correspondingTestData?.Service_Type,
        TestCode: correspondingTestData?.Service_Code,
        Service_Amount: correspondingTestData?.Amount,
        Service_Discount: correspondingTestData?.Discount_Amount,
        Primary_Share: correspondingTestData?.Primary_Share,
        Patient_Share: correspondingTestData?.Patient_Share,
        Test_VAT: correspondingTestData?.Test_VAT,
        Patient_VAT: correspondingTestData?.Patient_VAT,
        Aid_VAT: correspondingTestData?.Aid_VAT,
        T_Round_Off: correspondingTestData?.T_Round_off,
        Prof_Code: "",
      };
    });

    const payload = {
      Ref_Code: userData?.UserCode,
      Ref_Type: userData?.UserType,
      Pt_Code: selectedPatientDetails?.PtCode,
      Firm_No: "01",
      Name: selectedPatientDetails?.PtName,
      Dob: selectedPatientDetails?.DOB,
      Age: selectedPatientDetails?.Age,
      Gender: selectedPatientDetails?.Gender,
      Title_Code: selectedPatientDetails?.Title_Code,
      Title_Desc: selectedPatientDetails?.Title_Desc,
      Street: selectedPatientDetails?.Street,
      Place: selectedPatientDetails?.Street,
      City: selectedPatientDetails?.Street,
      Email: selectedPatientDetails?.Email_Id,
      Phone: selectedPatientDetails?.Mobile_No,
      User_Id: "",
      Paid_Amount: "0",
      Bill_Amount: selectedTests?.Amount,
      DiscountAmount: selectedTests?.Discount_Amount,
      DueAmount: selectedTests?.T_Patient_Due,
      Pay_No: "",
      Pay_Status: "P",
      Pay_Mode: paymentMethod === 'online' ? "O" : "C",
      Zero_Payment: 0,
      Promo_Code: "",
      Medical_Aid_No: selectedPatientDetails?.Medical_Aid_No,
      Coverage: "",
      Package_Code: "",
      Sponsor_Paid: "",
      NationalityCode: selectedPatientDetails?.Nationality,

      // Send Base64 image instead of file path
      Prescription_File1: base64Image,
      Prescription_File2: null,
      File_Extension1: "jpeg",
      File_Extension2: "",

      Sample_Collection_Date: selectedDate,
      Sample_Collection_Time: selectedTime,
      Services: selectedTestDetails,
    };

    try {
      const response = await serviceBookingAPIReq(payload).unwrap();
      if (response?.Code === 200 && response?.SuccessFlag === "true") {
        navigation.navigate('ChooseTest', { imageUri: base64Image });
      } else {
        Alert.alert('Error: Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error: Something went wrong.');
    } finally {
      setIsLoading(false);
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



// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import Constants from '../util/Constants';
// import { useAppSettings } from '../common/AppSettingContext';
// import { useServiceBookingMutation } from '../redux/service/ServiceBookingService';
// import RNFS from 'react-native-fs';

// const deviceHeight = Dimensions.get('window').height;

// const UploadPrescriptionScreen = ({ navigation }: any) => {
//   const { settings } = useAppSettings();
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceBookingAPIReq] = useServiceBookingMutation();

//   const labels = settings?.Message?.[0]?.Labels || {};
//   const getLabel = (key: string) => labels[key]?.defaultMessage || '';

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     const permissions = [
//       PERMISSIONS.ANDROID.CAMERA,
//       PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
//       PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
//     ];
//     for (const permission of permissions) {
//       const result = await check(permission);
//       if (result === RESULTS.DENIED) {
//         await request(permission);
//       }
//     }
//   };

//   const openCamera = async () => {
//     try {
//       const result = await launchCamera({ mediaType: 'photo', quality: 1 });
//       handleImagePickerResponse(result);
//     } catch (error) {
//       console.error('Failed to launch camera:', error);
//     }
//   };

//   const openImageLibrary = async () => {
//     try {
//       const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
//       handleImagePickerResponse(result);
//     } catch (error) {
//       console.error('Failed to launch image library:', error);
//     }
//   };

//   const handleImagePickerResponse = (response: any) => {
//     if (response.didCancel) {
//       console.log('User cancelled image picker');
//       return;
//     }
//     if (response.errorCode) {
//       console.log('ImagePicker Error:', response.errorMessage);
//       return;
//     }
//     if (response.assets && response.assets.length > 0) {
//       const image = response.assets[0];
//       setImageUri(image.uri);
//     }
//   };

//   const convertToBase64 = async (uri: string) => {
//     try {
//       return await RNFS.readFile(uri, 'base64');
//     } catch (error) {
//       console.error('Error converting image to Base64:', error);
//       return null;
//     }
//   };

//   const handleUpdate = async () => {
//     if (!imageUri) {
//       Alert.alert('No Image Selected', 'Please select an image before uploading.');
//       return;
//     }

//     setIsLoading(true);

//     // Convert to Base64 if required by your API
//     const base64Image = await convertToBase64(imageUri);

//     const payload = {
//       Ref_Code: '01000103',
//       Ref_Type: 'C',
//       Pt_Code: '0100005036',
//       Firm_No: '01',
//       Name: 'MONIKA',
//       Dob: '2000/01/27',
//       Age: '23.0',
//       Gender: 'F',
//       Title_Code: '05',
//       Title_Desc: 'Miss.',
//       Street: 'Blaji colony',
//       Place: 'tirupati',
//       City: 'tirupati',
//       Email: 'tirupati@gmail.com',
//       Phone: '9874558585',
//       User_Id: '',
//       Paid_Amount: '0',
//       Bill_Amount: '650.0',
//       DiscountAmount: '',
//       DueAmount: '780',
//       Pay_No: '',
//       Pay_Status: 'P',
//       Pay_Mode: 'C',
//       Zero_Payment: 0,
//       Promo_Code: '',
//       Medical_Aid_No: '',
//       Coverage: '',
//       Package_Code: '',
//       Sponsor_Paid: '',
//       NationalityCode: '006',
//       Prescription_File1: base64Image, // Send as Base64
//       Prescription_File2: null,
//       File_Extension1: 'jpeg',
//       File_Extension2: '',
//       Sample_Collection_Date: '2025/01/10',
//       Sample_Collection_Time: '16:25',
//       Services: [
//         {
//           TestType: 'T',
//           TestCode: '000226',
//           Service_Amount: '120.0',
//           Service_Discount: '0',
//           Primary_Share: '0',
//           Patient_Share: '144',
//           Test_VAT: '24',
//           Patient_VAT: '24',
//           Aid_VAT: '0',
//           T_Round_Off: '0',
//           Prof_Code: '',
//         },
//       ],
//     };

//     console.log('Uploading image...');

//     try {
//       const response = await serviceBookingAPIReq(payload).unwrap();
//       console.log('Response:', response);

//       if (response?.Code === 200 && response?.SuccessFlag === 'true') {
//         navigation.navigate('ChooseTest', { imageUri });
//       } else {
//         Alert.alert('Error: Something went wrong.');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       Alert.alert('Error: Something went wrong.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>{getLabel("uploadpresscr_6")}</Text>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image style={styles.closeImageStyle} source={require('../images/black_cross.png')} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.uploadContainer}>
//         <Image source={require('../images/cloud_upload.png')} />
//         <Text style={styles.uploadText}>{getLabel("uploadpresscr_1")}</Text>
//         <Text style={styles.uploadDescription}>{getLabel("uploadpresscr_2")}</Text>

//         <TouchableOpacity style={styles.uploadButton} onPress={openImageLibrary}>
//           <Text style={styles.uploadButtonText}>{getLabel("uploadpresscr_3")}</Text>
//         </TouchableOpacity>

//         <Text style={styles.orText}>{getLabel("uploadpresscr_4")}</Text>

//         <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
//           <Text style={styles.uploadButtonText}>{getLabel("uploadpresscr_5")}</Text>
//         </TouchableOpacity>

//         {imageUri && (
//           <View style={{ marginTop: 20 }}>
//             <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, borderRadius: 10 }} />
//             <TouchableOpacity style={styles.uploadButton} onPress={handleUpdate}>
//               <Text style={styles.uploadButtonText}>Upload Image</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG },
//   header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 25 },
//   headerText: { fontSize: Constants.FONT_SIZE.XL, paddingVertical: 16, color: Constants.COLOR.BUTTON_BG, fontWeight: '600' },
//   closeImageStyle: { alignSelf: 'flex-end', marginVertical: 16, width: deviceHeight / 35, height: deviceHeight / 35 },
//   uploadButton: { backgroundColor: Constants.COLOR.CUSTOMER_CALL_BG_COLOR, marginTop: 30, paddingVertical: 10, width: deviceHeight * 0.25, borderRadius: 20 },
//   uploadButtonText: { textAlign: 'center', fontSize: Constants.FONT_SIZE.S, color: Constants.COLOR.WHITE_COLOR },
//   orText: { paddingVertical: 10 },
// });

// export default UploadPrescriptionScreen;
