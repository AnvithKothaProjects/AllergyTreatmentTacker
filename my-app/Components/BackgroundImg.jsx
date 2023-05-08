import { Button, Image, View, Text, useWindowDimensions, ImageBackground } from 'react-native'
import { useState, useEffect } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import {React} from 'react';

function BackgroundImg() {
    const {height, width} = useWindowDimensions();

    return (
        <ImageBackground source={require("../assets/Background.png")} style={{width: '100%', height: '100%', position: 'absolute', opacity: .05}}>

        </ImageBackground>
    )
}

export default BackgroundImg