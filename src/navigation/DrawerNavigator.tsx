import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import DashboardScreen from '../screens/DashboardScreen';
import SideMenu from '../components/SideMenu';

const Drawer = createDrawerNavigator();

// =====================================================
// DRAWER NAVIGATOR
// This component is rendered by the root Stack Navigator.
// Its `navigation` prop is therefore the root Stack navigation.
// =====================================================
const DrawerNavigator = ({route, navigation}: any) => {
  const userId = route.params?.userId;

  return (
    <Drawer.Navigator
      drawerContent={props => (
        <SideMenu
          {...props}
          userId={userId}
          rootNavigation={navigation}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        initialParams={{userId}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;