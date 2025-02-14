export type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  BookTestSearchScreen: undefined;
  AddPatient: undefined;
  UploadPrescription: undefined;
  ChoosePatient: undefined;
  BookTestSearch: { selectedPatientDetails: any };
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
  }



  // Add other screens as needed
};
