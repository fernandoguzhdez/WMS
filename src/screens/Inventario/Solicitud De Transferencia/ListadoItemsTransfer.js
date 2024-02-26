import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    Alert,
    ScrollView,
    useWindowDimensions
} from 'react-native';
import { AuthContext } from '../../../contex/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import moment from "moment";
import { Badge, SearchBar, Button } from 'react-native-elements'
import { SwipeListView } from 'react-native-swipe-list-view';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { Card, ListItem } from 'react-native-elements'

export function ListadoItemsTransfer({ navigation }) {

    const { itemsTraslados, filteredDataSource, searchFilterFunction, search, activarBuscadorConteoInv, setActivarBuscadorConteoInv, LimpiarPantallaConteoInventario, setActivarBuscadorArticulos, url, tokenInfo, getInventario, setIsLoadingCerrarConteo, isLoadingCerrarConteo, setIsLoading, isLoading } = useContext(AuthContext);
    const [swipe, setSwipe] = useState(-100);
    const [deshabilitarBoton, setDeshabilitarBoton] = useState(false);
    const windowsWidth = useWindowDimensions().width;
    const windowsHeight = useWindowDimensions().height;

    console.log('articulos en el listado..', itemsTraslados)

    return (
        // implemented without image with header
        <ScrollView style={{ backgroundColor: '#ffff' }}>
            < View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', margin: 10, justifyContent: 'center', height: 'auto' }}>
                {
                    itemsTraslados.map((item, i) => {
                        return (
                            <Card key={item.lineNum} containerStyle={{ backgroundColor: '#f5f8fa', borderRadius: 20, flexDirection: 'column', width: windowsWidth > 500 ? 410 : 350 }}>
                                <Card.Title style={{ fontSize: windowsWidth > 500 ? 24 : 18, color: '#3b5998', fontWeight: 'bold' }}>{item.barCode}</Card.Title>
                                <Card.Divider width={7} color='#3b5998' />
                                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                    <Text style={styles.textCardValue}>
                                        <Text style={styles.textTitleCard}>N° Documento:     </Text> {item.docEntry}
                                    </Text>
                                    <Text style={styles.textCardValue}>
                                        <Text style={styles.textTitleCard}>Codigo de barras:     </Text> {item.barCode}
                                    </Text>
                                    <Text style={styles.textCardValue}>
                                        <Text style={styles.textTitleCard}>Descripcion:     </Text> {item.itemDesc}
                                    </Text>
                                    <Text style={styles.textCardValue}>
                                        <Text style={styles.textTitleCard}>Gestion item:     </Text> {item.gestionItem == 'S' ? 'Serie' : item.gestionItem == 'L' ? 'Lote' : item.gestionItem == 'I' ? 'Articulo' : ''}
                                    </Text>
                                    <View style={{ borderWidth: 1, borderColor: 'lightgray', marginVertical: 20, backgroundColor: ' red' }}>
                                        <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ ...styles.textCardValue, marginHorizontal: 20 }}>
                                                <Text style={{ ...styles.textTitleCard }}>Alm. origen:     </Text> {item.fromWhsCode}
                                            </Text>
                                            <Icon
                                                name="arrow-right"
                                                type='font-awesome'
                                                size={14}
                                                color="#000"
                                            />
                                            <Text style={{ ...styles.textCardValue, marginHorizontal: 20 }}>
                                                <Text style={styles.textTitleCard}>Alm. destino:     </Text> {item.toWhsCode}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ ...styles.textCardValue, marginHorizontal: 20 }}>
                                                <Text style={styles.textTitleCard}>Ubi. origen:     </Text> {item.fromBinEntry}
                                            </Text>
                                            <Icon
                                                name="arrow-right"
                                                type='font-awesome'
                                                size={14}
                                                color="#000"
                                            />
                                            <Text style={{ ...styles.textCardValue, marginHorizontal: 20 }}>
                                                <Text style={styles.textTitleCard}>Ubi. destino:     </Text> {item.toBinEntry}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'center', margin: 10 }}>
                                    <Text style={{ fontSize: windowsWidth > 500 ? 26 : 18 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Cantidad contada</Text> {item.countQty} Pz.
                                    </Text>
                                    <Text style={{ fontSize: windowsWidth > 500 ? 26 : 18 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Cantidad total</Text> {item.totalQty} Pz.
                                    </Text>
                                </View>
                            </Card>


                        );
                    })
                }
            </View >
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    texto: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
        lineHeight: 35
    },
    textTitleCard: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        backgroundColor: '#f5f8fa'
    },
    textCardValue: {
        color: '#009F39',
        fontSize: 14,
        marginVertical: 10,
        fontFamily: 'Georgia',
        textDecorationColor: '#3b5998',
    }

});
