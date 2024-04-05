/**
 * @format
 */
import {registerRootComponent} from 'expo';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// export default function Main() {
//   return (
// <Provider >
//   <PaperProvider theme={theme} store={store}>
//     <NavigationContainer>
// <App />
//     </NavigationContainer>
//   </PaperProvider>
// </Provider>
//   );
// }

// registerRootComponent(Main);
AppRegistry.registerComponent(appName, () => App);
