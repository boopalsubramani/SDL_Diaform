import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Constants from '../util/Constants';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

// Get device height
const deviceHeight = Dimensions.get('window').height;

// Define menu item type
interface MenuItem {
  Main_Menu_Code: string;
  Sub_Menu_Code: string;
  Menu_Desc: string;
  Menu_Order: number;
  Tab_Icon_url?: string;
  Selected_Tab_Icon_Url?: string;
  Show_Icon?: boolean;
  Default?: boolean;
  backgroundColor?: string;
  id?: number | string;
}

// Define app settings type
interface AppSettingDetails {
  Menu_Items: MenuItem[];
}

// Component
const OthersScreen = ({ navigation }: any) => {
  // State for submenu items
  const [othersSubMenu, setOthersSubMenu] = useState<MenuItem[]>([]);

  // Fetch settings from Redux store
  const bottomImages = useSelector(
    (state: RootState) => state.appSettings.AppSettingDetails as AppSettingDetails[]
  );

  // Effect to update submenu items based on Main_Menu_Code
  useEffect(() => {
    if (bottomImages.length > 0 && bottomImages[0]?.Menu_Items) {
      const menuItems = bottomImages[0].Menu_Items;

      // Find the menu with "OT" (Others)
      const othersMenu = menuItems.find((item) => item.Main_Menu_Code === 'OT');

      // Set Sub_Menu_Items if found
      if (othersMenu && 'Sub_Menu_Items' in othersMenu) {
        setOthersSubMenu((othersMenu as any).Sub_Menu_Items || []);
      }
    }
  }, [bottomImages]);

  // Handle navigation based on Sub_Menu_Code
  const handleSettingItemPress = (item: MenuItem) => {
    switch (item.Sub_Menu_Code) {
      case 'TR':
        navigation.navigate('Transaction');
        break;
      case 'CC':
        navigation.navigate('Collection');
        break;
      case 'LD':
        navigation.navigate('Ledger');
        break;
      case 'LO':
        navigation.navigate('Login');
        break;
      default:
        break;
    }
  };

  // Render each menu item
  const renderItem = ({ item }: { item: MenuItem }) => {
    return (
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
  };

  return (
    <View style={styles.container}>
      <NavigationBar title="Others" />
      <FlatList
        data={othersSubMenu}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  iconContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    resizeMode: 'contain',
  },
  arrowImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    resizeMode: 'contain',
    tintColor: '#3C3636'
  },
  itemText: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: Constants.FONT_SIZE.M,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
});

export default OthersScreen;
