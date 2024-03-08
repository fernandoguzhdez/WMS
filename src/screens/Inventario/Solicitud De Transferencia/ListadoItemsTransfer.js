import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../../../contex/AuthContext';
import axios from 'axios';
import { View, StyleSheet, Text, Alert, useWindowDimensions, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Card, lightColors } from '@rneui/themed';
import { Button, SearchBar, Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import Spinner from 'react-native-loading-spinner-overlay';

export const ListadoItemsTransfer = ({ navigation, route }) => {

    const { url, tokenInfo, setModuloScan, setIsLoading, isLoading, FiltrarItemsTraslados, barcodeItemTraslados, setBarcodeItemTraslados, setItemsTraslados, itemsTraslados, setItemTraslado,
        itemTraslado, getAlmacenes, almacenes, getItemsTraslados, setSerieLoteTransfer, serieLoteTransfer, ubicacionOrigen, splitCadenaEscaner, idCodeSL, setIdCodeSL, ComprobarSerieLoteTransfer,
        tablaItemsTraslados, cargarSeriesLotesDisp } = useContext(AuthContext);
    const { docEntry, lineNum, itemCode, barCode, itemDesc, gestionItem, fromWhsCode, fromBinCode, fromBinEntry, toWhsCode, totalQty, countQty, counted, toBinEntry, binCode } = itemTraslado
    const [cantidad, setCantidad] = useState('1');
    const windowsWidth = useWindowDimensions().width;
    const windowsHeight = useWindowDimensions().height;
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
        getAlmacenes()
        getItemsTraslados(route.params.docEntry)
        setItemTraslado([])
        setIdCodeSL([])
        setBarcodeItemTraslados(null)
    }, []);

    const obtenerUbicacionOri = (fromWhsCode) => {
        almacenes.map((item) => {
            if (item.key == fromWhsCode) {
                if (item.ubicacion == null) {
                    setUbicacionOri([])
                } else {
                    let arrayUbicacion = item.ubicacion.map((item) => {
                        return { key: item.absEntry, value: item.sL1Code }
                    })
                    setUbicacionOri(arrayUbicacion)
                }
            }
        })
    }

    const obtenerUbicacionDes = (toWhsCode) => {
        almacenes.map((item) => {
            if (item.key == toWhsCode) {
                if (item.ubicacion == null) {
                    setUbicacionDes([])
                } else {
                    let arrayUbicacion = item.ubicacion.map((item) => {
                        return { key: item.absEntry, value: item.sL1Code }
                    })
                    setUbicacionDes(arrayUbicacion)
                }
            }
        })
    }

    const ubicacionDestino = (fromWhsCode, toWhsCode) => {
        setIsModalVisible(!isModalVisible);
        obtenerUbicacionOri(fromWhsCode);
        obtenerUbicacionDes(toWhsCode);
    };

    const transferirItem = () => {
        setIsLoading(true);
        // Set headers
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        axios
            .put(`${url}/api/SolTransferStock/Update`, {
                "docEntry": docEntry,
                "items": [
                    {
                        "docEntry": docEntry,
                        "lineNum": lineNum,
                        "itemCode": itemCode,
                        "barCode": barCode,
                        "itemDesc": itemDesc,
                        "gestionItem": gestionItem,
                        "fromWhsCode": fromWhsCode,
                        "fromBinEntry": selectedUbicacionOri,
                        "fromBinCode": fromBinCode,
                        "toWhsCode": toWhsCode,
                        "toBinEntry": selectedUbicacionDes,
                        "toBinCode": "PENDIENTE",
                        "inWhsQty": 0,
                        "quantityCounted": cantidad,
                        "serialandManbach": []
                    }
                ]
            }, { headers })
            .then((response) => {
                setIsLoading(false);
                Alert.alert('Info', '¡Transferencia realizada con exito!', [
                    { text: 'OK', onPress: () => { getItemsTraslados(docEntry); setIsModalVisible(!isModalVisible); } },
                ]);
            })
            .catch(error => {
                setIsLoading(false);
                if (error.response) {
                    console.log(error.response.status);
                }
                else if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log(error.message);
                }
            });

    }

    const handleSubmit = () => {
        //setIsLoading(true)
        splitCadenaEscaner(barcodeItemTraslados, route.params.docEntry, 'EnterSolicitudTransferencia')
        setItemsTraslados(tablaItemsTraslados)
    }

    useEffect(() => {
        if (idCodeSL.length > 4) {
            console.log('partes...', idCodeSL)
            navigation.navigate('TransferenciaSerieLote', 'sinEscaner')
            ComprobarSerieLoteTransfer(idCodeSL[4], idCodeSL[0], idCodeSL[2], idCodeSL[3], idCodeSL[1], 'Enter')
        }

    }, [idCodeSL])

    const searchFilterItemsTraslados = (text) => {
        // Check if searched text is not blank
        if (text) {
            setItemsTraslados(
                itemsTraslados.filter((item) =>
                    item.itemCode.toUpperCase().includes(text.toUpperCase()) ||
                    item.itemDesc.toUpperCase().includes(text.toUpperCase()) ||
                    item.fromWhsCode.toUpperCase().includes(text.toUpperCase())
                )
            );
            setSearchItemsTraslados(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with tablaSolicitudTransfer
            setItemsTraslados(tablaItemsTraslados);
            setSearchItemsTraslados(text);
        }
    };

    // Componente de tarjeta reutilizable
    const Card = ({ item, btnTitle }) => (
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
                            <Text style={styles.content}>{item.fromWhsCode}</Text>
                            <Icon
                                name="arrow-right"
                                type='font-awesome'
                                size={windowsWidth > 500 ? 20 : 10}
                                color="#000"
                                iconStyle={{ paddingHorizontal: 10 }}
                                containerStyle={{ alignSelf: 'center' }}
                            />
                            <Text style={styles.content}>{item.toWhsCode}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'col' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 28, color: '#9b9b9b', fontWeight: 'bold' }}>Ubicacion</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Text style={styles.content}>{item.fromBinEntry}</Text>
                            <Icon
                                name="arrow-right"
                                type='font-awesome'
                                size={windowsWidth > 500 ? 20 : 10}
                                color="#000"
                                iconStyle={{ paddingHorizontal: 10 }}
                                containerStyle={{ alignSelf: 'center' }}
                            />
                            <Text style={styles.content}>{item.toBinEntry}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 28 }}>Contados</Text>
                        <Text style={styles.content}>{item.countQty}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 28 }}>Total</Text>
                        <Text style={styles.content}>{item.totalQty}</Text>
                    </View>
                </View>
            </View>
            {itemTrasladoSeleccionado.length != undefined ?
                <View style={{ margin: 20 }}>
                    {item.gestionItem == 'I' ?
                        <Button
                            buttonStyle={{ backgroundColor: '#3b5958', width: '100%' }}
                            titleStyle={{ fontSize: windowsWidth > 500 ? 20 : 16, padding: 10 }}
                            containerStyle={{ alignItems: 'center' }}
                            onPress={() => { ubicacionDestino(item.fromWhsCode, item.toWhsCode) }}
                            icon={
                                <Icon
                                    name="exchange"
                                    type='font-awesome'
                                    size={25}
                                    color="#fff"
                                    iconStyle={{ paddingHorizontal: 10 }}
                                />
                            }
                            title={btnTitle}
                        /> : item.gestionItem == 'S' ?
                            <Button
                                buttonStyle={{ backgroundColor: '#3b5958', width: '100%' }}
                                titleStyle={{ fontSize: windowsWidth > 500 ? 20 : 16, padding: 10 }}
                                containerStyle={{ alignItems: 'center' }}
                                onPress={() => {
                                    navigation.navigate('ListadoSeriesLotes', item)
                                    setIsModalSeriesLotes(!isModalSeriesLotes);
                                    cargarSeriesLotesDisp(item)
                                  
                                }}
                                icon={
                                    <Icon
                                        name="eye"
                                        type='font-awesome'
                                        size={windowsWidth > 500 ? 25 : 18}
                                        color="#fff"
                                        iconStyle={{ paddingHorizontal: 10 }}
                                    />
                                }
                                title="Ver Series"
                            /> :
                            <Button
                                buttonStyle={{ backgroundColor: '#3b5958', width: '80%' }}
                                titleStyle={{ fontSize: windowsWidth > 500 ? 20 : 16, padding: 10 }}
                                containerStyle={{ alignItems: 'center' }}
                                onPress={() => {
                                    navigation.navigate('ListadoSeriesLotes', item)
                                    setIsModalSeriesLotes(!isModalSeriesLotes);
                                    cargarSeriesLotesDisp(item)
                                  
                                }}
                                icon={
                                    <Icon
                                        name="eye"
                                        type='font-awesome'
                                        size={windowsWidth > 500 ? 25 : 18}
                                        color="#fff"
                                        iconStyle={{ paddingHorizontal: 10 }}
                                    />
                                }
                                title="Ver Lotes"
                            />
                    }
                </View> : ''
            }
        </View>
    );



    return (
        <View style={{ flex: 1, backgroundColor: '#fff', height: 'auto', overflow: 'hidden' }}>
            <Spinner visible={isLoading} size={60} color='#ffff' />
            <SearchBar
                platform="default"
                onChangeText={(text) => { searchFilterItemsTraslados(text); text == '' ? setBarcodeItemTraslados(null) : setBarcodeItemTraslados(text.toLocaleUpperCase()) }}
                onClearText={(text) => searchFilterItemsTraslados(text)}
                placeholder="Buscar aqui..."
                placeholderTextColor="#888"
                cancelButtonTitle="Cancel"
                cancelButtonProps={{}}
                onCancel={() => console.log('cancelando...')}
                value={barcodeItemTraslados}
                onSubmitEditing={handleSubmit}
                inputStyle={{ backgroundColor: '#f4f4f4', borderRadius: 10, }}
                containerStyle={{ backgroundColor: '#f4f4f4', borderRadius: 50, margin: 20, padding: 0, borderColor: '#f4f4f4' }}
                theme
            />
            <FlatList
                data={itemsTraslados}
                renderItem={({ item }) =>
                    <Card item={item} btnTitle={'Seleccionar Articulo'} />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={windowsWidth > 500 ? 2 : 1}
                contentContainerStyle={styles.flatListContent}
            />

            <Modal isVisible={isModalVisible} style={{}} animationInTiming={1000}>
                <ScrollView style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: windowsWidth > 500 ? 30 : 15, height: '100%' }}>
                    <Text style={{ fontSize: 26, textAlign: 'center', margin: 20 }}>Confirmar ubicacion y cantidad</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Card item={itemTraslado} btnTitle={'Transferir Articulo'} />
                    </View>

                    <View style={windowsWidth > 500 ? { flexDirection: 'row', margin: 30, columnGap: 30 } : { flexDirection: 'col' }}>
                        <View style={windowsWidth > 500 ? { flexDirection: 'column', flex: 6 } : { flexDirection: 'column' }}>
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
                                const nuevaCadena = text.replace(/[^0-9]/g, '');
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
                                let suma = cantidad + countQty;
                                setEnableButton(true)
                                if (suma <= totalQty) {
                                    transferirItem();
                                    setEnableButton(false)
                                } else {
                                    Alert.alert('Advertencia', '¡La cantidad sobrepasa el total de articulos a transferir!', [
                                        { text: 'OK', onPress: () => setEnableButton(false) },
                                    ]);
                                }
                            }}
                            disabled={cantidad > 0 ? false : true}
                        />
                        <Button
                            title="Cancelar"
                            onPress={() => { setIsModalVisible(!isModalVisible); setItemTrasladoSeleccionado([]) }}
                            buttonStyle={{ backgroundColor: '#F80000' }}
                            disabled={enableButton}
                        />
                    </View>
                </ScrollView>
            </Modal>

            <TouchableOpacity
                style={styles.floatingButtonPrint}
                onPress={() => {
                    setSerieLoteTransfer(null)
                    navigation.navigate('Scanner', route.params.docEntry);
                    setModuloScan(4)
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
        gap: 30
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