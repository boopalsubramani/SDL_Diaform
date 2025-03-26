import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Constants from '../util/Constants';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

// Get device height
const deviceHeight = Dimensions.get('window').height;

const OthersScreen = ({ navigation }: any) => {
  const [othersSubMenu, setOthersSubMenu] = useState([]);

  // Fetch menu items from Redux
  const menuItems = useSelector(
    (state: RootState) => state.appSettings.AppSettingDetails?.[0]?.Menu_Items || []
  );

  useEffect(() => {
    const othersMenu = menuItems.find((item: any) => item.Main_Menu_Code === 'OT');
    setOthersSubMenu((othersMenu as any)?.Sub_Menu_Items || []);
  }, [menuItems]);

  // Navigation mapping
  const navigationRoutes: Record<string, string> = {
    TR: 'Transaction',
    CC: 'Collection',
    LD: 'Ledger',
    LO: 'Login',
  };

  const handleSettingItemPress = (item: any) => {
    const route = navigationRoutes[item.Sub_Menu_Code];
    if (route) navigation.navigate(route);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleSettingItemPress(item)}>
      <View style={styles.itemContainer}>
        <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor || '#ccc' }]}>
          <Image source={{ uri: item.Tab_Icon_url }} style={styles.iconImage} />
        </View>
        <Text style={styles.itemText}>{item.Menu_Desc}</Text>
        <Image source={require('../images/rightArrow.png')} style={styles.arrowImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NavigationBar title="Others" />
      <FlatList data={othersSubMenu} renderItem={renderItem} keyExtractor={(item) => item.id?.toString()} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Constants.COLOR.WHITE_COLOR },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, marginHorizontal: 15 },
  iconContainer: { padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
  iconImage: { width: deviceHeight / 35, height: deviceHeight / 35, resizeMode: 'contain' },
  arrowImage: { width: deviceHeight / 35, height: deviceHeight / 35, tintColor: '#3C3636', resizeMode: 'contain' },
  itemText: { flex: 1, paddingHorizontal: 15, fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
});

export default OthersScreen;

