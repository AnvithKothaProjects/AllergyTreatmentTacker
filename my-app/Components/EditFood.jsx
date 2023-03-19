import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet, TextInput } from 'react-native'
import { useState, useEffect, useRef, useCallback } from 'react'
import {Picker} from '@react-native-picker/picker'
import CustomMultiPicker from "react-native-multiple-select-list";
import Ionicons from '@expo/vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import foodPlan from '../Objects/foodPlan'
import { NavigationContainer, StackActions, NavigationActions, route } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'  

function EditFood({ navigation, route }) {
    const { bigInd, smallInd, obj } = route.params

    const [food, setFood] = useState(obj.food)
    const [units, setUnits] = useState(obj.units)
    const [perWeek, setWeeks] = useState(obj.dosingPerWeek)
    const [keepGoing, setContinue] = useState(obj.dosingAfter)
    const [chosenDays, setDays] = useState(boolToNumArray(obj.days))
    const [showTime, setShowTime] = useState(obj.timeSpecified)
    const [time, setTime] = useState(obj.time == null ? new Date() : new Date(obj.time))

    const [selectedFrequency, setFrequency] = useState(chosenDays.length == 7 ? "Daily" : "Other");
    const {height, width} = useWindowDimensions();
    const [bs, setBs] = useState("")
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday   ", "Thursday", "Friday", "Saturday"]
    const [newVal, changeNewVal] = useState("")

    function boolToNumArray(arr) {
        let newArr = []

        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                newArr.push("" + i)
            }
        }

        return newArr
    }

    function numArrayToBool(arr) {
        let newArr = [false, false, false, false, false, false, false]

        for (let i = 0; i < arr.length; i++) {
            newArr[parseInt(arr[i])] = true
        }

        if (selectedFrequency == "Daily") newArr = [true, true, true, true, true, true, true]

        return newArr
    }

    function isEqual(a, b) {
        if (a.length != b.length) return false
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) return false
        }
        return true
    }
 
    const styles = StyleSheet.create({
        picker: {
            width: width*.4,
        },
        frequencyLabel: {
            marginTop: height*.1,
            marginBottom: -height*.05,
            fontSize: 20,
        },
        frequencyView: {
            alignItems: 'center',
            flex: 1,
        }, 
        bigFrequencyView: {
            flexDirection: 'row',
            maxHeight: height*.5,
            marginTop: -height*.05,
            zIndex: -1,
        },
    })

    const myBs = () => {
        if (bs == "") {
            setBs(" ")
        } else setBs("")
    }

    const makeObj = () => {
        let newObj = new foodPlan()
        newObj.food = food
        newObj.units = units
        newObj.dosingPerWeek = perWeek
        newObj.dosingAfter = keepGoing
        newObj.days = numArrayToBool(chosenDays)
        newObj.timeSpecified = showTime
        newObj.time = time

        // console.log(newObj.days)

        return newObj
    }

    useEffect(() => {
        // console.log(chosenDays)
    }, [obj, bigInd, smallInd])

    return (
        <ScrollView>   

            <View style={{flexDirection: 'row'}}>
                <View style={{marginTop: height*.09, flexDirection: 'row', alignItems: 'center', flex: 1.2, marginLeft: width*.04}}>
                    <Text>{bigInd == 3 ? "Medicine Name: " : "Food Name: "}</Text>
                    <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.01}} placeholder={food == "" ? "Enter Food" : food} onChangeText={(val) => {
                        setFood(val)
                        myBs()
                    }}/>
                </View>

                <View style={{marginTop: height*.09, flexDirection: 'row', alignItems: 'center', flex: 1}}>
                    <Text>Dose Units: </Text>
                    <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.01}} placeholder={units == "" ? "None" : units} onChangeText={(val) => {
                        setUnits(val)
                        myBs()
                    }}/>
                </View>
            </View>

            <View style={{marginLeft: width*.04,  marginTop: height*.035, justifyContent: 'center'}}>
                {perWeek.map((item, index) => (
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} key={index}>
                        <Text key={index} style={[{marginBottom: height*.02, fontSize: 20, paddingTop:height*.02}, {}]}>{"Week " + (index+1) + ": " + item + "  "}</Text>
                        <Ionicons name='close' size={25} color='black' onPress={() => {
                            let newArr = perWeek
                            newArr.splice(index, 1)
                            setWeeks(newArr)
                            myBs()
                        }}/>
                    </View>
                ))}

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{marginBottom: height*.01, fontSize: 20, paddingTop:height*.02}}>{"Week " + (perWeek.length+1) + ":  "}</Text>
                    <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.01, marginRight: width*.03}} placeholder="0" onChangeText={(val) => changeNewVal(val)}/>
                    <Ionicons name='checkmark-outline' size={25} color='black' onPress={() => {
                        let newArr = perWeek
                        newArr.push(newVal)
                        setWeeks(newArr)
                        myBs()
                    }}/>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: height*.05}}>
                <Text style={{fontSize: 20}}>{"Maintain dosing afterwards:  "}</Text>
                <Checkbox value={keepGoing}
                    onValueChange={setContinue}
                    justifyContent={'center'}
                />
            </View>

            <View style={styles.bigFrequencyView}>

                <View style={styles.frequencyView}>
                    <Text style={styles.frequencyLabel}>Frequency</Text>
                    <Picker selectedValue={selectedFrequency} onValueChange={(itemValue, itemIndex) => {
                        setFrequency(itemValue)
                    }} style={styles.picker}>

                        <Picker.Item label="Daily" value="Daily" />
                        <Picker.Item label="Weekly" value="Weekly" />  
                        <Picker.Item label="Other" value="Other" />
                    
                    </Picker>

                    <View style={{marginTop: -height*.02, flexDirection: 'row', alignItems: 'center', minHeight: height*.05}}>
                        <Text style={{fontSize: 20}}>{"Specify Time:  "}</Text>
                        <Checkbox value={showTime}
                            onValueChange={(val) => setShowTime(val)}
                            justifyContent={'center'}
                        />
                    </View>
                    
                    {showTime && <DateTimePicker value={new Date(time)} mode={'time'} onChange={(event, date) => setTime(date.getTime())}></DateTimePicker>}
                </View>

                {selectedFrequency != 'Daily'  && <View style={styles.frequencyView}>
                    <Text style={styles.frequencyLabel}>Specify Days</Text>
                    <View style={{marginTop: width*.13}}>
                        <CustomMultiPicker
                            options={days}
                            search={false}
                            multiple={selectedFrequency!='Weekly'}
                            callback={(res)=>{
                                setDays(res)
                            }}
                            iconColor={"#000000"}
                            iconSize={15}
                            selectedIconName={"ios-checkmark-circle-outline"}
                            unselectedIconName={"ios-radio-button-off-outline"}
                            selected={chosenDays}
                            rowHeight={30}
                            scrollViewHeight={100}
                            returnValue={"value"}
                        />
                    </View>


                </View>}
            </View>

            <View style={{marginBottom: height*.1, marginTop: height*.02}}>
                <Button title={"Done"} style={{}} onPress={() => {
                    navigation.navigate("ShowPlan", {bigInd: bigInd, smallInd: smallInd, obj: makeObj(), firstTime: false})
                }}></Button>
            </View>
            
        </ScrollView>
    )
}

export default EditFood