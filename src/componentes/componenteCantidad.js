import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contex/AuthContext';
import { View, StyleSheet, Alert, TextInput, Text } from 'react-native';
import { Input } from '@rneui/themed';
import { Icon, Button } from 'react-native-elements'
import { SelectList } from 'react-native-dropdown-select-list'

const ComponenteCantidad = ({ articulo, itemSeleccionado, tipo }) => {

    const { displayForm, setDisplayform, valueSLReciboProd, setValueSLReciboProd, EnviarDatosReciboProd, existeSLReciboProd, dataSLReciboProd,
        visibleFormCantidad, setVisibleFormCantidad, editarSLReciboProd, artSelectRecProd, setArtSelectRecProd, sumarCantidadRecProd, obtenerAlmacen,
        warehouses, setWarehouses, selectedWarehouse, setSelectedWarehouse, locations, setLocations, selectedLocation, setSelectedLocation, filtroDataSLReciboProd,
        selectedStatus, setSelectedStatus, locationData } = useContext(AuthContext);
    const [cantidad, setCantidad] = useState('1');
    const [idCodeEdit, setIdCodeEdit] = useState(null)
    const statusOptions = [
        { key: "Completar", value: "Completar" },
        { key: "Rechazar", value: "Rechazar" }
    ];
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        console.log('Almacen y ubicacion: ', itemSeleccionado.warehouse + ' y ' + itemSeleccionado.binEntry)
        setIdCodeEdit(itemSeleccionado.idCode)
        setValueSLReciboProd(null)
        obtenerAlmacen()
    }, [articulo])

    const handleWarehouseChange = (key) => {
        //console.log(key)
        setSelectedWarehouse(key);
        const selectedWhs = warehouses.find(wh => wh.key === key);
        if (selectedWhs && selectedWhs.bins) {
            const locationDatas = selectedWhs.bins.map(bin => ({
                key: bin.absEntry,
                value: bin.binCode
            }));
            console.log('LocationData...', locationDatas)
            setLocations(locationDatas);
        } else {
            setLocations([]);
        }
    };

    function verificarCantidad(cantidadContada, cantidadTotal, cantidadIngresada) {
        console.log('cantidadContada + cantidad = ', Number(cantidadContada) + Number(cantidad))
        return Number(cantidadContada) + Number(cantidadIngresada) > Number(cantidadTotal) ? true : false
    }

    return (
        <View style={{ flexDirection: 'col', width: '50%', alignSelf: 'center', margin: 10 }}>
            <View style={{ flexDirection: 'col' }}>
                <Icon
                    name='close'
                    size={26}
                    type='material-icons'
                    containerStyle={{ display: displayForm == false ? 'none' : 'flex', alignSelf: 'flex-end' }}
                    onPress={() => {
                        setDisplayform(!displayForm)
                    }} />
                <TextInput
                    style={{ ...styles.input, display: artSelectRecProd.gestionItem == 'I' ? 'none' : 'flex' }}
                    onChangeText={(text) => {
                        tipo == 'Edicion' ? setIdCodeEdit(text.toLocaleUpperCase()) : setValueSLReciboProd(text.toLocaleUpperCase())
                    }}
                    value={tipo == 'Edicion' ? idCodeEdit : valueSLReciboProd}
                    placeholder={tipo == 'Edicion' ? '' : "Asignar Nombre"}
                />
                <SelectList
                    data={statusOptions}
                    setSelected={setSelectedStatus}
                    placeholder="Selecciona una acción..."
                    search={false}
                    defaultOption={{ key: 0, value: "Completar" }}
                    boxStyles={styles.selectBox}
                />
                <SelectList
                    data={warehouses}
                    setSelected={handleWarehouseChange}
                    placeholder="Selecciona un almacén..."
                    search={false}
                    defaultOption={{ key: itemSeleccionado.warehouse, value: itemSeleccionado.warehouse }}
                    boxStyles={styles.selectBox}
                />
                {locations.length > 0 && (
                    <>
                        <SelectList
                            data={locations}
                            setSelected={setSelectedLocation}
                            placeholder="Selecciona una ubicación..."
                            search={false}
                            defaultOption={{ key: itemSeleccionado.binEntry, value: itemSeleccionado.binEntry }}
                            boxStyles={styles.selectBox}
                        />
                    </>
                )}
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', display: artSelectRecProd.gestionItem == 'S' ? 'none' : 'flex' }}>
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
            <Button
                title={artSelectRecProd.gestionItem == 'I' || tipo == 'Edicion' ? 'Guardar' : 'Agregar'}
                onPress={() => {
                    Alert.alert('Info', '¿Estas seguro de continuar?', [
                        {
                            text: 'Cancelar',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'Si', onPress: () => {
                                setValueSLReciboProd(null)
                                //setResetKey(prevKey => prevKey + 1);
                                switch (tipo) {
                                    case 'actualizarArticulo':
                                        console.log('Actualizar Item....',artSelectRecProd.countedQty + ' : ' + artSelectRecProd.plannedQty + ' : ' + cantidad)
                                        const cantidadMayor = verificarCantidad(artSelectRecProd.countedQty, artSelectRecProd.plannedQty, cantidad)
                                        if (cantidadMayor == true) {
                                            Alert.alert('Advertencia', '¡La cantidad ingresada excede el limite total!', [
                                                {
                                                    text: 'OK', onPress: () => { }
                                                },
                                            ]);
                                        } else {
                                            EnviarDatosReciboProd(artSelectRecProd, '', cantidad)
                                            setVisibleFormCantidad(!visibleFormCantidad)
                                        }
                                        break;

                                    case 'insertarSL':
                                        console.log('Insertandoo....',artSelectRecProd.countedQty + ' : ' + artSelectRecProd.plannedQty + ' : ' + cantidad)
                                        const cantidadMayorSL = verificarCantidad(artSelectRecProd.countedQty, artSelectRecProd.plannedQty, cantidad)
                                        if (cantidadMayorSL == true) {
                                            Alert.alert('Advertencia', '¡La cantidad ingresada excede el limite total!', [
                                                {
                                                    text: 'OK', onPress: () => { }
                                                },
                                            ]);
                                        } else {
                                            console.log('item seleccionado: ', itemSeleccionado)
                                            //SI LA TABLA ESTA VACIA, AGREGA ELEMENTO NUEVO
                                            if (dataSLReciboProd.length == 0) {
                                                EnviarDatosReciboProd(itemSeleccionado, valueSLReciboProd, cantidad)
                                                //SI NO, VALIDA QUE EXISTE EL NOMBRE INGRESADO PARA EVITAR DUPLICIDAD
                                            } else {
                                                existeSLReciboProd(itemSeleccionado, valueSLReciboProd, cantidad)
                                            }
                                        }
                                        break;

                                    case 'Edicion':
                                        console.log('Editando...')
                                        editarSLReciboProd(articulo, itemSeleccionado, idCodeEdit, cantidad)
                                        break;

                                    default:
                                        break;
                                }
                                /* if (itemSeleccionado.gestionItem == 'I') {
                                    EnviarDatosReciboProd(itemSeleccionado, '', cantidad)
                                    setVisibleFormCantidad(!visibleFormCantidad)
                                } else {
                                    //SI LA TABLA ESTA VACIA, AGREGA ELEMENTO NUEVO
                                    if (dataSLReciboProd.length == 0) {
                                        EnviarDatosReciboProd(itemSeleccionado, valueSLReciboProd, cantidad)
                                        //SI NO, VALIDA QUE EXISTE EL NOMBRE INGRESADO PARA EVITAR DUPLICIDAD
                                    } else {
                                        existeSLReciboProd(itemSeleccionado, valueSLReciboProd, cantidad)
                                    }
                                } */
                            }
                        },
                    ]);
                }}
                titleStyle={{ fontSize: 24 }}
            />
            <Button
                title='Salir'
                onPress={() => {
                    setVisibleFormCantidad(!visibleFormCantidad)
                }}
                titleStyle={{ fontSize: 24 }}
                buttonStyle={{ backgroundColor: '#FF0000', marginVertical: 10, display: itemSeleccionado.gestionItem == 'I' ? 'flex' : 'none' }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#ffff',
        color: '#000',
        height: 50,
        fontSize: 20,
        paddingHorizontal: 20,
        marginVertical: 20,
        borderRadius: 10,
        fontWeight: '500',
        borderColor: '#000',
        borderWidth: 1
    },
    label: {
        fontSize: 18,
        marginBottom: 8
    },
    selectBox: {
        marginBottom: 20
    }
})

export default ComponenteCantidad;
