import React, { useState, useEffect, useRef } from 'react'
import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet, TextInput, Touchable } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import myStyles from '../styles'

function MyBtn ({text, press}) {
    const {height, width} = useWindowDimensions();

    return (
        <TouchableOpacity onPress={() => press()} style={[myStyles.btn, {marginBottom: height*.01, marginTop: height*.01}]}>
            <Text style={myStyles.btnText}>{text}</Text>
        </TouchableOpacity>
    )
}

export default MyBtn 