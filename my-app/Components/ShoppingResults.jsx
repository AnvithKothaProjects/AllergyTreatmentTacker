import React, { useState, useEffect, useRef } from 'react'
import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet, TextInput, Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShoppingResults({ navigation, route }) {
    const [list, setList] = useState([])
    const {height, width} = useWindowDimensions();

    useEffect(() => {
        async function fetchData() {
            let list = await AsyncStorage.getItem("api")

            if (list != null) {
                let obj = JSON.parse(list)
                setList(obj)
            }
        }

        fetchData()
        
    }, [])

    function viewStyle(ind) {
        if (ind >= 3) return {}
        return {marginBottom: height*.03, width: width*.8, padding: width*.05, 
        borderWidth: 3, borderRadius: 20}
    }

    function updateStr(string) {
        if (string.length < 25) return string
        return string.substring(0, 24) + "..."
    }

    return (
        <ScrollView style={{marginTop: height*.1}}>
            <View style={{alignItems: 'center'}}>
                {list.length == 0 && <Text>{"Specify some treatment foods!"}</Text>}
                {list.length != 0 && <View>
                    {list.map((foodList, foodInd) => (
                        <View key={foodInd}>
                            {foodList.map((searchResult, searchInd) => (
                                <View style={viewStyle(searchInd)} key={searchInd}>
                                    {searchInd < 3 && <View>
                                        <Text style={{fontSize: 20}}>{updateStr(searchResult.title)}</Text>

                                        <Text>{"Price: " + searchResult.price}</Text>

                                        <Button title='Go to Website' onPress={() => {
                                            console.log("hi")
                                            async function openUrl() {
                                                const supported = await Linking.canOpenURL(searchResult.detailPageURL);

                                                if (supported) {
                                                    await Linking.openURL(searchResult.detailPageURL);
                                                }
                                            }
                                            openUrl()
                                        }}></Button>
                                    </View>}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>}
            </View>
            
        </ScrollView>
    )
}