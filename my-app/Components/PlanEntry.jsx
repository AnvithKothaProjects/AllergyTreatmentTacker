import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import {React} from 'react';

function PlanEntry({ text, navigation, bigIndex, littleIndex, closeFunc, navFunc, obj }) {
    const {height, width} = useWindowDimensions();

    const style = new StyleSheet.create({
        text: {
            fontSize: 25,
        },
        view: {
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            marginLeft: 30,
            maxWidth: width*.75
        }
    })

    return (
        <View style={style.view}>
            <Text style={style.text}>{text + "  "}</Text>
            <Ionicons name='pencil' size={20} color='black' onPress={() => {
                navFunc(bigIndex, littleIndex, obj)
            }}/>
            <Ionicons name='close' size={20} color='black' onPress={() => {
                closeFunc(bigIndex, littleIndex)
            }}/>
        </View>
    )
}

export default PlanEntry