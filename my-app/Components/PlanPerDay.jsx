import React, { useState, useEffect, useRef } from 'react'
import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet, TextInput } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Device from 'expo-device';
import Checkbox from 'expo-checkbox';
import CalendarPicker from 'react-native-calendar-picker';
import BackgroundImg from './BackgroundImg';

function PlanPerDay({ navigation, route }) {
    const [date, setDate] = useState(new Date());
    const {height, width} = useWindowDimensions();
    const [datePlan, setDatePlan] = useState([])
    const [bigInd, setIndex] = useState(-1)
    const [bs, setBs] = useState('')

    useEffect(() => {
        const func = async () => {
            let obj = await AsyncStorage.getItem("dates")
            await setDatePlan(JSON.parse(obj))
            let str = createString(new Date())
            setIndex(checkList(JSON.parse(obj), str))
        }

        func()
        
    }, [])

    function myBs() {
        if (bs == '') setBs('f')
        else setBs('')
    }

    function createString(date) {
        var str = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
        return str
    }

    function checkList(list, str) {
        for (let i=0; i<list.length; i++) {
            if (list[i][0] == str) return i
        }
        return -1
    }

    function dateStyles(currDate) {
        var str = "#969590"

        let newDate = new Date(currDate)

        let index = checkList(datePlan, createString(newDate))
        if (index != -1 && datePlan[index][1].length != 0) {
            var numFalse = 0;

            for (let i=0; i<datePlan[index][1].length; i++) {
                if (!datePlan[index][1][i][1]) numFalse++
            }

            if (numFalse == 0) str = "#4ca860" //green
            else if (numFalse == datePlan[index][1].length) str = "#a84c4c" //red
            else {
                let ratio = numFalse/datePlan[index][1].length

                if (ratio > .75) str = "#965e50"
                else if (ratio > .5) str = "#837154"
                else if (ratio > .25) str = "#819358"
                else str = "#678662"
            }
        }


        if (createString(newDate) == createString(date)) return {
            containerStyle: [],
            style: {backgroundColor: str, borderWidth: 3},
            textStyle: {color: 'black'},
            allowDisabled: true
        }

        return {
            containerStyle: [],
            style: {backgroundColor: str},
            textStyle: {color: 'black'},
            allowDisabled: true
        }
    }

    return (
        <View style={{flex: 1, height: height}}>
            <BackgroundImg></BackgroundImg>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: height*.06}}>
                <Text style={{fontSize: 20, marginBottom: height*.03}}>Choose Day</Text>
                <CalendarPicker
                customDatesStyles={(date) => dateStyles(date)} onDateChange={(date) => {
                    let newDate = new Date(date)

                    setDate(newDate)
                    let str = createString(newDate)
                    setIndex(checkList(datePlan, str))
                }}/>
            </View>
            <ScrollView contentContainerStyle={{alignItems: 'center', marginTop: height*.05, }}>
                {bigInd == -1 && <Text>Nothing for this date</Text>}
                {bigInd != -1 && datePlan[bigInd][1].map((item, index) => (
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: index != datePlan[bigInd][1].length-1 ? height*.03 : height*.1, }} key={index}>
                        <Text style={{marginRight: width*.01, fontSize: 25,}}>{item[0]}</Text>
                        <Checkbox value={datePlan[bigInd][1][index][1]} onValueChange={() => {
                            let newArr = datePlan
                            newArr[bigInd][1][index][1] = !newArr[bigInd][1][index][1]

                            const func = async () => {
                                await AsyncStorage.setItem("dates", JSON.stringify(newArr))
                            }
                            func()

                            setDatePlan(newArr)
                            myBs()
                        }}/>
                    </View>
                ))}
                {/* <Button title='Print' onPress={() => {
                    const func = async () => {
                        let jsonValue = await AsyncStorage.getItem("latestPlan")
                        console.log(JSON.parse(jsonValue).plan)
                    }

                    func()
                }}></Button> */}
            </ScrollView>

            <View style={{position: 'absolute', top: height*.7, right: width*.04}}>
                <Ionicons name="list-circle" size={60}onPress={() => {
                    navigation.replace("ShowPlan", {comingFromCalendar: true})
                }}></Ionicons>
                <Ionicons name="camera-reverse" size={60} onPress={() => {
                    navigation.replace("AddImages", {comingFromCalendar: true})
                }}></Ionicons>
            </View>

            
        </View>
        
    )
}

export default PlanPerDay