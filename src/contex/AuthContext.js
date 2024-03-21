import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native'
import { useNetInfo } from '@react-native-community/netinfo';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const netInfo = useNetInfo();
    const [user, setUser] = useState('DispJose');
    const [pass, setPass] = useState('5dK.1wA&B');
    const [company, setCompany] = useState('JOse');
    const [url, setUrl] = useState('http://15.204.32.185:900');
    const [tokenInfo, setTokenInfo] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTI, setIsLoadingTI] = useState(false);
    const [isLoadingCerrarConteo, setIsLoadingCerrarConteo] = useState(false);
    const [menu, setMenu] = useState([]);
    const [inventario, setInventario] = useState([]);
    //Variables para el buscador de hojas
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    //Variables para el buscador de articulos
    const [searchArticulos, setSearchArticulos] = useState('');
    const [filteredDataSourceArticulos, setFilteredDataSourceArticulos] = useState([]);
    const [masterDataSourceArticulos, setMasterDataSourceArticulos] = useState([]);
    const [articulos, setArticulos] = useState([]);
    //Variables para buscar barcode al escanear o ingresar codigo
    const [searchBarcode, setSearchBarcode] = useState(null);
    const [inputScannerTI, setInputScannerTI] = useState(0);
    //Variables para traer los almacenes
    const [almacenes, setAlmacenes] = useState([]);
    const [ubicacionItem, setUbicacionItem] = useState([]);
    const [ubicacionItem2, setUbicacionItem2] = useState([]);
    //Variables para traer 1 articulo respecto al almacen y ubicacion
    const [articulo, setArticulo] = useState([]);
    let art = 0;
    //Variables para el Navigation.js
    const [activarBuscadorConteoInv, setActivarBuscadorConteoInv] = useState(false);
    const [activarBuscadorArticulos, setActivarBuscadorArticulos] = useState(false);
    const [iconoBuscarArticulos, setIconoBuscarArticulos] = useState(false);
    //Variables para el TAB Navigation
    const [indexTab, setIndexTab] = useState(0);
    const [serialsLotes, setSerialsLotes] = useState([]);
    const [arraySeries, setArraySeries] = useState([]);
    const [textSerie, setTextSerie] = useState(null)
    const [moduloScan, setModuloScan] = useState(null);
    const [lote, setLote] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [cantidadSerieLote, setCantidadSerieLote] = useState(0);
    const [contadorClic, setContadorClic] = useState(false);
    let numSeries = 0;
    let arrayRemoto2 = [];
    let contadorSerie = 0;
    let virificadorLote = 0;
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [selectedAlmacen, setSelectedAlmacen] = useState("");
    const [selectedAlmacen2, setSelectedAlmacen2] = useState("");
    const [selectedUbicacion, setSelectedUbicacion] = useState("");
    const [selectedUbicacion2, setSelectedUbicacion2] = useState("");
    //VARIABLES PARA EL MODULO DE TRASLADOS
    const [barcodeItemTraslados, setBarcodeItemTraslados] = useState(null);
    const [itemsTraslados, setItemsTraslados] = useState([]);
    const [tablaItemsTraslados, setTablaItemsTraslados] = useState([]);
    const [itemTraslado, setItemTraslado] = useState([]);
    const [serieLoteTransfer, setSerieLoteTransfer] = useState(null);
    const [isModalTransferirSerieLote, setIsModalTransferirSerieLote] = useState(false);
    const [selectedUbicacionOri, setSelectedUbicacionOri] = useState(0);
    const [selectedUbicacionDes, setSelectedUbicacionDes] = useState(0);
    const [isModalUbicacion, setIsModalUbicacion] = useState(false)
    const [dataSerieLoteTransfer, setDataSerieLoteTransfer] = useState([]);
    const [tablaSeriesLotesTransfer, setTablaSeriesLotesTransfer] = useState([]);
    const [seEscaneo, setSeEscaneo] = useState(false)
    const [ubicacionOri, setUbicacionOri] = useState([]);
    const [ubicacionDes, setUbicacionDes] = useState([]);
    const [idCodeSL, setIdCodeSL] = useState([]);
    const [listaSeriesLotes, setListaSeriesLotes] = useState([])
    const [filterListaSeriesLotes, setFilterListaSeriesLotes] = useState([])
    const [isModalSerieLote, setIsModalSerieLote] = useState(false);
    const [isEnter, setIsEnter] = useState(false)
    let partes = [];
    //VARIABLES PARA EL MODULO DE ETIQUETAS MASTER DETAILS
    const [masterDetails, setMasterDetails] = useState([]);
    //VARIABLES PARA EL MODULO DE DETALLE INVENTARIO (IMPRESION DE ETIQUETAS)
    const [datosScan, setDatosScan] = useState([]);
    const [dataComplete, setDataComplete] = useState(data);
    const [data, setData] = useState([]);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const [dataDetalleInv, setDataDetalleInv] = useState([]);
    const [paramsDetalleInvSL, setParamsDetalleInvSL] = useState([]);
    const [searchDetalleInvSL, setSearchDetalleInvSL] = useState('');
    const [searchDetalleInv, setSearchDetalleInv] = useState('');
    const [dataCompleteDI, setDataCompleteDI] = useState([]);



    const splitCadenaEscaner = (dato1, dato2, modulo) => {
        setBarcodeItemTraslados(null)
        const cadenaOriginal = dato1;
        partes = cadenaOriginal.split("||");
        const codigoArticulo = partes[0];
        const idCodeSerieLote = partes[1];
        const almacen = partes[2];
        const ubicacion = partes[3];

        switch (modulo) {
            case 'EnterSolicitudTransferencia':
                if (partes.length == 3) {
                    let filtradoArticuloEscaner = searchFilterItemsTrasladosEscan(partes[0], partes[1], partes[2])
                    if (filtradoArticuloEscaner == 0) {
                        Alert.alert('Advertencia', '¡No se encontro el item escaneado!', [
                            {
                                text: 'OK', onPress: () => {
                                    setItemsTraslados(tablaItemsTraslados)
                                }
                            },
                        ]);
                    } else {
                        setItemsTraslados(filtradoArticuloEscaner)
                    }
                } else {
                    let filtradoSerieLoteEscaner = FiltrarArticulosTraslado(codigoArticulo, almacen, ubicacion)
                    if (filtradoSerieLoteEscaner == 0) {
                        Alert.alert('Advertencia', '¡No se encontro el item escaneado!', [
                            {
                                text: 'OK', onPress: () => {
                                    setItemsTraslados(tablaItemsTraslados)
                                }
                            },
                        ]);
                    } else {
                        cargarSeriesLotesDisp(filtradoSerieLoteEscaner[0], idCodeSerieLote, 'escaner')
                        setItemTraslado(filtradoSerieLoteEscaner[0])
                        setItemsTraslados(tablaItemsTraslados)
                    }
                }
                break;
            case 'EscanerSolicitudTransferencia':
                let filtradoArticuloEscan = FiltrarArticulosTraslado(codigoArticulo, almacen, ubicacion)
                if (filtradoArticuloEscan == 0) {
                    Alert.alert('Advertencia', '¡No se encontro el item escaneado!', [
                        {
                            text: 'OK', onPress: () => {
                            }
                        },
                    ]);
                } else {
                    cargarSeriesLotesDisp(filtradoArticuloEscan[0], idCodeSerieLote, 'escaner')
                    setItemTraslado(filtradoArticuloEscan[0])
                }
                break;
            case 'EnterSolicitudTransferenciaSeriesLotes':
                FiltrarArticulosTraslado(dato2, codigoArticulo)
                //setIdCodeSL(partes)
                console.log('idCode', partes)
                break;
            default:
                break;
        }
    }

    const conectarApi = (usuario, password, peticion) => {
        setIsLoading(true);
        axios
            .post(`${url}/api/Login`, {
                usuario,
                password,
                company,
            })
            .then(res => {
                if (peticion == 'probarConexion') {
                    probarConexionApi();
                    console.log(res.status)
                } else if (peticion == 'conectarApi') {
                    guardarDatosApi(usuario, url, company, res);
                } else if (peticion == 'Login') {
                    Login(res, usuario);
                }
            })
            .catch(e => {
                Alert.alert('Posibles fallas', 'Conexion a internet, llena todos los campos, revisa que los datos ingresados sean correctos', [
                    { text: 'OK' },
                ]);
                setIsLoading(false);
            });

    }

    const Login = async (res, usuario) => {
        let tokenInfo = res.data;
        setTokenInfo(tokenInfo);
        await AsyncStorage.setItem('token', JSON.stringify(tokenInfo.token));
        await AsyncStorage.setItem('pass', JSON.stringify(pass));
        getMenu(tokenInfo.token);
        setIsLoading(false);
    }

    const logOut = async () => {
        Alert.alert('Cerrar Sesíon', 'Estas seguro de finalizar tu sesíon', [
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Cerrar Sesíon', onPress: async () => {
                    setTokenInfo({});
                    setPass('');
                    await AsyncStorage.removeItem('token');
                }
            },
        ]);
    }

    const guardarDatosApi = async (usuario, url, company, res) => {
        try {
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
            await AsyncStorage.setItem('pass', JSON.stringify(pass));
            await AsyncStorage.setItem('company', JSON.stringify(company));
            await AsyncStorage.setItem('url', JSON.stringify(url));

            Alert.alert('Datos Guardados Exitosamente!!!', '', [
                { text: 'OK' },
            ]);
        } catch (e) {
            setIsLoading(false);
        }
        setIsLoading(false);
    }

    const probarConexionApi = () => {
        try {
            Alert.alert('Conexion Exitosa!!!', '', [
                { text: 'OK' },
            ]);
        } catch (e) {
            console.log('Error prueba de conexion', e)
        }

        setIsLoading(false);
    }

    const getData = async () => {
        try {
            let usuario = await AsyncStorage.getItem('usuario');
            let password = await AsyncStorage.getItem('pass');
            let company = await AsyncStorage.getItem('company');
            let url = await AsyncStorage.getItem('url');
            let token = await AsyncStorage.getItem('token');

            if (usuario !== null) {
                setUserInfo(usuario);
                setUser(JSON.parse(usuario))
                setCompany(JSON.parse(company))
                setUrl(JSON.parse(url))
                setPass(JSON.parse(password))

            }
        } catch (e) {
            // error reading value
        }
    };

    // Funcion para traer el Menu principal
    const getMenu = async (token) => {
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        // Make GET request
        await axios.get(`${url}/api/Menu`, { headers })
            .then(response => {
                let menu = response.data.menus;

                AsyncStorage.setItem('Menu', JSON.stringify(menu), (err) => {
                    if (err) {
                        console.log("an error");
                        throw err;
                    }
                    console.log("success");
                }).catch((err) => {
                    console.log("error is: " + err);
                });

                setMenu(menu);
            })
            .catch(error => {
                console.error('Error al conectar', error);
                try {
                    const value = AsyncStorage.getItem('Menu');
                    if (value !== null) {
                        // We have data!!
                        setMenu(value)
                        console.log('Menu guardado en el storage', value)
                    }
                } catch (error) {
                    // Error retrieving data
                }
            });
    }

    // Funciones para traer las hojas de inventario
    const getInventario = async () => {
        setInventario([])
        setFilteredDataSource([])
        setMasterDataSource([])
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/InventoryCount/Get_DocumentsInventory`, { headers })
            .then(response => {
                const inventario = response.data.oinc;
                setInventario(inventario);
                setFilteredDataSource(response.data.oinc);
                setMasterDataSource(response.data.oinc);
                setIsLoadingCerrarConteo(false)
                setIsLoading(false)
            })
            .catch(error => {
                console.error(error);
            });

    }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.referencia
                    ? item.referencia.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            const newData2 = masterDataSource.filter(function (item) {
                const itemData = item.createDate
                    ? item.createDate.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData.concat(newData2));
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    //Funciones para traer los articulos
    const getArticulos = async (docEntry) => {
        setFilteredDataSourceArticulos([])
        setMasterDataSourceArticulos([])
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/InventoryCount/Get_DetailsInventory?IdDocumentCnt=${docEntry}`, { headers })
            .then(response => {
                const articulos = response.data.oinc[0].items;
                setArticulos(articulos);
                setFilteredDataSourceArticulos(response.data.oinc[0].items);
                setMasterDataSourceArticulos(response.data.oinc[0].items);
            })
            .catch(error => {
                console.error('No hay articulos aqui', error);
            });
    }

    const searchFilterFunctionArticulos = (text) => {
        console.log(text)
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSourceArticulos.filter(function (item) {
                const itemData = item.barCode
                    ? item.barCode.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            const newData2 = masterDataSourceArticulos.filter(function (item) {
                const itemData = item.itemCode
                    ? item.itemCode.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSourceArticulos(newData.concat(newData2));
            setSearchArticulos(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSourceArticulos(masterDataSourceArticulos);
            setSearchArticulos(text);
        }
    };

    const filtrarBarcode = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSourceArticulos.filter(function (item) {
                const itemData = item.barCode
                    ? item.barCode.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSourceArticulos(newData);
            setSearchBarcode(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSourceArticulos(masterDataSourceArticulos);
            setSearchBarcode(text);
        }
    };

    //Funcion para traer almacenes y ubicaciones
    const getAlmacenes = async () => {
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/Inventory/Get_WhareHouse`, { headers })
            .then(response => {
                let arrayAlmacenes = response.data.owhs.map((item) => {
                    return { key: item.whsCode, value: item.whsName, ubicacion: item.bins }
                })
                //Set Data Variable
                setAlmacenes(arrayAlmacenes);
            })
            .catch(error => {
                console.error('No hay almacenes aqui', error);
            });
    }

    const obtenerUbicacionAlmacen = (bins) => {
        let arrayUbicacion = bins.map((item) => {
            return { key: item.absEntry, value: item.sL1Code }
        })
        setUbicacionItem(arrayUbicacion)
        setUbicacionItem2(arrayUbicacion)
    }

    const LimpiarPantallaConteoInventario = () => {
        setArticulo([]);
        setSearchBarcode(null);
        setIconoBuscarArticulos(false);
        setIndexTab(0);
        setSerialsLotes([]);
        setSelectedAlmacen("")
        setSelectedUbicacion("")
        setTextSerie(null)
        setContadorClic(false)
    }

    const loading = () => {
        numSeries = serialsLotes.length;
    }

    const guardarConteoLote = async (cantidad, textLote, sysNumber) => {
        let textLoteVerificado = null;
        let arrayLote = [];
        let cantidadTotalLotes = 0;
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/InventoryCount/Get_SerAndBatchs_CountInventory?IdDocumentCnt=${articulo.docEntry}&LineNum=${articulo.lineNum}&ItemCode=${articulo.itemCode}&GestionItem=${articulo.gestionItem}`, { headers })
            .then(response => {
                console.log('esto es del lote/serie....', response)
                arrayLote = response.data.SerialxManbach;
                if (arrayLote != undefined) {
                    arrayLote.map((item) => {
                        cantidadTotalLotes = Number(item.quantityCounted);
                        if (item.idCode == textLote) {
                            textLoteVerificado = item.idCode;
                            item.quantityCounted = Number(item.quantityCounted) + Number(cantidad);
                        }
                    })
                }
            })
            .catch(error => {
                console.error('error', error);
            });

        if (textLoteVerificado == null) {
            insertarLoteNuevo(arrayLote, cantidad, cantidadTotalLotes, textLote, sysNumber)
        } else {
            actualizarLotes(arrayLote, cantidadTotalLotes)
        }
    }

    const insertarLoteNuevo = (arrayLoteTotal, cantidad, cantidadTotalLotes, textLote, sysNumber) => {
        let arrayLoteTotal2 = [];
        arrayLoteTotal2.push(arrayLoteTotal || []);
        let arrayLocal = [{
            "baseLineNum": articulo.lineNum,
            "serManLineNum": 0,
            "gestionItem": articulo.gestionItem,
            "itemCode": articulo.itemCode,
            "idCode": textLote,
            "sysNumber": sysNumber,
            "quantityCounted": cantidad,
            "whsCode": articulo.whsCode,
            "binEntry": articulo.binEntry,
            "binCode": articulo.binCode,
            "updateDate": "2023-08-24T00:00:00",
        }];
        arrayLoteTotal2[0].push(arrayLocal[0])
        console.log('este es el array total', arrayLoteTotal2[0])

        // Set headers
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        axios
            .put(`${url}/api/InventoryCount/Update_CountInventory`, {
                "docEntry": articulo.docEntry,
                "Items": [
                    {
                        "DocEntry": articulo.docEntry,
                        "LineNum": articulo.lineNum,
                        "ItemCode": articulo.barCode,
                        "BarCode": articulo.itemCode,
                        "ItemDesc": articulo.itemDesc,
                        "GestionItem": articulo.gestionItem,
                        "WhsCode": articulo.whsCode,
                        "totalQty": articulo.totalQty,
                        "QuantityCounted": cantidadTotalLotes + Number(cantidad),
                        "BinEntry": articulo.binEntry,
                        "BinCode": articulo.binCode,
                        "serialandManbach": arrayLoteTotal2[0]
                    }
                ]
            }, { headers })
            .then((response) => {
                setIsLoading(false)
                Alert.alert('Info', 'Conteo guardado con exito!!!', [
                    { text: 'OK', onPress: () => cargarTablaLotes(articulo.docEntry, articulo.lineNum, articulo.itemCode, articulo.gestionItem) },
                ]);
            })
            .catch(error => {
                setIsLoading(false)
                if (error.response) {
                    //response status is an error code
                    console.log(error.response.status);
                }
                else if (error.request) {
                    //response not received though the request was sent
                    console.log(error.request);
                }
                else {
                    //an error occurred when setting up the request
                    console.log(error.message);
                }
            });
    }

    const actualizarLotes = (arrayLote, cantidadTotalLotes) => {
        console.log('actualizando datos...', arrayLote[0] + ' /// ' + cantidadTotalLotes)
        // Set headers
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        axios
            .put(`${url}/api/InventoryCount/Update_CountInventory`, {
                "docEntry": articulo.docEntry,
                "Items": [
                    {
                        "DocEntry": articulo.docEntry,
                        "LineNum": articulo.lineNum,
                        "ItemCode": articulo.barCode,
                        "BarCode": articulo.itemCode,
                        "ItemDesc": articulo.itemDesc,
                        "GestionItem": articulo.gestionItem,
                        "WhsCode": articulo.whsCode,
                        "totalQty": articulo.totalQty,
                        "QuantityCounted": cantidadTotalLotes,
                        "BinEntry": articulo.binEntry,
                        "BinCode": articulo.binCode,
                        "serialandManbach": arrayLote
                    }
                ]
            }, { headers })
            .then((response) => {
                setIsLoading(false)
                Alert.alert('Info', 'Conteo guardado con exito!!!', [
                    { text: 'OK', onPress: () => cargarTablaLotes(articulo.docEntry, articulo.lineNum, articulo.itemCode, articulo.gestionItem) },
                ]);
            })
            .catch(error => {
                setIsLoading(false)
                if (error.response) {
                    //response status is an error code
                    console.log(error.response.status);
                }
                else if (error.request) {
                    //response not received though the request was sent
                    console.log(error.request);
                }
                else {
                    //an error occurred when setting up the request
                    console.log(error.message);
                }
            });
    }

    const cargarTablaLotes = async (docEntry, lineNum, itemCode, gestionItem) => {
        setLote([])
        setLotes([])
        setTextSerie(null)
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/InventoryCount/Get_SerAndBatchs_CountInventory?IdDocumentCnt=${docEntry}&LineNum=${lineNum}&ItemCode=${itemCode}&GestionItem=${gestionItem}`, { headers })
            .then(response => {
                arrayLote = response.data.SerialxManbach;
                if (arrayLote == undefined) {
                    setLotes([])
                    setSerialsLotes([])
                } else {
                    setLotes(arrayLote)
                    setSerialsLotes(arrayLote)
                }
            })
            .catch(error => {
                console.error('error al cargar tabla', error);
            });
    }

    const verificarEscaneoSerie = async (docEntry, lineNum, itemCode, gestionItem, textSerie) => {
        let textSerieVerificada = null;
        let arraySer = [];
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/InventoryCount/Get_SerAndBatchs_CountInventory?IdDocumentCnt=${docEntry}&LineNum=${lineNum}&ItemCode=${itemCode}&GestionItem=${gestionItem}`, { headers })
            .then(response => {
                arraySer = response.data.SerialxManbach;
                if (arraySer != undefined) {
                    arraySer.map((item) => {
                        if (item.idCode == textSerie) {
                            textSerieVerificada = item.idCode;
                        }
                    })
                }
            })
            .catch(error => {
                console.error('error', error);
                setContadorClic(false)
                setIsLoading(false)
            });

        if (textSerieVerificada == null) {
            filtrarSerie(textSerie, arraySer);
            loading();
        } else {
            setIsLoading(false)
            Alert.alert('Advertencia', 'Serie escaneada previamente!!!', [
                { text: 'OK', onPress: () => { textSerieVerificada = null; setContadorClic(false) } },
            ]);
            //filtrarSerie(textSerie); loading()
        }

    }

    const verificarLote = async (textSerie, modoBusqueda) => {
        const { gestionItem, itemCode, whsCode, binEntry } = articulo;
        let sysNumber = null;
        setLote([])
        // Set headers
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.post(`${url}/api/Inventory/Get_Batchs_and_Serials`,
            {
                "GestionItem": gestionItem,
                "ItemCode": itemCode,
                "WhsCode": whsCode,
                "BinEntry": binEntry,
                "serialOrLote": textSerie
            },
            { headers }
        ).then(response => {
            setContadorClic(false)
            setIsLoading(false)
            response.data.serialxManbach.map((item) => {
                if (item.idCode === textSerie) {
                    setLote(item)
                    setCantidadSerieLote(1)
                    virificadorLote = 1;
                    sysNumber = item.sysNumber;
                }
            })
            if (virificadorLote == 0) {
                setContadorClic(false)
                setIsLoading(false)
                Alert.alert('Advertencia', 'No existe el lote', [
                    { text: 'OK' },
                ]);
            }
            /* if (modoBusqueda == 'escaner' && virificadorLote == 1) {
                //guardarConteoLote(1, textSerie, sysNumber)
            } */
            virificadorLote = 0;
        })
            .catch(error => {
                setContadorClic(false)
                setIsLoading(false)
                Alert.alert('Advertencia', 'No existe el lote', [
                    { text: 'OK' },
                ]);
            });
    }

    const filtrarSerie = async (textSerie, arrayRemoto) => {
        contadorSerie = 0;
        arrayRemoto2.push(arrayRemoto || []);
        console.log('antes de enviarlo...', arrayRemoto2[0])
        const { gestionItem, itemCode, whsCode, binEntry } = articulo;
        // Set headers
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.post(`${url}/api/Inventory/Get_Batchs_and_Serials`,
            {
                "GestionItem": gestionItem,
                "ItemCode": itemCode,
                "WhsCode": whsCode,
                "BinEntry": binEntry,
                "serialOrLote": textSerie
            },
            { headers }
        ).then(response => {
            let IdCode = null;
            let SysNumber = null;
            console.log('este es cuando valida si existe', response.data)
            response.data.serialxManbach.map((item) => {
                console.log('este es cuando valida si existe', response.data)
                if (item.idCode === textSerie) {
                    setSerialsLotes([...serialsLotes, item])
                    IdCode = item.idCode;
                    SysNumber = item.sysNumber;
                    contadorSerie = 1;
                    setIsLoading(false)
                }
            })
            if (contadorSerie == 0) {
                Alert.alert('Advertencia', 'No se encontro la serie', [
                    { text: 'OK', onPress: () => { setContadorClic(false); setIsLoading(false) } },
                ]);
            } else {
                let arrayLocal = [{
                    "baseLineNum": articulo.lineNum,
                    "serManLineNum": 0,
                    "gestionItem": articulo.gestionItem,
                    "itemCode": articulo.itemCode,
                    "idCode": IdCode,
                    "sysNumber": SysNumber,
                    "quantityCounted": 1,
                    "whsCode": articulo.whsCode,
                    "binEntry": articulo.binEntry,
                    "binCode": articulo.binCode,
                    "updateDate": "2023-08-24T00:00:00",
                }];
                arrayRemoto2[0].push(arrayLocal[0])
                // Set headers
                const headers = {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenInfo.token}`
                };
                axios
                    .put(`${url}/api/InventoryCount/Update_CountInventory`, {
                        "docEntry": articulo.docEntry,
                        "Items": [
                            {
                                "DocEntry": articulo.docEntry,
                                "LineNum": articulo.lineNum,
                                "ItemCode": articulo.barCode,
                                "BarCode": articulo.itemCode,
                                "ItemDesc": articulo.itemDesc,
                                "GestionItem": articulo.gestionItem,
                                "WhsCode": articulo.whsCode,
                                "totalQty": articulo.totalQty,
                                "QuantityCounted": articulo.countQty,
                                "BinEntry": articulo.binEntry,
                                "BinCode": articulo.binCode,
                                "serialandManbach": arrayRemoto2[0]
                            }
                        ]
                    }, { headers })
                    .then((response) => {
                        console.log('Respuesta de la DATA...', response.data)
                        setContadorClic(false)
                    });
            }
        })
            .catch(error => {
                setIsLoading(false)
                Alert.alert('Advertencia', 'No se encontro la serie', [
                    { text: 'OK', onPress: () => { setContadorClic(false) } },
                ]);
            });
    }

    //FUNCION PARA FILTRAR ARTICULOS EN TOMA DE INVENTARIO
    const filtrarArticulo = async (props, searchBarcode) => {
        setArticulo([])
        setLote([])
        setLotes([])
        art = 0;
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/InventoryCount/Get_DetailsInventory?IdDocumentCnt=${props.props}`, { headers })
            .then(response => {
                const articulos = response.data.oinc[0].items;
                articulos.map((item) => {
                    const regex = new RegExp(item.barCode, 'gi');
                    const barCode = regex.test(searchBarcode);
                    if (selectedAlmacen == item.whsCode && selectedUbicacion == item.binEntry && searchBarcode.toUpperCase() == item.itemCode.toUpperCase()) {
                        setArticulo(item)
                        art = 1;
                        setIsLoading(false)
                        setContadorClic(false)
                        if (item.gestionItem != 'I') {
                            setIndexTab(1);
                            setSerialsLotes([]);
                            setTextSerie([]);
                            cargarTablaLotes(item.docEntry, item.lineNum, item.itemCode, item.gestionItem)
                        }
                    }
                })
                setIsLoadingItems(false)
                if (art == 0) {
                    setArticulo([{}, {}])
                    setIsLoading(false)
                    setContadorClic(false)
                }
            })
            .catch(error => {
                console.log('estoy en el log');
                setIsLoading(false)
                setContadorClic(false)
                if (error.response) {
                    //response status is an error code
                    console.log(error.response.status);
                }
                else if (error.request) {
                    //response not received though the request was sent
                    console.log(error.request);
                }
                else {
                    //an error occurred when setting up the request
                    console.log(error.message);
                }
            });
    }

    //METODOS PARA EL MODULO DE TRASLADOS
    const searchFilterItemsTraslados = (text) => {
        console.log('buscando articulo', text)
        // Check if searched text is not blank
        if (text) {
            setItemsTraslados(
                itemsTraslados.filter((item) =>
                    item.itemCode.toUpperCase().includes(text.toUpperCase()) ||
                    item.itemDesc.toUpperCase().includes(text.toUpperCase()) ||
                    item.fromWhsCode.toUpperCase().includes(text.toUpperCase())
                )
            );
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with tablaSolicitudTransfer
            setItemsTraslados(tablaItemsTraslados)
        }
    };

    const enviarTransferencia = async (docEntry) => {
        console.log('Este es el docEntry...', docEntry)
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.post(`${url}/api/SolTransferStock/Close?IdCounted=${docEntry}`, { docEntry }, { headers }
        )
            .then(response => {
                console.log('Respuesta...', response.status)
                setFilteredDataSource([])
                setTablaSolicitudTransfer([])
                getAlmacenes();
                getDocuments()
                setIsLoading(false)
            })
            .catch(error => {
                setIsLoading(false)
                console.log('Error al cerrar', error.message)
            });
    }

    const searchFilterItemsTrasladosEscan = (itemCode, fromWhsCode, fromBinEntry) => {
        return tablaItemsTraslados.filter(item => {
            return item.itemCode == itemCode && item.fromWhsCode == fromWhsCode && item.fromBinEntry == fromBinEntry;
        });
    };

    const getItemsTraslados = (docEntry) => {
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        axios.get(`${url}/api/SolTransferStock/Get_Details?IdDocumentCnt=${docEntry}`, { headers })
            .then(response => {
                setIsLoading(false)
                setItemsTraslados(response.data.owtr[0].items)
                setTablaItemsTraslados(response.data.owtr[0].items)
                console.log('ITEMS TRASLADOS....', response.data.owtr[0].items)
            })
            .catch(error => {
                console.error('Error al obtener los articulos de transferencia', error);
                setIsLoading(false)
            });
    }

    function FiltrarArticulosTraslado(itemCode, fromWhsCode, fromBinEntry) {
        return tablaItemsTraslados.filter(function (elemento) {
            return elemento.itemCode == itemCode &&
                elemento.fromWhsCode == fromWhsCode &&
                elemento.fromBinEntry == fromBinEntry;
        });
    }

    function FiltrarSerieLoteTraslado(data, idCode) {
        return data.filter(function (elemento) {
            return elemento.idCode.toUpperCase() == idCode.toUpperCase()
        });
    }

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

    const ubicacionDesOri = (fromWhsCode, toWhsCode) => {
        setIsModalSerieLote(!isModalSerieLote);
        obtenerUbicacionOri(fromWhsCode);
        obtenerUbicacionDes(toWhsCode);
    };


    /* const FiltrarArticulosTraslado = async (docEntry, barcodeItemTraslados) => {
        setItemTraslado([]);
        setIsLoading(true);

        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        axios.get(`${url}/api/SolTransferStock/Get_Details?IdDocumentCnt=${docEntry}`, { headers })
            .then(response => {
                response.data.owtr[0].items.map((item) => {
                    if (barcodeItemTraslados.toUpperCase() == item.itemCode.toUpperCase()) {
                        setItemTraslado(item)
                        partes.push(item.gestionItem)
                        setIdCodeSL(partes)
                        setContadorClic(false)
                        setBarcodeItemTraslados(null)
                        console.log('datos...', item)

                    }
                })
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error', error);
            });
    } */

    const cargarSeriesLotesDisp = async (item, idCode, accion) => {
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/SolTransferStock/Get_Disp_SerAndBatchs?ItemCode=${item.itemCode}&GestionItem=${item.gestionItem}&WhsCode=${item.fromWhsCode}`, { headers })
            .then(response => {
                console.log
                setListaSeriesLotes(response.data.serialxManbach)
                setFilterListaSeriesLotes(response.data.serialxManbach)

                if (accion == 'escaner') {
                    let filtradoSerieLote = FiltrarSerieLoteTraslado(response.data.serialxManbach, idCode)
                    if (filtradoSerieLote.length == 0) {
                        Alert.alert('Advertencia', '¡No se encontro el item escaneado!', [
                            {
                                text: 'OK', onPress: () => {
                                }
                            },
                        ]);
                        setIsEnter(false)
                    } else {
                        setDataSerieLoteTransfer(filtradoSerieLote[0])
                        setIsEnter(true)
                    }

                }
            })
            .catch(error => {
                console.error('Error al traer los lotes', error);
                setIsEnter(false)
            });
    };

    const ComprobarSerieLoteTransfer = (gestionItem, itemCode, fromWhsCode, ubicacion, serieLoteT, accion) => {
        console.log('Comprobando serie lote tranfer...', gestionItem + ' : ' + itemCode + ' : ' + fromWhsCode + ' : ' + ubicacion + ' : ' + serieLoteT)
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        axios.get(`${url}/api/Inventory/Get_Batchs_and_Serials`, {
            "GestionItem": gestionItem,
            "ItemCode": itemCode,
            "WhsCode": fromWhsCode,
            "BinEntry": ubicacion || 0,
            "serialOrLote": serieLoteT
        }, { headers })
            .then(response => {
                setIsModalTransferirSerieLote(!isModalTransferirSerieLote)
                setDataSerieLoteTransfer(response.data.serialxManbach[0]);
                setIdCodeSL([])
                if (accion == 'sinEscaner') {
                    setIsModalUbicacion(!isModalUbicacion);
                }
            })
            .catch(error => {
                Alert.alert('Info', `No se encontro ${serieLoteT} en este almacen/ubicacion `, [
                    { text: 'OK', onPress: () => { setIdCodeSL([]) } },
                ]);
            });
    }

    const ActualizarSerieLoteTransfer = (cantidad) => {
        const { docEntry, lineNum, itemCode, barCode, itemDesc, gestionItem, fromWhsCode, fromBinCode, fromBinEntry, toWhsCode, totalQty, countQty, counted, toBinEntry, binCode } = itemTraslado
        console.log('Datos del Articulo', itemTraslado)
        console.log('Datos del lote seleccionado', dataSerieLoteTransfer)
        console.log('Ubicacion de origen seleccionada', selectedUbicacionOri)
        console.log('Ubicacion de destino seleccionada', selectedUbicacionDes)


        let arrayPendiente = [
            {
                "baseLineNum": lineNum,
                "serManLineNum": 0,
                "gestionItem": dataSerieLoteTransfer.gestionItem,
                "itemCode": dataSerieLoteTransfer.itemCode,
                "idCode": dataSerieLoteTransfer.idCode,
                "sysNumber": dataSerieLoteTransfer.sysNumber,
                "quantityCounted": cantidad,
                "fromWhsCode": dataSerieLoteTransfer.whsCode,
                "fromBinEntry": selectedUbicacionOri || 0,
                "fromBinCode": "",
                "toWhsCode": toWhsCode,
                "toBinEntry": selectedUbicacionDes,
                "toBinCode": "",
                "updateDate": "2024-01-04T18:24:48.861Z"
            }
        ]

        tablaSeriesLotesTransfer.push(arrayPendiente[0]);


        // Set headers
        const headers = {
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
                        "fromBinEntry": selectedUbicacionOri || 0,
                        "fromBinCode": "",
                        "toWhsCode": toWhsCode,
                        "toBinEntry": selectedUbicacionDes || 0,
                        "toBinCode": "",
                        "inWhsQty": totalQty,
                        "quantityCounted": 1,
                        "serialandManbach": tablaSeriesLotesTransfer
                    }
                ]
            }, { headers })
            .then((response) => {
                setIsLoading(false)
                console.log('Esto es lo que se enviara...', tablaSeriesLotesTransfer)
                Alert.alert('Info', '¡Se asigno con éxito!', [
                    {
                        text: 'OK', onPress: () => {
                            cargarTablaSeriesLotesTransfer()
                            getItemsTraslados(docEntry)
                            setSelectedUbicacionDes(0)
                            setSelectedUbicacionOri(0)
                        }
                    },
                ]);
            })
            .catch(error => {
                setSelectedUbicacionDes(0)
                setSelectedUbicacionOri(0)
                setIsLoading(false)
            });
    }

    const cargarTablaSeriesLotesTransfer = async () => {
        const { docEntry, lineNum, itemCode, gestionItem } = itemTraslado
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/SolTransferStock/Get_SerAndBatchs?IdDocumentCnt=${docEntry}&LineNum=${lineNum}&ItemCode=${itemCode}&GestionItem=${gestionItem}`, { headers })
            .then(response => {

                let arrayseriesLotes = response.data.SerialxManbach;
                if (arrayseriesLotes == undefined) {
                    setTablaSeriesLotesTransfer([]);
                } else {
                    setTablaSeriesLotesTransfer(arrayseriesLotes);
                }
            })
            .catch(error => {
                console.error('error al cargar tabla..', itemTraslado);
            });
    }

    const ubicacionOrigen = (gestionItem, itemCode, fromWhsCode, toWhsCode) => {

        almacenes.map((item) => {
            if (item.key == itemTraslado.fromWhsCode) {
                if (item.ubicacion != null) {
                    console.log('item.ubicacion != null', item.ubicacion)
                    setIsModalUbicacion(!isModalUbicacion)
                    let arrayUbicacion = item.ubicacion.map((item) => {
                        return { key: item.absEntry, value: item.sL1Code }
                    })
                    setUbicacionOri(arrayUbicacion);
                } else {
                    console.log('no hay ubicacion aqui')
                    ComprobarSerieLoteTransfer(gestionItem, itemCode, fromWhsCode, selectedUbicacionOri, serieLoteTransfer)
                }
            }
            if (item.key == itemTraslado.toWhsCode) {
                if (item.ubicacion != null) {
                    let arrayUbicacion = item.ubicacion.map((item) => {
                        return { key: item.absEntry, value: item.sL1Code }
                    })
                    setUbicacionDes(arrayUbicacion);
                } else {
                    setUbicacionDes([]);
                }
                console.log('ubicacion destino', ubicacionDes)
            }
        })
    }

    //METODOS PARA EL MASTER DETAILS IMPRESION ETIQUETAS
    const cargarMasterDetails = async () => {
        // Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        await axios.get(`${url}/api/MasterDetails/Get_PagedItems?Page=1`, { headers })
            .then(response => {
                setMasterDetails(response.data.OCRD)
            })
            .catch(error => {
                console.error('error', error);
            });
    }

    //METODO PARA EL MODULO DE DETALLE INVENTARIO Y CARGAR LAS LISTAS SERIES/LOTES PARA IMPRESION ETIQUETAS
    const fetchDataDetalleInvSL = async (ItemCode, WhsCode, GestionItem, IdCode, Accion) => {
        /* if (isLoading || allDataLoaded) {
            return;
        } */
        setData([])
        setDataComplete([])
        setIsLoading(true);

        // Set headers
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenInfo.token}`
        };
        // Make GET request
        axios.post(`${url}/api/Inventory/Get_Stock_Batchs_and_Serials`,
            {
                "ItemCode": ItemCode,
                "WhsCode": WhsCode,
                "GestionItem": GestionItem
            },
            { headers })
            .then(response => {
                const newData = response.data.SerialxManbach;
                if (newData != undefined) {
                    setData(newData)
                    setDataComplete(newData)
                    if (Accion == true) {
                        console.log('es true')
                        handleSearchDetalleInvSL(IdCode)
                    }
                } else {

                    Alert.alert('Info', `¡No hay ${GestionItem == 'L' ? 'Lotes' : 'Series'} en este almacen!`, [
                        {
                            text: 'OK', onPress: () => {
                            }
                        },
                    ]);
                }
                setIsLoading(false);
            })
            .catch(error => {
                setData([])
                setDataComplete([])
                setParamsDetalleInvSL([])
                setIsLoading(false)
            })



    };

    //METODO PARA FILTRO DE BUSQUEDA DEL MODULO DETALLE INVENTARIO SERIES Y LOTES
    const handleSearchDetalleInvSL = (text, accion) => {
        console.log(accion)
        if (text) {
            // Aplicar el filtro
            const filtered = dataComplete.filter(item => {
                return (
                    item.IdCode.toLowerCase().includes(text.toLowerCase())
                    // Agrega más condiciones según tus campos de búsqueda
                );
            });
            // Actualizar la lista filtrada
            setData(filtered);
            // Actualizar el estado de búsqueda
            setSearchDetalleInvSL(text);
        } else {
            setData(dataComplete)
            setSearchDetalleInvSL('')
            //fetchDataDetalleInvSL()
        }
    };

    //METODO PARA FILTRO DE BUSQUEDA DEL MODULO DETALLE INVENTARIO ARTICULOS NORMALES
    const handleSearchDetalleInv = (text, accion) => {
        if (text) {
            // Aplicar el filtro
            const filtered = dataCompleteDI.filter(item => {
                return (
                    item.ItemCode.toLowerCase().includes(text.toLowerCase())
                    // Agrega más condiciones según tus campos de búsqueda
                );
            });
            // Actualizar la lista filtrada
            setDataDetalleInv(filtered);
            // Actualizar el estado de búsqueda
            setSearchDetalleInv(text);
        } else {
            setDataDetalleInv(dataCompleteDI)
            setSearchDetalleInv('');
            fetchDataDetalleInv();
        }
    };

    //METODO PARA EL MODULO DE DETALLE INVENTARIO Y CARGAR ARTICULOS PARA IMPRESION ETIQUETAS
    const fetchDataDetalleInv = async () => {

        try {
            // Set headers
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenInfo.token}`
            };
            // Make GET request
            axios.get(`${url}/api/MasterDetails/Get_Items`, { headers })
                .then(response => {
                    const newData = response.data.OITM;
                    setDataDetalleInv(newData)
                    setDataCompleteDI(newData)
                })
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoading, setIsLoading, isLoadingTI, setIsLoadingTI,
                tokenInfo, setTokenInfo,
                conectarApi,
                menu,
                getData,
                user, setUser,
                pass, setPass,
                setUrl, url,
                setCompany, company,
                probarConexionApi,
                guardarDatosApi,
                Login,
                userInfo,
                logOut,
                getInventario,
                inventario,
                filteredDataSource, setFilteredDataSource,
                setMasterDataSource, masterDataSource,
                searchFilterFunction,
                search,
                getArticulos,
                searchFilterFunctionArticulos,
                filteredDataSourceArticulos, setFilteredDataSourceArticulos,
                setMasterDataSourceArticulos, masterDataSourceArticulos,
                searchArticulos, setSearchArticulos, inputScannerTI, setInputScannerTI, filtrarArticulo, selectedAlmacen, setSelectedAlmacen, setSelectedUbicacion, selectedUbicacion, selectedAlmacen2, setSelectedAlmacen2, selectedUbicacion2, selectedUbicacion2, setSelectedUbicacion2,
                searchBarcode, setSearchBarcode,
                filtrarBarcode,
                setSearchBarcode, searchBarcode,
                getAlmacenes,
                almacenes,
                obtenerUbicacionAlmacen,
                ubicacionItem, setUbicacionItem, ubicacionItem2, setUbicacionItem2,
                articulo, setArticulo, art,
                activarBuscadorConteoInv, setActivarBuscadorConteoInv,
                activarBuscadorArticulos, setActivarBuscadorArticulos,
                LimpiarPantallaConteoInventario,
                setIconoBuscarArticulos, iconoBuscarArticulos,
                setIndexTab, indexTab,
                filtrarSerie, serialsLotes, setSerialsLotes, contadorSerie, setArraySeries, verificarEscaneoSerie, textSerie, setTextSerie, moduloScan, setModuloScan, lote, setLote, verificarLote, guardarConteoLote,
                setIsLoadingItems, isLoadingItems, isLoadingCerrarConteo, setIsLoadingCerrarConteo, lotes, setLotes, cantidadSerieLote, setCantidadSerieLote, contadorClic, setContadorClic,
                FiltrarArticulosTraslado, barcodeItemTraslados, setBarcodeItemTraslados, itemsTraslados, setItemsTraslados, tablaItemsTraslados, setTablaItemsTraslados, itemTraslado, setItemTraslado, getItemsTraslados, setSerieLoteTransfer, serieLoteTransfer, ComprobarSerieLoteTransfer, filterListaSeriesLotes, setFilterListaSeriesLotes,
                searchFilterItemsTraslados, searchFilterItemsTrasladosEscan, enviarTransferencia, isModalTransferirSerieLote, setIsModalTransferirSerieLote, ActualizarSerieLoteTransfer, selectedUbicacionOri, setSelectedUbicacionOri, isModalUbicacion, setIsModalUbicacion, dataSerieLoteTransfer, setDataSerieLoteTransfer, cargarSeriesLotesDisp,
                listaSeriesLotes, setListaSeriesLotes, isModalSerieLote, setIsModalSerieLote, selectedUbicacionDes, setSelectedUbicacionDes, tablaSeriesLotesTransfer, setTablaSeriesLotesTransfer, cargarTablaSeriesLotesTransfer, seEscaneo, setSeEscaneo, ubicacionOrigen, ubicacionOri, setUbicacionOri, ubicacionDes, setUbicacionDes, ubicacionOri,
                setUbicacionOri, ubicacionDesOri, isEnter, setIsEnter, ubicacionDes, setUbicacionDes, masterDetails, setMasterDetails, cargarMasterDetails, datosScan, setDatosScan, fetchDataDetalleInvSL, data, setData, dataComplete, setDataComplete, allDataLoaded, setAllDataLoaded, dataDetalleInv, setDataDetalleInv, paramsDetalleInvSL, setParamsDetalleInvSL,
                searchDetalleInvSL, setSearchDetalleInvSL, handleSearchDetalleInvSL, searchDetalleInv, setSearchDetalleInv, handleSearchDetalleInv, dataCompleteDI, setDataCompleteDI, fetchDataDetalleInv, splitCadenaEscaner,
                idCodeSL, setIdCodeSL
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}