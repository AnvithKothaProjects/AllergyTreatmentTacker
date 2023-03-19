import React, { useState, useEffect, useRef } from 'react'
import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet, TextInput } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Device from 'expo-device';
import Checkbox from 'expo-checkbox';

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

    return (
        <View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: height*.06}}>
                <Text style={{fontSize: 20, marginBottom: height*.03}}>Choose Day</Text>
                <DateTimePicker value={date} mode={'date'}
                onChange={(event, date) => {
                    setDate(date)
                    let str = createString(date)
                    setIndex(checkList(datePlan, str))
                }}/>
            </View>
            <ScrollView contentContainerStyle={{maxHeight: height*.5, alignItems: 'center', marginTop: height*.05}}>
                {bigInd == -1 && <Text>Nothing for this date</Text>}
                {bigInd != -1 && datePlan[bigInd][1].map((item, index) => (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{marginRight: width*.01}}>{item[0]}</Text>
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
            </ScrollView>
        </View>
        
    )
}

export default PlanPerDay