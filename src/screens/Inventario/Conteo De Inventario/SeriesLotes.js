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
import { Button } from 'react-native-elements'
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

export function SeriesLotes() {

    const [swipe, setSwipe] = useState(-195);
    const navigation = useNavigation();
    const { filtrarSerie, searchSerie, articulo, serialsLotes, setSerialsLotes, contadorSerie, url, tokenInfo, setArraySeries, verificarEscaneoSerie, textSerie, setTextSerie, setModuloScan, lote, verificarLote, guardarConteoLote, lotes, setLotes, setCantidadSerieLote, cantidadSerieLote, contadorClic, setContadorClic, isLoading, setIsLoading } = useContext(AuthContext);
    const { docEntry, lineNum, itemCode, barCode, itemDesc, gestionItem, whsCode, totalQty, countQty, counted, binEntry, binCode } = articulo;
    const { idCode, sysNumber, quantityCounted } = lote;
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([10, 20, 30, 40, 50]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, serialsLotes.length || lotes.length);
    const windowsWidth = useWindowDimensions().width;


    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);


    return (
        <View>
            <ScrollView>
                <View>
                    <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                        <Input
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
                                            verificarEscaneoSerie(docEntry, lineNum, itemCode, gestionItem, textSerie) :
                                            verificarLote(textSerie, 'manual')
                                    }} />
                            }
                            placeholder={gestionItem == 'S' ? 'Ingresa o escanea la serie...' : 'Ingresa o escanea el lote...'}
                            value={textSerie}
                            style={{ paddingHorizontal: 15, fontSize: 22 }}
                            containerStyle={{ flex: 1 }}
                            onChangeText={(text) => setTextSerie(text)}
                        />
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
                    </View>

                    {gestionItem == 'L' ?
                        <View style={{ flex: 1, flexDirection: 'col' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 5, padding: 10 }}>
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
                                        style={{ fontWeight: 'bold', fontSize: 25 }}
                                        keyboardType='numeric'
                                    />
                                </View>
                                <View style={{ flex: 1, padding: 10 }}>
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
                                    <Icon
                                        raised
                                        name='remove'
                                        size={18}
                                        type='material-icons'
                                        onPress={() => {
                                            if (cantidadSerieLote <= 0) {
                                                setCantidadSerieLote('0')
                                            } else {
                                                setCantidadSerieLote(parseInt(cantidadSerieLote) - 1)
                                            }
                                        }} />
                                </View>
                            </View>
                            {lote.length != 0 ?
                                <View style={{ marginBottom: 30, marginHorizontal: 30 }}>
                                    <Card>
                                        <Card.Title style={{ fontSize: 24 }}>Lote Encontrado</Card.Title>
                                        <Card.Divider />
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start', alignSelf: 'center' }}>
                                            <Text style={{ fontSize: 22 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Id_Code:</Text> {idCode}
                                            </Text>
                                            <Text style={{ fontSize: 22 }}>
                                                <Text style={{ fontWeight: 'bold' }}>sysNumber:</Text> {sysNumber}
                                            </Text>
                                            <Text style={{ fontSize: 22 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Almacen:</Text> {whsCode}
                                            </Text>
                                            <Text style={{ fontSize: 22 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Ubicacion:</Text> {binEntry}
                                            </Text>
                                        </View>
                                        {/* <View style={{ alignItems: 'center', marginTop: 30 }}>
                                            <Text style={{ fontSize: 30 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Qty.</Text> {lotes.quantityCounted || 0} Pz.
                                            </Text>
                                        </View> */}
                                    </Card>
                                    <Button
                                        buttonStyle={{ backgroundColor: '#00913f', marginTop: 30 }}
                                        onPress={() => { guardarConteoLote(cantidadSerieLote, textSerie, sysNumber); setCantidadSerieLote('0'); setIsLoading(true) }}
                                        icon={
                                            <Icon
                                                name="save"
                                                type='material-icons'
                                                size={30}
                                                color="#ffff"
                                                iconStyle={{ paddingHorizontal: 10 }}
                                            />
                                        }
                                        title="Guardar Conteo"
                                    />
                                </View> : ''
                            }
                        </View>
                        : ''
                    }
                </View>

                {gestionItem == 'S' ?
                    <DataTable>
                        <DataTable.Header style={{ backgroundColor: '#00913f' }}>
                            <DataTable.Title textStyle={styles.titleTable}>Serie/Lote</DataTable.Title>
                            <DataTable.Title textStyle={styles.titleTable}>Almacen</DataTable.Title>
                            <DataTable.Title textStyle={styles.titleTable}>Ubicacion</DataTable.Title>
                            <DataTable.Title textStyle={styles.titleTable}>CantidadSerieLote</DataTable.Title>
                        </DataTable.Header>
                        {serialsLotes.slice(from, to).map((item) => (
                            <DataTable.Row key={item.idCode}>
                                <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.idCode}</DataTable.Cell>
                                <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.whsCode}</DataTable.Cell>
                                <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.binCode}</DataTable.Cell>
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
                    </DataTable> :
                    <DataTable>
                        <DataTable.Header style={{ backgroundColor: '#00913f' }}>
                            <DataTable.Title textStyle={styles.titleTable}>Lote</DataTable.Title>
                            <DataTable.Title textStyle={styles.titleTable}>Almacen</DataTable.Title>
                            <DataTable.Title textStyle={styles.titleTable}>Ubicacion</DataTable.Title>
                            <DataTable.Title textStyle={styles.titleTable}>CantidadSerieLote</DataTable.Title>
                        </DataTable.Header>
                        {lotes.slice(from, to).map((item) => (
                            <DataTable.Row key={item.idCode}>
                                <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.idCode}</DataTable.Cell>
                                <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.whsCode}</DataTable.Cell>
                                <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.binCode}</DataTable.Cell>
                                <DataTable.Cell textStyle={{ fontSize: windowsWidth > 500 ? 28 : 18, color: '#000' }}>{item.quantityCounted}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(lotes.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${lotes.length}`}
                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </DataTable>
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    titleTable: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'roboto',
    }
});
