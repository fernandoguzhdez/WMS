import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    ScrollView
} from 'react-native';
import { AuthContext } from '../../../contex/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';

export function Articulos() {



    const { isLoading, filteredDataSourceArticulos, searchFilterFunctionArticulos, searchArticulos, activarBuscadorArticulos } = useContext(AuthContext);
    const [swipe, setSwipe] = useState(-195);
    const navigation = useNavigation();

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([50,100,150,200]);
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
                <DataTable.Header style={{ backgroundColor: 'green'}}>
                    <DataTable.Title textStyle={styles.titleTable}>N° Doc</DataTable.Title>
                    <DataTable.Title textStyle={styles.titleTable}>Codigo de barras</DataTable.Title>
                    <DataTable.Title textStyle={styles.titleTable}>Descripcion</DataTable.Title>
                    <DataTable.Title textStyle={styles.titleTable}>almacen</DataTable.Title>
                    <DataTable.Title textStyle={styles.titleTable}>Ubicacion</DataTable.Title>
                </DataTable.Header>

                {filteredDataSourceArticulos.slice(from, to).map((item) => (
                    <DataTable.Row key={item.lineNum}>
                        <DataTable.Cell>{item.docEntry}</DataTable.Cell>
                        <DataTable.Cell>{item.barCode}</DataTable.Cell>
                        <DataTable.Cell>{item.itemDesc}</DataTable.Cell>
                        <DataTable.Cell>{item.whsCode}</DataTable.Cell>
                        <DataTable.Cell>{item.binEntry}</DataTable.Cell>
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
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: 'roboto',
    }
});
