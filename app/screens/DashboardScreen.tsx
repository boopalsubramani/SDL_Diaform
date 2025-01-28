import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ScrollView } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import { useRefAppDashboardMutation } from '../redux/service/DashboardService';
import Spinner from 'react-native-spinkit';
import Constants from '../util/Constants';

const AmountCard = ({ title, amount, bgColor, iconColor }: any) => {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{amount}</Text>
          <View style={[styles.iconPlaceholder, { backgroundColor: iconColor }]} />
        </View>
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  const [dashboardApiReq, { isLoading, data, error }] = useRefAppDashboardMutation();
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const payload = {
          refType: 'C',
          refCode: '01000104',
        };

        const response = await dashboardApiReq(payload);
        if (response && response.data) {
          const parsedData = parseApiResponse(response.data);
          setDashboardData(parsedData);
        }
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      }
    };

    fetchDashboardData();
  }, [dashboardApiReq]);

  const parseApiResponse = (response: { Payments: any[] }) => {
    return response.Payments.map(
      (item: { Field: any; Value: any; BgColor: any; IconColor: any }) => ({
        id: item.Field,
        title: item.Field,
        amount: item.Value,
        bgColor: item.BgColor,
        iconColor: item.IconColor,
      })
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Spinner
            isVisible={true}
            size={40}
            type="Wave"
            color={Constants.COLOR.THEME_COLOR}
          />
        </View>
      </SafeAreaView>
    );
  }


  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Failed to load data</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar title="Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={dashboardData}
          renderItem={({ item }: any) => (
            <AmountCard
              title={item.title}
              amount={item.amount}
              bgColor={item.bgColor}
              iconColor={item.iconColor}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
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
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
    marginRight: 8,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  spinner: {
    marginTop: '10%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;
