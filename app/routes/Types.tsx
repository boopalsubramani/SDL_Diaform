export type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  BookTestSearchScreen: undefined;
  BookTestScreen: undefined;
  AddPatient: undefined;
  UploadPrescription: undefined;
  ChoosePatient: undefined;
  BookTestSearch: {
    selectedPatientDetails: any;
    selectedTests: any;
    totalCartValue: any;
    patientData: any;
    fromPaymentDetailsScreen:any

  };
  ChooseTest: {
    selectedTests: { Service_Name: string; Amount: number }[];
    selectedPatientDetails: any;
    totalCartValue: number;
    shouldNavigateToCalender: boolean;
    testData: any[];
    patientData: any;
    fromPaymentDetailsScreen:any
  };
  Calender: {
    selectedTests: { Service_Name: string; Amount: number }[];
    selectedPatientDetails: any;
    totalCartValue: number;
    testData: any[];
    patientData: any;

  };
  PaymentDetail: {
    testData: any[];
    imageUri: any[];
    patientData: any;
  };
  BookTest: any;
  Collection: any[];
  Transaction: any;
  PaymentFailure: any;
  Payment: any;
  // Add other screens as needed
};
