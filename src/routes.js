import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Detail from './pages/Detail';

const Routes = createAppContainer(
  createStackNavigator({
    Main: {
      screen: Main,
      navigationOptions: {
        title: 'Mapa de devs'
      },
    },
    Detail: {
      screen: Detail,
      navigationOptions: {
        title: 'Perfil no Github',
      },
    },
  }, {
    defaultNavigationOptions: {
      headerBackTitleVisible: false,
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#7159c1'
      },
    },
  })
);

export default Routes;