// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, FlatList, ScrollView } from 'react-native';
// import NavigationBar from '../common/NavigationBar';
// import { useRefAppDashboardMutation } from '../redux/service/DashboardService';
// import Spinner from 'react-native-spinkit';
// import Constants from '../util/Constants';
// import { useUser } from '../common/UserContext';
// import SpinnerIndicator from '../common/SpinnerIndicator';

// interface DashboardItem {
//   id: string;
//   title: string;
//   amount: string;
//   bgColor: string;
//   iconColor: string;
// }

// const AmountCard = ({ title, amount, bgColor, iconColor }: any) => {
//   return (
//     <View style={[styles.card, { backgroundColor: bgColor }]}>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{title}</Text>
//         <View style={styles.amountContainer}>
//           <Text style={styles.amount}>{amount}</Text>
//           <View style={[styles.iconPlaceholder, { backgroundColor: iconColor }]} />
//         </View>
//       </View>
//     </View>
//   );
// };

// const DashboardScreen = () => {
//   const { userData } = useUser();
//   const [dashboardApiReq, { isLoading, error }] = useRefAppDashboardMutation();
//   const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (!userData) return;

//       const payload = {
//         refType: userData.UserType,
//         refCode: userData.UserCode,
//       };

//       try {
//         const response = await dashboardApiReq(payload).unwrap();
//         if (response && response.Payments) {
//           const parsedData = parseApiResponse(response);
//           setDashboardData(parsedData);
//         } else {
//           setDashboardData([]);
//         }
//       } catch (e) {
//         console.error('Error fetching dashboard data:', e);
//         setDashboardData([]);
//       }
//     };

//     fetchDashboardData();
//   }, [dashboardApiReq, userData]);


//   const parseApiResponse = (response: { Payments: any[] }): DashboardItem[] => {
//     return response.Payments.map(
//       (item: { Field: string; Value: string; BgColor: string; IconColor: string }) => ({
//         id: item.Field,
//         title: item.Field,
//         amount: item.Value,
//         bgColor: item.BgColor,
//         iconColor: item.IconColor,
//       })
//     );
//   };

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <NavigationBar title="Dashboard" />
//         <View style={styles.loadingContainer}>
//           <Spinner
//             isVisible={true}
//             size={40}
//             type="Wave"
//             color={Constants.COLOR.THEME_COLOR}
//           />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <NavigationBar title="Dashboard" />
//         <SpinnerIndicator />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <NavigationBar title="Dashboard" />
//       {dashboardData.length === 0 ? (
//         <View style={styles.noDataContainer}>
//           <SpinnerIndicator />
//         </View>
//       ) : (
//         <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//           <FlatList
//             contentContainerStyle={styles.flatListContainer}
//             data={dashboardData}
//             renderItem={({ item }) => (
//               <AmountCard
//                 title={item.title}
//                 amount={item.amount}
//                 bgColor={item.bgColor}
//                 iconColor={item.iconColor}
//               />
//             )}
//             keyExtractor={(item) => item.id}
//           />
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: Constants.COLOR.WHITE_COLOR,
//   },
//   scrollViewContainer: {
//     padding: 16,
//   },
//   flatListContainer: {
//     flexGrow: 1,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: Constants.FONT_SIZE.L,
//     marginBottom: 10,
//   },
//   amountContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   amount: {
//     fontSize: Constants.FONT_SIZE.L,
//     fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
//     marginRight: 8,
//   },
//   iconPlaceholder: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//     borderRadius: 10,
//   },
//   noDataContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default DashboardScreen;



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ScrollView } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import { useRefAppDashboardMutation } from '../redux/service/DashboardService';
import Spinner from 'react-native-spinkit';
import Constants from '../util/Constants';
import { useUser } from '../common/UserContext';
import SpinnerIndicator from '../common/SpinnerIndicator';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

interface DashboardItem {
  id: string;
  title: string;
  amount: string;
  bgColor: string;
  iconColor: string;
  iconName: string;
}

const AmountCard = ({ title, amount, bgColor, iconColor, iconName }: DashboardItem) => {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{amount}</Text>
          <Icon name={iconName} size={24} color={iconColor} /> {/* Use the icon here */}
        </View>
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  const { userData } = useUser();
  const [dashboardApiReq, { isLoading, error }] = useRefAppDashboardMutation();
  const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userData) return;

      const payload = {
        refType: userData.UserType,
        refCode: userData.UserCode,
      };

      try {
        const response = await dashboardApiReq(payload).unwrap();
        if (response && response.Payments) {
          const parsedData = parseApiResponse(response);
          setDashboardData(parsedData);
        } else {
          setDashboardData([]);
        }
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
        setDashboardData([]);
      }
    };

    fetchDashboardData();
  }, [dashboardApiReq, userData]);

  const parseApiResponse = (response: { Payments: any[] }): DashboardItem[] => {
    return response.Payments.map(
      (item: { Field: string; Value: string; BgColor: string; IconColor: string; IconName: string }) => ({
        id: item.Field,
        title: item.Field,
        amount: item.Value,
        bgColor: item.BgColor,
        iconColor: item.IconColor,
        iconName: item.IconName,
      })
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NavigationBar title="Dashboard" />
        <View style={styles.loadingContainer}>
          <SpinnerIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NavigationBar title="Dashboard" />
        <SpinnerIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar title="Dashboard" />
      {dashboardData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <SpinnerIndicator />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <FlatList
            contentContainerStyle={styles.flatListContainer}
            data={dashboardData}
            renderItem={({ item }) => (
              <AmountCard
                title={item.title}
                amount={item.amount}
                bgColor={item.bgColor}
                iconColor={item.iconColor}
                iconName={item.iconName}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  scrollViewContainer: {
    padding: 16,
  },
  flatListContainer: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Constants.FONT_SIZE.L,
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: Constants.FONT_SIZE.L,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    marginRight: 8,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;
