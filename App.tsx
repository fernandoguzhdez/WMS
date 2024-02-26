import React, { useEffect, useContext } from 'react'
import { Navigation } from './src/componentes/Navigation';
import { AuthProvider } from './src/contex/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';

export function App() {

  return (
    <PaperProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);