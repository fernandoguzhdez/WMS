import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    Text,
    Alert,
    StyleSheet,
    View,
    ScrollView,
    useWindowDimensions
} from 'react-native';
import { AuthContext } from '../../../contex/AuthContext';
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import { Input, Card } from '@rneui/themed';
import { Button, SearchBar } from 'react-native-elements'
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from "react-native-modal";

export function SeriesLotes() {

    const [swipe, setSwipe] = useState(-195);
    const navigation = useNavigation();
    const { filtrarSerie, searchSerie, articulo, setArticulo, serialsLotes, setSerialsLotes, contadorSerie, url, tokenInfo, setArraySeries, verificarEscaneoSerie,
        textSerie, setTextSerie, setModuloScan, lote, setLote, verificarLote, guardarConteoLote, lotes, setLotes, setCantidadSerieLote, cantidadSerieLote,
        contadorClic, setContadorClic, isLoading, setIsLoading, setIsModalInvSeriesLotes, isModalInvSeriesLotes, FilterInventarioSeriesLotes } = useContext(AuthContext);
    const { docEntry, lineNum, itemCode, barCode, itemDesc, gestionItem, whsCode, totalQty, countQty, counted, binEntry, binCode } = articulo;
    const { idCode, sysNumber, quantityCounted } = lote;
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([10, 20, 30, 40, 50]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, serialsLotes.length || lotes.length);
    const windowsWidth = useWindowDimensions().width;
    const [cantidad, setCantidad] = useState('1');
    const [enableButton, setEnableButton] = useState(false);

    const limpiarVariables = () => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            setLotes([])
            setArticulo([])
            setSerialsLotes([])
            setLote([])
            console.log('Limpiando al salir')
        });
        return unsubscribe;
    }

    useEffect(() => {
        limpiarVariables()
    }, []);


    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);


    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: '#fff' }}>
            <SearchBar
                platform="default"
                onChangeText={(text) => {
                    FilterInventarioSeriesLotes(text);
                    text == '' ? setTextSerie(null) : setTextSerie(text.toLocaleUpperCase())
                }}
                onClearText={(text) => {
                    FilterInventarioSeriesLotes(text)
                }}
                placeholder="Buscar aqui..."
                placeholderTextColor="#888"
                cancelButtonTitle="Cancel"
                cancelButtonProps={{}}
                onCancel={() => console.log('cancelando...')}
                value={textSerie}
                //onSubmitEditing={handleSubmit}
                inputStyle={{ backgroundColor: '#f4f4f4', borderRadius: 10, color: '#000' }}
                containerStyle={{ backgroundColor: '#f4f4f4', borderRadius: 50, margin: 20, padding: 0, borderColor: '#f4f4f4' }}
                theme
            />
            {/* <Input
                            leftIcon={
                                <Icon
                                    name='barcode'
                                    size={30}
                                    type='font-awesome'
                                    onPress={() => { navigation.navigate('Scanner', articulo); gestionItem == 'S' ? setModuloScan(2) : setModuloScan(3) }} />}
                            rightIcon={
                                <Icon
                                    name='search'
                                    size={25}
                                    type='font-awesome'
                                    iconStyle={{ marginRight: 20 }}
                                    disabled={contadorClic}
                                    onPress={() => {
                                        setContadorClic(true)
                                        setIsLoading(true)
                                        gestionItem == 'S' ?
                                            verificarEscaneoSerie(docEntry, lineNum, itemCode, gestionItem, textSerie, whsCode, binEntry, binCode, barCode, itemDesc, totalQty, countQty) :
                                            verificarLote(textSerie, 'manual', itemCode, gestionItem, whsCode, binEntry)
                                    }} />
                            }
                            placeholder={gestionItem == 'S' ? 'Ingresa o escanea la serie...' : 'Ingresa o escanea el lote...'}
                            value={textSerie}
                            style={{ paddingHorizontal: 15, fontSize: 22, color: '#000' }}
                            containerStyle={{ flex: 1 }}
                            onChangeText={(text) => {
                                setTextSerie(text)
                                text == '' ? setTextSerie(null) : setTextSerie(text.toLocaleUpperCase())
                            }}
                        /> */}
            {/* <Button
                            buttonStyle={{ backgroundColor: 'green' }}
                            onPress={() => guardarConteo()}
                            icon={
                                <Icon
                                    name="save"
                                    type='material-icons'
                                    size={30}
                                    color="white"
                                    iconStyle={{ paddingHorizontal: 10 }}
                                />
                            }
                            title="Enviar Conteo"
                        /> */}

            <ScrollView>
                <DataTable>
                    <DataTable.Header style={{ backgroundColor: '#00913f' }}>
                        <DataTable.Title textStyle={styles.titleTable}>{gestionItem == 'S' ? 'Serie' : 'Lote'}</DataTable.Title>
                        <DataTable.Title textStyle={styles.titleTable}>Almacen</DataTable.Title>
                        <DataTable.Title textStyle={styles.titleTable}>Ubicacion</DataTable.Title>
                        <DataTable.Title textStyle={styles.titleTable}>Cantidad</DataTable.Title>
                    </DataTable.Header>
                    {serialsLotes.slice(from, to).map((item) => (
                        <DataTable.Row key={item.idCode}>
                            <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.idCode}</DataTable.Cell>
                            <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.whsCode}</DataTable.Cell>
                            <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.binEntry}</DataTable.Cell>
                            <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.quantityCounted}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(serialsLotes.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${serialsLotes.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
            </ScrollView>

            <Modal isVisible={isModalInvSeriesLotes} style={{}} animationInTiming={1000} >
                <ScrollView style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: windowsWidth > 500 ? 30 : 15 }}>
                    <Text style={{ fontSize: 26, textAlign: 'center', margin: 20 }}>Conteo Lotes</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.contentIdCode}>
                            <Text style={styles.titleIdCode}>Id_Code:</Text> {idCode}
                        </Text>
                        <Text style={styles.contentIdCode}>
                            <Text style={styles.titleIdCode}>Almacen:</Text> {whsCode}
                        </Text>
                        <Text style={styles.contentIdCode}>
                            <Text style={styles.titleIdCode}>Ubicacion:</Text> {binEntry}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 50, width: '100%', justifyContent: 'center' }}>
                        <Icon
                            raised
                            name='remove'
                            size={18}
                            iconStyle={{ fontWeight: 'bold' }}
                            type='material-icons'
                            onPress={() => {
                                if (cantidadSerieLote <= 0) {
                                    setCantidadSerieLote('0')
                                } else {
                                    setCantidadSerieLote(parseInt(cantidadSerieLote) - 1)
                                }
                            }} />
                        <Input
                            value={cantidadSerieLote.toString()}
                            onChangeText={text => {
                                const nuevaCadena = text.replace(/[^0-9.]/g, '');
                                // Verificar si hay más de un punto decimal
                                if ((nuevaCadena.match(/\./g) || []).length > 1) {
                                    return;
                                }
                                setCantidadSerieLote(nuevaCadena)
                            }}
                            style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center', borderWidth: 1, borderColor: '#3b5998', borderCurve: 'circular', color: '#000' }}
                            keyboardType='numeric'
                            containerStyle={{ flex: .5 }}
                        />
                        <Icon
                            raised
                            name='add'
                            size={18}
                            type='material-icons'
                            onPress={() => {
                                if (cantidadSerieLote === '' || cantidadSerieLote < 0) {
                                    setCantidadSerieLote('0')
                                } else {
                                    setCantidadSerieLote(parseInt(cantidadSerieLote) + 1)
                                }

                            }} />
                    </View>

                    <View style={{ width: '50%', rowGap: 20, alignSelf: 'center', marginTop: 30 }}>
                        <Button
                            title="Guardar Conteo"
                            onPress={() => {
                                //guardarConteoArticulo(cantidad, articulo.docEntry)
                                guardarConteoLote(cantidadSerieLote, idCode, sysNumber);
                                setCantidadSerieLote('0');
                                setIsLoading(true)
                                setIsModalInvSeriesLotes(!isModalInvSeriesLotes)
                            }}
                            disabled={cantidadSerieLote > 0 ? false : true}
                        />
                        <Button
                            title="Cancelar"
                            onPress={() => { setIsModalInvSeriesLotes(!isModalInvSeriesLotes); setCantidadSerieLote('1') }}
                            buttonStyle={{ backgroundColor: '#F80000' }}
                            disabled={enableButton}
                        />
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    titleTable: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'roboto',
    },
    titleIdCode: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 26,
    },
    contentIdCode: {
        color: '#000',
        fontSize: 24,
        padding: 10
    }
});
