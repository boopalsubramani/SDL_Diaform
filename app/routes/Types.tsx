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
    totalCartValue:any;
    
  };
  ChooseTest: {
    selectedTests: { Service_Name: string; Amount: number }[];
    selectedPatientDetails: any;
    totalCartValue: number;
    shouldNavigateToCalender: boolean;
    testData: any[];
  };
  Calender: {
    selectedTests: { Service_Name: string; Amount: number }[];
    selectedPatientDetails: any;
    totalCartValue: number;
    testData: any[];

  };
  PaymentDetail: {
    testData: any[];
    imageUri: any[];
  };
  BookTest: any;



  // Add other screens as needed
};
