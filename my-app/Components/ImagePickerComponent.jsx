import * as ImagePicker from 'expo-image-picker'
import React, { useState, useEffect } from 'react'
import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet } from 'react-native'
import ImageDisplay from './ImageDisplay'
import { NavigationContainer, StackActions, NavigationActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack'
import callGoogleVision from '../helper.js'

function ImagePickerComponent ({navigation}) {
    const [image, setImage] = useState([])
    const [text, setText] = useState('Please add an image')
    const [bs, myBs] = useState()
    const [loading, myLoading] = useState(false)
    
    const [str, setStr] = useState("f")

    const {height, width} = useWindowDimensions()

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true, //return base64 data.
          //this will allow the Vision API to read this image.
        });
        if (!result.canceled) {
            image.push([result.uri, result.base64])
            setImage(image)

            if (str == "f") setStr("");
            if (str == "") setStr("f")
        }
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: width,
        },
    });

    const remove = (index) => {
        var newImage = image
        newImage.splice(index, 1)
        setImage(newImage)
        
        if (bs=='') myBs('f')
        else myBs('')
    }

    if (!loading) return (
        <View style={styles.container}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />

            <ScrollView horizontal={true} style={{width: width*.9, 
                maxHeight: 120, borderColor: '000000', borderWidth: 2, borderRadius: 10, padding: 5, maxWidth: width*.9,}} 
                contentContainerStyle={"center"}>

                {image.map((elem, index) => (
                    <ImageDisplay picture={elem[0]} key={index} func={remove} index={index}></ImageDisplay>
                ))}
            </ScrollView>
            <Button title={'Submit'} onPress={async () => {
                setText('Loading...')
                myLoading(true)
                const responseData = await callGoogleVision(image);
                // console.log(responseData)
                navigation.navigate('ShowPlan', {data: responseData, comingFromHelper: true})
            }}></Button>
            <Button title={"Straight to screen"} onPress={() => {
                navigation.navigate('ShowPlan')
            }}/>
            <Button title={"Erase Storage"} onPress={() => {
                AsyncStorage.clear()
            }}/>
            

            <Text style={{textAlign: 'center', marginTop: 10, overflow: 'scroll', maxHeight: 200, maxWidth: width*.8}}>{text}</Text>
        </View>
    ) 
    return (
        <View style={{alignItems: 'center'}}>
            <Text style={{marginTop: height*.5}}>{"Loading..."}</Text>
        </View>
    )
}

export default ImagePickerComponent 