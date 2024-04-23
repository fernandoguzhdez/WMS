import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../../../contex/AuthContext';
import axios from 'axios';
import { View, StyleSheet, Text, Alert, useWindowDimensions, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Card, lightColors } from '@rneui/themed';
import { Button, SearchBar, Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import Spinner from 'react-native-loading-spinner-overlay';

export function ArticulosProduccion({ navigation, route }) {

    const { url, tokenInfo, isLoading, tablaArtProd, dataArtProd, filterDataArtProd, valueArtProd, setValueArtProd, filterArtProd } = useContext(AuthContext);
    const [cantidad, setCantidad] = useState('1');
    const windowsWidth = useWindowDimensions().width;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalSeriesLotes, setIsModalSeriesLotes] = useState(false);
    const [selectedAlmacenOri, setSelectedAlmacenOri] = useState();
    const [selectedUbicacionOri, setSelectedUbicacionOri] = useState();
    const [selectedAlmacenDes, setSelectedAlmacenDes] = useState();
    const [selectedUbicacionDes, setSelectedUbicacionDes] = useState();
    const [ubicacionOri, setUbicacionOri] = useState();
    const [ubicacionDes, setUbicacionDes] = useState();
    const [enableButton, setEnableButton] = useState(false);
    const [searchItemsTraslados, setSearchItemsTraslados] = useState(null)
    const [itemTrasladoSeleccionado, setItemTrasladoSeleccionado] = useState([])


    useEffect(() => {
        tablaArtProd(route.params.docEntry)
    }, []);

    const handleSubmit = () => {
    }

    // Componente de tarjeta reutilizable
    const Card = ({ item, btnTitle, metodo, icono }) => (
        <View style={{ ...styles.card, width: windowsWidth > 500 ? 350 : 300 }}>
            <View style={styles.header}>
                <Text style={styles.title}>{item.itemCode}</Text>
            </View>
            <View style={styles.ContainerContent}>
                <Text style={styles.content}>{item.itemDesc}</Text>
                {/* <Text style={styles.content}>{gestionItem == 'I' ? 'Articulo' : gestionItem == 'S' ? 'Serie' : 'Lote'}</Text> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ flexDirection: 'col' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 28, color: '#9b9b9b', fontWeight: 'bold' }}>Almacen</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Text style={styles.content}>{item.whsCode}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'col' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 28, color: '#9b9b9b', fontWeight: 'bold' }}>Ubicacion</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Text style={styles.content}>{item.binEntry}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 28, color: '#9b9b9b', fontWeight: 'bold' }}>Contados</Text>
                        <Text style={styles.content}>{item.countQty}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 28, color: '#9b9b9b', fontWeight: 'bold' }}>Total</Text>
                        <Text style={styles.content}>{item.totalQty}</Text>
                    </View>
                </View>
            </View>
            <View style={{ margin: 20 }}>
                <Button
                    buttonStyle={{ backgroundColor: '#3b5958', width: '100%' }}
                    titleStyle={{ fontSize: windowsWidth > 500 ? 20 : 16, padding: 10, color: '#fff' }}
                    containerStyle={{ alignItems: 'center' }}
                    onPress={metodo}
                    icon={
                        <Icon
                            name={icono}
                            type='font-awesome'
                            size={25}
                            color="#fff"
                            iconStyle={{ paddingHorizontal: 10 }}
                        />
                    }
                    title={btnTitle}
                />
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', height: 'auto', overflow: 'hidden' }}>
            <Spinner visible={isLoading} size={60} color='#ffff' />
            <SearchBar
                platform="default"
                onChangeText={(text) => {
                    filterArtProd(text); text == '' ? setValueArtProd(null) : setValueArtProd(text.toLocaleUpperCase())
                }}
                onClearText={(text) => {
                    filterArtProd(text)
                }}
                placeholder="Buscar aqui..."
                placeholderTextColor="#888"
                cancelButtonTitle="Cancel"
                cancelButtonProps={{}}
                onCancel={() => console.log('cancelando...')}
                value={valueArtProd}
                //onSubmitEditing={handleSubmit}
                inputStyle={{ backgroundColor: '#f4f4f4', borderRadius: 10, color: '#000' }}
                containerStyle={{ backgroundColor: '#f4f4f4', borderRadius: 50, margin: 20, padding: 0, borderColor: '#f4f4f4' }}
                theme
            />
            <FlatList
                data={filterDataArtProd}
                renderItem={({ item }) =>
                    <Card
                        item={item}
                        btnTitle={item.gestionItem == 'I' ? 'Seleccionar Articulo' : item.gestionItem == 'L' ? 'Ver Lotes' : 'Ver Series'}
                        icono={item.gestionItem == 'I' ? 'exchange' : 'eye'}
                        metodo={item.gestionItem == 'I' ? () => {
                        } : () => {
                            navigation.navigate('SeriesLotesProduccion', item)
                            console.log(item)
                        }}
                    />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={windowsWidth > 500 ? 2 : 1}
                contentContainerStyle={styles.flatListContent}
            />

            {/* <Modal isVisible={isModalVisible} style={{}} animationInTiming={1000} >
                <ScrollView style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: windowsWidth > 500 ? 30 : 15 }}>
                    <Text style={{ fontSize: 26, textAlign: 'center', margin: 20 }}>Confirmar ubicacion y cantidad</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.content}>
                            {itemTraslado.itemCode}
                        </Text>
                    </View>

                    <View style={windowsWidth > 500 ? { flexDirection: 'row', margin: 30, columnGap: 30 } : { flexDirection: 'col' }}>
                        <View style={windowsWidth > 500 ? { flexDirection: 'column', flex: 6 } : { flexDirection: 'column' }}>
                            {ubicacionOri == undefined || ubicacionOri.length == 0 ?
                                <Text style={styles.content}>Sin ubicacion de origen</Text> :
                                <SelectList
                                    setSelected={(val) => setSelectedUbicacionOri(val)}
                                    data={ubicacionOri}
                                    save="key"
                                    inputStyles={{ fontSize: 18, color: '#000' }}
                                    boxStyles={{ width: '100%' }}
                                    onSelect={() => console.log(selectedAlmacenOri, selectedUbicacionOri)}
                                    placeholder='Ubicacion origen'
                                    searchPlaceholder='buscar...'
                                    dropdownTextStyles={{ color: '#808080' }}
                                />
                            }
                        </View>
                        <Icon
                            name={windowsWidth > 500 ? "arrow-right" : 'arrow-down'}
                            type='font-awesome'
                            size={windowsWidth > 500 ? 25 : 16}
                            color="#000"
                            iconStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
                            containerStyle={{ justifyContent: 'center' }}
                        />
                        <View style={windowsWidth > 500 ? { flexDirection: 'column', flex: 6 } : { flexDirection: 'column' }}>
                            {ubicacionDes == undefined || ubicacionDes.length == 0 ?
                                <Text style={styles.content}>Sin ubicacion de destino</Text> :
                                <SelectList
                                    setSelected={(val) => setSelectedUbicacionDes(val)}
                                    data={ubicacionDes}
                                    save="key"
                                    inputStyles={{ fontSize: 18, color: '#000' }}
                                    boxStyles={{ width: '100%' }}
                                    onSelect={() => console.log(selectedAlmacenDes, selectedUbicacionDes)}
                                    placeholder='Ubicacion destino'
                                    searchPlaceholder='buscar...'
                                    dropdownTextStyles={{ color: '#808080' }}
                                />
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, width: '100%', justifyContent: 'center' }}>
                        <Icon
                            raised
                            name='remove'
                            size={18}
                            iconStyle={{ fontWeight: 'bold' }}
                            type='material-icons'
                            onPress={() => {
                                if (cantidad <= 0) {
                                    setCantidad('0')
                                } else {
                                    setCantidad(parseInt(cantidad) - 1)
                                }
                            }} />
                        <Input
                            value={cantidad.toString()}
                            onChangeText={text => {
                                const nuevaCadena = text.replace(/[^0-9.]/g, '');
                                // Verificar si hay más de un punto decimal
                                if ((nuevaCadena.match(/\./g) || []).length > 1) {
                                    return;
                                }
                                setCantidad(nuevaCadena)
                            }}
                            style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center', borderWidth: 1, borderColor: '#3b5998', borderCurve: 'circular' }}
                            keyboardType='numeric'
                            containerStyle={{ flex: .5 }}
                        />
                        <Icon
                            raised
                            name='add'
                            size={18}
                            type='material-icons'
                            onPress={() => {
                                if (cantidad === '' || cantidad < 0) {
                                    setCantidad('0')
                                } else {
                                    setCantidad(parseInt(cantidad) + 1)
                                }

                            }} />
                    </View>

                    <View style={{ width: '50%', rowGap: 20, alignSelf: 'center', marginTop: 30 }}>
                        <Button
                            title="Confirmar y enviar"
                            onPress={() => {
                                let suma = Number(cantidad) + Number(countQty);
                                console.log(cantidad + ' : ' + countQty + ' : ' + pendiente)
                                setEnableButton(true)
                                if (suma <= pendiente) {
                                    transferirItem();
                                    setBarcodeItemTraslados(null)
                                    setItemsTraslados(tablaItemsTraslados)
                                    setEnableButton(false)
                                    setCantidad('1')
                                } else {
                                    console.log('Suma...', cantidad + ' : ' + Number(countQty))
                                    Alert.alert('Advertencia', '¡La cantidad sobrepasa el total de articulos a transferir!', [
                                        { text: 'OK', onPress: () => setEnableButton(false) },
                                    ]);
                                }
                            }}
                            disabled={cantidad > 0 ? false : true}
                        />
                        <Button
                            title="Cancelar"
                            onPress={() => { setIsModalVisible(!isModalVisible); setItemTrasladoSeleccionado([]); setCantidad('1') }}
                            buttonStyle={{ backgroundColor: '#F80000' }}
                            disabled={enableButton}
                        />
                    </View>
                </ScrollView>
            </Modal> */}

            <TouchableOpacity
                style={styles.floatingButtonPrint}
                onPress={() => {
                }}
            >
                <Icon name="barcode" size={24} color="#FFF" type='font-awesome' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    card: {
        height: 'auto',
        margin: '3.5%', // Ajusta el margen entre las tarjetas
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
        justifyContent: 'space-between'
    },
    header: {
        backgroundColor: '#3b5998',
        marginHorizontal: 20,
        padding: 20,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        bottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 15,
    },
    ContainerContent: {
        padding: 5,
        gap: 15
    },
    content: {
        fontSize: 28,
        color: '#9b9b9b'
    },
    title: {
        color: '#fff',
        fontSize: 26,
        textAlign: 'center'
    },
    flatListContent: {
        alignItems: 'center',
    },
    floatingButtonPrint: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 32,
        bottom: 32,
        backgroundColor: '#800000', // Change the color as needed
        borderRadius: 28,
        elevation: 8, // Android shadow
    }
});