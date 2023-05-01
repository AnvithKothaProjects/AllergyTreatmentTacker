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
    const [perWeek, setPerWeek] = useState(obj.dosingPerWeek)
    const [keepGoing, setContinue] = useState(obj.dosingAfter)
    const [chosenDays, setDays] = useState(boolToNumArray(obj.days))
    const [time, setTime] = useState(obj.time == null ? new Date() : new Date(obj.time))
    const [weekInd, setWeek] = useState(obj.dosingPerWeek.length > 0 ? 0 : -1)

    const {height, width} = useWindowDimensions();
    const [bs, setBs] = useState("")
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday   ", "Thursday", "Friday", "Saturday"]
    const [newVal, changeNewVal] = useState("")

    // const [quantityBox, changeQuantity] = useState("")
    // const [unitsBox, changeUnits] = useState("")

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
        newObj.time = time
        newObj.foodType = obj.foodType

        // console.log(newObj.days)

        return newObj
    }

    useEffect(() => {
        // console.log(chosenDays)
    }, [obj, bigInd, smallInd])

    function giveWeekIndex() {
        if (weekInd != -1) return weekInd
        return 0
    }

    function pickerMargin() {
        if (perWeek.length == 0) return -height*.1

        var ind = weekInd == -1 ? 0 : weekInd

        var numBelow = perWeek.length - ind - 1

        if (numBelow == 0) {return -height*.08}
        else if (numBelow == 1) {return -height*.04}
        else if (numBelow == 2) {return 0}

        return 0
    }

    return (
        <ScrollView>   

            <View style={{flexDirection: 'row', justifyContent:'center'}}>
                <View style={{marginTop: height*.09, flexDirection: 'row', alignItems: 'center', marginLeft: width*.04}}>
                    <Text>{bigInd == 3 ? "Medicine Name: " : "Food Name: "}</Text>
                    <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.01}} placeholder={food == "" ? "Enter Food" : food} onChangeText={(val) => {
                        setFood(val)
                        myBs()
                    }}/>
                </View>
            </View>

            <View style={{marginLeft: width*.04,  marginTop: height*.035, justifyContent: 'center', maxWidth: width*.9,}}>
                <Text style={{ textAlign: 'center', fontSize: 25, marginBottom: perWeek.length == 0 ? height*.04 : -height*.05}}>{"Dosing per Week"}</Text>

                {perWeek.length == 0 && <Text style={{ textAlign: 'center', fontSize: 15, marginBottom: -height*.1}}>{"No Weeks Yet"}</Text>}
                <Picker style={{marginBottom: pickerMargin(), marginTop: (weekInd > 1 ? height*.03 : 0)}} selectedValue={weekInd} onValueChange={(itemVal, itemInd) => {
                    setWeek(itemInd)
                    myBs()
                }}>
                    {perWeek.map((elem, index) => (
                        <Picker.Item label={"Week " + (index+1)} value={index} key={index}/>
                    ))}
                </Picker>

                {perWeek.length > 0 && <View style={{ alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text>{"Dose Quantity: "}</Text>  
                        <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.006}} value={"" + perWeek[giveWeekIndex()]} onChangeText={(val) => {
                            let arr = perWeek
                            arr[giveWeekIndex()] = val
                            setPerWeek(arr)
                            myBs()
                        }}/>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center' }}>
                        <Text>{"Dose Units: "}</Text>
                        <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.006}} placeholder={"" + units[giveWeekIndex()]} value={units[giveWeekIndex()]} onChangeText={(val) => {
                            let arr = units

                            let initInd = giveWeekIndex();
                            let initVal = arr[initInd]

                            for (let i=initInd; i<perWeek.length; i++) {
                                if (arr[i] == initVal) arr[i] = val
                                else break
                            }

                            setUnits(arr)
                            myBs()
                        }}/>
                    </View>
                </View>}

                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Button title={"Add Week"} onPress={() => {
                        let newArr = perWeek
                        if (newArr.length > 0) newArr.push(newArr[newArr.length-1])
                        else newArr.push(0)
                        setPerWeek(newArr)

                        let arr = units
                        if (arr.length > 0) arr.push(arr[arr.length-1])
                        else arr.push("None")
                        setUnits(arr)

                        myBs()
                    }}/>
                    <Button title={"Remove Week"} onPress={() => {
                        let arr = perWeek
                        if (arr.length > 0) arr.splice(arr.length-1, 1)
                        setPerWeek(arr)

                        arr = units
                        if (arr.length > 0) arr.splice(arr.length-1, 1)
                        setUnits(arr)

                        myBs()
                    }}/>

                    <Button title='Print' onPress={() => {
                        console.log(perWeek)
                        console.log(units)
                    }}/>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: height*.05}}>
                <Text style={{fontSize: 20}}>{"Continue Highest Dosage:  "}</Text>
                <Checkbox value={keepGoing}
                    onValueChange={setContinue}
                    justifyContent={'center'}
                />
            </View>

            <View style={styles.bigFrequencyView}>
                <View style={styles.frequencyView}>
                    <Text style={styles.frequencyLabel}>Specify Days</Text>
                    <View style={{marginTop: width*.13}}>
                        <CustomMultiPicker
                            options={days}
                            search={false}
                            multiple={true}
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
                </View>

            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize: 20}}>{"Specify Time: "}</Text>
                <DateTimePicker value={new Date(time)} mode={'time'} onChange={(event, date) => setTime(date.getTime())}
                style={{alignSelf:'center'}}/>
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