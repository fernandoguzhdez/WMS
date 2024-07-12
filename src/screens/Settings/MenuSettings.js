import React, { useState } from 'react';
import { SectionList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

const MenuSettings = ({ navigation }) => {
    const [collapsedSections, setCollapsedSections] = useState({});
    const [collapsedSubItems, setCollapsedSubItems] = useState({});

    const toggleSection = (section) => {
        setCollapsedSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const toggleSubItem = (subItem) => {
        setCollapsedSubItems((prevState) => ({
            ...prevState,
            [subItem]: !prevState[subItem],
        }));
    };

    const DATA = [
        {
            title: 'Editar Etiquetas',
            data: [
                {
                    key: 'Inventario',
                    icon: 'inventory',
                    color: '#000',
                    subItems: [
                        {
                            key: 'Conteo de inventario',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                        {
                            key: 'Solicitud de transferencia',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                        {
                            key: 'Detalle de inventario',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                    ],
                },
                {
                    key: 'Compras',
                    icon: 'shopping-cart',
                    color: '#333399',
                    subItems: [
                        {
                            key: 'Sub-Item1',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                        {
                            key: 'Sub-Item2',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                        {
                            key: 'Sub-Item3',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                    ],
                },
                {
                    key: 'Ventas',
                    icon: 'paid',
                    color: '#008000',
                    subItems: [
                        {
                            key: 'Sub-Item1',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                        {
                            key: 'Sub-Item2',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                        {
                            key: 'Sub-Item3',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                    ],
                },
                {
                    key: 'Produccion',
                    icon: 'construction',
                    color: '#FF0000',
                    subItems: [
                        {
                            key: 'Orden de fabricacion',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Sub Sub Item 1', onPress: () => { } },
                                { key: 'Sub Sub Item 2', onPress: () => { } },
                            ],
                        },
                        {
                            key: 'Recibo de produccion',
                            onPress: () => { },
                            subSubItems: [
                                { key: 'Documentos', onPress: () => { navigation.navigate('ConfigEtiquetasDocsReciboProd') } },
                                { key: 'Series y lotes', onPress: () => { } },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const renderSubSubItem = (subSubItem) => (
        <TouchableOpacity key={subSubItem.key} style={styles.subSubItem} onPress={subSubItem.onPress}>
            <Text style={styles.subSubItemText}>{subSubItem.key}</Text>
        </TouchableOpacity>
    );

    const renderSubItem = (subItem) => (
        <View key={subItem.key}>
            <TouchableOpacity style={styles.subItem} onPress={() => toggleSubItem(subItem.key)}>
                <Text style={styles.subItemText}>{subItem.key}</Text>
                <Icon
                    name={collapsedSubItems[subItem.key] ? 'minus' : 'plus'}
                    type='font-awesome'
                    size={20}
                    iconStyle={styles.chevron}
                />
            </TouchableOpacity>
            <Collapsible collapsed={!collapsedSubItems[subItem.key]}>
                {subItem.subSubItems.map(renderSubSubItem)}
            </Collapsible>
        </View>
    );

    const renderItem = ({ item }) => (
        <View key={item.key}>
            <TouchableOpacity style={styles.item} onPress={() => toggleSection(item.key)}>
                <Icon
                    name={item.icon}
                    type='material-icons'
                    size={24}
                    style={styles.icon}
                    iconStyle={{ color: item.color }}
                />
                <Text style={styles.title}>{item.key}</Text>
                <Icon
                    name={collapsedSections[item.key] ? 'chevron-down' : 'chevron-right'}
                    type='font-awesome'
                    size={20}
                    iconStyle={styles.chevron}
                />
            </TouchableOpacity>
            <Collapsible collapsed={!collapsedSections[item.key]}>
                {item.subItems.map(renderSubItem)}
            </Collapsible>
        </View>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.header}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item.key + index}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 10,
    },
    listContainer: {
        paddingVertical: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 5,
    },
    icon: {
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        flex: 1,
    },
    chevron: {
        color: '#c7c7cc',
    },
    sectionHeaderContainer: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 20,
        color: '#6d6d72',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginLeft: 10,
    },
    sectionSeparator: {
        height: 0,
        backgroundColor: '#f2f2f2',
    },
    subItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row'
    },
    subItemText: {
        fontSize: 14,
        color: '#6d6d72',
        flex: 1,
    },
    subSubItem: {
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    subSubItemText: {
        fontSize: 12,
        color: '#6d6d72',
    },
});

export default MenuSettings;
