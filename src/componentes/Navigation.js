import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements'
import { Login } from '../screens/Login/Login';
import { Home } from '../screens/Home';
import { Conexion } from '../screens/Login/Conexion';
import { AuthContext } from '../contex/AuthContext';
import { ConteoInventario } from '../screens/Inventario/Conteo De Inventario/ConteoInventario';
import { TransferenciaStock } from '../screens/Inventario/Solicitud De Transferencia/TransferenciaStock';
import { SolicitudTransferencia } from '../screens/Inventario/Solicitud De Transferencia/SolicitudTransferencia';
import { ItemsTransferencia } from '../screens/Inventario/Solicitud De Transferencia/ItemsTransferencia';
import { ListadoItemsTransfer } from '../screens/Inventario/Solicitud De Transferencia/ListadoItemsTransfer';
import { ListadoSeriesLotes } from '../screens/Inventario/Solicitud De Transferencia/ListadoSeriesLotes';
import { Articulos } from '../screens/Inventario/Conteo De Inventario/Articulos';
import { Scanner } from '../componentes/Scanner';
import { TabArticulos } from '../screens/Inventario/Conteo De Inventario/TabArticulos';
import { IconButton, MD3Colors } from 'react-native-paper';
import { View } from 'react-native';
import { TransferenciaSerieLote } from '../screens/Inventario/Solicitud De Transferencia/TransferenciaSerieLote';
import { DetalleInventario } from '../screens/Inventario/Detalle Inventario/DetalleInventario';
import { DetalleInventarioSL } from '../screens/Inventario/Detalle Inventario/DetalleInventarioSL';

const Stack = createNativeStackNavigator();

export function Navigation() {
    const { tokenInfo, getData, setActivarBuscadorConteoInv, activarBuscadorConteoInv, setActivarBuscadorArticulos, activarBuscadorArticulos, iconoBuscarArticulos, indexTab } = useContext(AuthContext);

    useEffect(() => {
        getData()
        console.log('Estoy en el navigation.....', tokenInfo)
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {tokenInfo.token != null ? (
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    </>
                )}
                <Stack.Screen name="Conexion" component={Conexion} options={{ headerShown: true, title: 'Configurar Conexion' }} />
                <Stack.Screen name="ConteoInventario" component={ConteoInventario} options={{
                    headerShown: true, title: 'Conteo de inventario', headerRight: () =>
                        activarBuscadorConteoInv !== true ?
                            <IconButton
                                style={{}}
                                icon="magnify"
                                size={35}
                                iconColor='gray'
                                onPress={() => setActivarBuscadorConteoInv(!activarBuscadorConteoInv)}
                            /> :
                            <IconButton
                                style={{}}
                                icon="close"
                                size={35}
                                iconColor='gray'
                                onPress={() => setActivarBuscadorConteoInv(!activarBuscadorConteoInv)}
                            />
                }} />
                <Stack.Screen name="TransferenciaStock" component={TransferenciaStock} options={{ headerShown: true, title: 'Transferencia de Stock', }} />
                <Stack.Screen name="SolicitudTransferencia" component={SolicitudTransferencia} options={{ headerShown: true, title: 'Solicitud de transferencia', }} />
                <Stack.Screen name="Articulos" component={Articulos} options={{
                    headerShown: true, title: 'Articulos'
                }} />
                <Stack.Screen name="Scanner" component={Scanner} options={{ headerShown: true, title: 'Scanner' }} />
                <Stack.Screen name="TabArticulos" component={TabArticulos}
                    options={({ route, navigation }) => ({
                        title: 'Inventario ' + '(' + route.params.docNum.toString() + ')',
                        headerShown: true,
                        headerBackVisible: indexTab == 0 ? true : false,
                        headerRight: () =>
                            activarBuscadorArticulos !== true && iconoBuscarArticulos === true ?
                                <IconButton
                                    style={{}}
                                    icon="magnify"
                                    size={35}
                                    iconColor='gray'
                                    onPress={() => setActivarBuscadorArticulos(!activarBuscadorArticulos)}
                                /> : activarBuscadorArticulos !== false && iconoBuscarArticulos === true ?
                                    <IconButton
                                        style={{}}
                                        icon="close"
                                        size={35}
                                        iconColor='gray'
                                        onPress={() => setActivarBuscadorArticulos(!activarBuscadorArticulos)}
                                    /> : <View></View>
                    })} />
                <Stack.Screen name="ItemsTransferencia" component={ItemsTransferencia} options={{ headerShown: true, title: 'Items Transferencia', }} />
                <Stack.Screen name="ListadoItemsTransfer" component={ListadoItemsTransfer} options={{ headerShown: true, title: 'Articulo transferencia', }} />
                <Stack.Screen name="ListadoSeriesLotes" component={ListadoSeriesLotes} options={{ headerShown: true, title: 'Listado Series/Lotes', }} />
                <Stack.Screen name="TransferenciaSerieLote" component={TransferenciaSerieLote} options={{ headerShown: true, title: 'Captura de serie y lotes', }} />
                <Stack.Screen name="DetalleInventario" component={DetalleInventario} options={{ headerShown: true, title: 'Detalle Inventario', }} />
                <Stack.Screen name="DetalleInventarioSL" component={DetalleInventarioSL} options={{ headerShown: true, title: 'Detalle Inventario Series/Lotes', }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};