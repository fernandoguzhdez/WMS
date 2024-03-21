import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    ScrollView,
    useWindowDimensions,
    View,
    Text
} from 'react-native';
import { AuthContext } from '../../../contex/AuthContext';
import { DarkTheme, useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';

export function Articulos() {



    const { isLoading, filteredDataSourceArticulos, searchFilterFunctionArticulos, searchArticulos, activarBuscadorArticulos } = useContext(AuthContext);
    const [swipe, setSwipe] = useState(-195);
    const navigation = useNavigation();
    const windowsWidth = useWindowDimensions().width;
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([50, 100, 150, 200]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredDataSourceArticulos.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        // Flat List Item
        <ScrollView>
            <DataTable>
                <DataTable.Header style={{ backgroundColor: '#00913f' }}>
                    <DataTable.Title textStyle={styles.cellTitle} style={{maxWidth: 50, justifyContent: 'flex-start', alignItems: 'center'}}>N°</DataTable.Title>
                    <DataTable.Title textStyle={styles.cellTitle} style={{maxWidth: 120, justifyContent: 'flex-start', alignItems: 'center'}}>Codigo</DataTable.Title>
                    <DataTable.Title textStyle={styles.cellTitle} style={styles.cellContent}>Descripcion</DataTable.Title>
                    <DataTable.Title textStyle={styles.cellTitle} style={[styles.cellContent, styles.numericCell]}>Almacen</DataTable.Title>
                    <DataTable.Title textStyle={styles.cellTitle} style={[styles.cellContent, styles.numericCell]}>Ubicacion</DataTable.Title>
                </DataTable.Header>

                {filteredDataSourceArticulos.slice(from, to).map((item) => (
                    <DataTable.Row key={item.lineNum}>
                        <DataTable.Cell textStyle={{fontSize: 22, flex: 1, flexWrap: 'wrap', minHeight: 60}} style={{maxWidth: 50, justifyContent: 'flex-start', alignItems: 'center'}}><View><Text style={styles.cellContent}>{item.docEntry}</Text></View></DataTable.Cell>
                        <DataTable.Cell textStyle={{fontSize: 22, flex: 1, flexWrap: 'wrap', minHeight: 60}} style={{maxWidth: 120, justifyContent: 'flex-start', alignItems: 'center'}}><View><Text style={styles.cellContent}>{item.barCode}</Text></View></DataTable.Cell>
                        <DataTable.Cell textStyle={{fontSize: 22, flex: 1, flexWrap: 'wrap', minHeight: 60}} style={styles.cellContent}><View><Text style={styles.cellContent}>{item.itemDesc}</Text></View></DataTable.Cell>
                        <DataTable.Cell textStyle={{fontSize: 22, flex: 1, flexWrap: 'wrap', minHeight: 60}} style={[styles.cellContent, styles.numericCell]}><View><Text style={styles.cellContent}>{item.whsCode}</Text></View></DataTable.Cell>
                        <DataTable.Cell textStyle={{fontSize: 22, flex: 1, flexWrap: 'wrap', minHeight: 60}} style={[styles.cellContent, styles.numericCell]}><View><Text style={styles.cellContent}>{item.binEntry}</Text></View></DataTable.Cell>
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(filteredDataSourceArticulos.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${filteredDataSourceArticulos.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    titleTable: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'roboto',
    },
    title: {
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    cellContent: {
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        margin: 5,
        fontSize: 22,
        color: '#000',
        minHeight: 60
    },
    cellTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },
    numericTitle: {
        maxWidth: 50,
    },
    numericCell: {
        maxWidth: 100,
        justifyContent: 'flex-start',
    }
});
