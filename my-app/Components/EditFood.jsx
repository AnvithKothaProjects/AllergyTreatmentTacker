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
import colors from '../colors';
import myStyles from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler';

function EditFood({ navigation, route }) {
    const { bigInd, smallInd, obj, data, fromCalendar } = route.params

    const [food, setFood] = useState(obj.food)
    const [units, setUnits] = useState(obj.units)
    const [perWeek, setPerWeek] = useState(obj.dosingPerWeek)
    const [keepGoing, setContinue] = useState(obj.dosingAfter)
    const [chosenDays, setDays] = useState(obj.days)
    const [time, setTime] = useState(obj.time == null ? new Date() : new Date(obj.time))
    const [weekInd, setWeek] = useState(obj.dosingPerWeek.length > 0 ? 0 : -1)

    const {height, width} = useWindowDimensions();
    const [bs, setBs] = useState("")
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // const [quantityBox, changeQuantity] = useState("")
    // const [unitsBox, changeUnits] = useState("")

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
        newObj.days = chosenDays
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

    function addWeek() {
        let newArr = perWeek
        if (newArr.length > 0) newArr.push(newArr[newArr.length-1])
        else newArr.push(0)
        setPerWeek(newArr)

        let arr = units
        if (arr.length > 0) arr.push(arr[arr.length-1])
        else arr.push("None")
        setUnits(arr)

        myBs()
    }

    function removeWeek() {
        let arr = perWeek
        if (arr.length > 0) arr.splice(arr.length-1, 1)
        setPerWeek(arr)

        arr = units
        if (arr.length > 0) arr.splice(arr.length-1, 1)
        setUnits(arr)

        if (perWeek.length == 0) setContinue(false)

        myBs()
    }

    return (
        // <ScrollView>   

        //     <View style={{flexDirection: 'row', justifyContent:'center'}}>
        //         <View style={{marginTop: height*.09, flexDirection: 'row', alignItems: 'center', marginLeft: width*.04}}>
        //             <Text>{bigInd == 3 ? "Medicine Name: " : "Food Name: "}</Text>
        //             <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.01}} placeholder={food == "" ? "Enter Food" : food} onChangeText={(val) => {
        //                 setFood(val)
        //                 myBs()
        //             }}/>
        //         </View>
        //     </View>

        //     <View style={{marginLeft: width*.04,  marginTop: height*.035, justifyContent: 'center', maxWidth: width*.9,}}>
        //         <Text style={{ textAlign: 'center', fontSize: 25, marginBottom: perWeek.length == 0 ? height*.04 : -height*.05}}>{"Dosing per Week"}</Text>

        //         {perWeek.length == 0 && <Text style={{ textAlign: 'center', fontSize: 15, marginBottom: -height*.1}}>{"No Weeks Yet"}</Text>}
        //         <Picker style={{marginBottom: pickerMargin(), marginTop: (weekInd > 1 ? height*.03 : 0)}} selectedValue={weekInd} onValueChange={(itemVal, itemInd) => {
        //             setWeek(itemInd)
        //             myBs()
        //         }}>
        //             {perWeek.map((elem, index) => (
        //                 <Picker.Item label={"Week " + (index+1)} value={index} key={index}/>
        //             ))}
        //         </Picker>

        //         {perWeek.length > 0 && <View style={{ alignItems: 'center'}}>
        //             <View style={{flexDirection: 'row', alignItems: 'center'}}>
        //                 <Text>{"Dose Quantity: "}</Text>  
        //                 <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.006}} value={"" + perWeek[giveWeekIndex()]} onChangeText={(val) => {
        //                     let arr = perWeek
        //                     arr[giveWeekIndex()] = val
        //                     setPerWeek(arr)
        //                     myBs()
        //                 }}/>
        //             </View>

        //             <View style={{flexDirection: 'row', alignItems: 'center' }}>
        //                 <Text>{"Dose Units: "}</Text>
        //                 <TextInput style={{borderWidth: 1, borderRadius: 5, padding: height*.006}} placeholder={"" + units[giveWeekIndex()]} value={units[giveWeekIndex()]} onChangeText={(val) => {
        //                     let arr = units

        //                     let initInd = giveWeekIndex();
        //                     let initVal = arr[initInd]

        //                     for (let i=initInd; i<perWeek.length; i++) {
        //                         if (arr[i] == initVal) arr[i] = val
        //                         else break
        //                     }

        //                     setUnits(arr)
        //                     myBs()
        //                 }}/>
        //             </View>
        //         </View>}

        //         <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        //             <Button title={"Add Week"} onPress={() => {
        //                 let newArr = perWeek
        //                 if (newArr.length > 0) newArr.push(newArr[newArr.length-1])
        //                 else newArr.push(0)
        //                 setPerWeek(newArr)

        //                 let arr = units
        //                 if (arr.length > 0) arr.push(arr[arr.length-1])
        //                 else arr.push("None")
        //                 setUnits(arr)

        //                 myBs()
        //             }}/>
        //             <Button title={"Remove Week"} onPress={() => {
        //                 let arr = perWeek
        //                 if (arr.length > 0) arr.splice(arr.length-1, 1)
        //                 setPerWeek(arr)

        //                 arr = units
        //                 if (arr.length > 0) arr.splice(arr.length-1, 1)
        //                 setUnits(arr)

        //                 myBs()
        //             }}/>

        //             {/* <Button title='Print' onPress={() => {
        //                 console.log(perWeek)
        //                 console.log(units)
        //             }}/> */}
        //         </View>
        //     </View>
            
        //     <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: height*.05}}>
        //         <Text style={{fontSize: 20}}>{"Continue Highest Dosage:  "}</Text>
        //         <Checkbox value={keepGoing}
        //             onValueChange={setContinue}
        //             justifyContent={'center'}
        //         />
        //     </View>

        //     <View style={styles.bigFrequencyView}>
        //         <View style={styles.frequencyView}>
        //             <Text style={styles.frequencyLabel}>Specify Days</Text>
        //             <View style={{marginTop: width*.13}}>
        //                 <CustomMultiPicker
        //                     options={days}
        //                     search={false}
        //                     multiple={true}
        //                     callback={(res)=>{
        //                         setDays(res)
        //                     }}
        //                     iconColor={"#000000"}
        //                     iconSize={15}
        //                     selectedIconName={"ios-checkmark-circle-outline"}
        //                     unselectedIconName={"ios-radio-button-off-outline"}
        //                     selected={chosenDays}
        //                     rowHeight={30}
        //                     scrollViewHeight={100}
        //                     returnValue={"value"}
        //                 />
        //             </View>
        //         </View>

        //     </View>

        //     <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
        //         <Text style={{fontSize: 20}}>{"Specify Time: "}</Text>
        //         <DateTimePicker value={new Date(time)} mode={'time'} onChange={(event, date) => setTime(date.getTime())}
        //         style={{alignSelf:'center'}}/>
        //     </View>
            

        //     <View style={{marginBottom: height*.1, marginTop: height*.02}}>
        //         <Button title={"Done"} style={{}} onPress={() => {
        //             navigation.replace("ShowPlan", {bigInd: bigInd, smallInd: smallInd, obj: makeObj(), shouldRetrieve: false, data: data, comingFromHelper: true})
        //         }}></Button>
        //     </View>
            
        // </ScrollView>
        
        <View style={{height: height}}>
            <ScrollView style={{marginTop: height*.08, marginLeft: width*.03, marginRight: width*.03}}>
                <View style={[myStyles.bigView, {marginBottom: height*.015}]}>
                    <View style={{marginLeft: width*.03}}>

                        <Text style={[myStyles.gray, myStyles.mainHeader, {marginTop: height*.01}]}>{"Name and Dosing"}</Text>

                        <View style={[{marginRight: width*.02, marginVertical: height*.01}, myStyles.miniView]}>
                            <Text style={[myStyles.white, myStyles.text, {marginVertical: height*.02, marginLeft: width*.02}]}>{"Dose Name:  "}</Text>
                            <TextInput style={[{padding: height*.01, flex: .9,}, myStyles.textInp]} placeholder={food == "" ? "Enter Food" : food} onChangeText={(val) => {
                                setFood(val)
                                myBs()
                                console.log(chosenDays)
                            }}/>
                        </View>   

                        <View style={[myStyles.miniView, {marginVertical: height*.01,}]}>
                            <View style={{marginLeft: width*.02, width: '90%'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={[myStyles.white, myStyles.text, {marginVertical: height*.02,}]}>{"Weekly Dosing:  "}</Text>

                                    <TouchableOpacity style={{backgroundColor: colors.darkBlue, borderColor: colors.white, borderWidth: 1, paddingHorizontal: width*.01,
                                    borderBottomLeftRadius: 20, borderTopLeftRadius: 20, transform: [{translateX: width*.003}]}} onPress={removeWeek}>
                                        <Ionicons name='remove-outline' size={23} color={colors.white}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{backgroundColor: colors.darkBlue, borderColor: colors.white, borderWidth: 1, paddingHorizontal: width*.01,
                                    borderBottomRightRadius: 20, borderTopRightRadius: 20}} onPress={addWeek}>
                                        <Ionicons name='add' size={23} color={colors.white}/>
                                    </TouchableOpacity>
                                </View>
                                

                                {/* <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor: colors.darkBlue}}>
                                    <Text style={{color: colors.white, fontSize: 17}}>{"Add Week"}</Text>
                                </TouchableOpacity> */}
                                <View style={{marginLeft: width*.03}}>
                                {perWeek.map((elem, index) => (
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: height*.02, flex: 1,}}>
                                        <Text style={[myStyles.miniText, myStyles.white]}>{"Week " + (index+1)}</Text>

                                        <View style={{alignItems: 'center', flex: 1,}}>
                                            <Text style={[myStyles.tinyText, myStyles.white]}>{"Dose Quantity"}</Text>  

                                            <TextInput style={[myStyles.textInp, {padding: 5, width: '80%'}]} value={"" + perWeek[index]} onChangeText={(val) => {
                                                let arr = perWeek
                                                arr[index] = val
                                                setPerWeek(arr)
                                                myBs()
                                            }}/>
                     
                                        </View>

                                        <View style={{alignItems: 'center', flex: 1,}}>
                                            <Text style={[myStyles.tinyText, myStyles.white]}>{"Dose Units"}</Text>

                                            <TextInput style={[myStyles.textInp, {padding: 5, width: '80%'}]} placeholder={"" + units[index]} value={units[index]} onChangeText={(val) => {
                                                let arr = units

                                                let initInd = index;
                                                let initVal = arr[initInd]

                                                for (let i=initInd; i<perWeek.length; i++) {
                                                    if (arr[i] == initVal) arr[i] = val
                                                    else break
                                                }

                                                setUnits(arr)
                                                myBs()
                                            }}/>
                                            
                                        </View>

                                    </View>
                                    
                                ))}

                                {perWeek.length == 0 && <Text style={[myStyles.white, myStyles.miniText, {marginBottom: height*.01}]}>{"Add a week!"}</Text>}

                                {perWeek.length > 0 && <View style={{flexDirection: 'row', marginBottom: height*.01}}>
                                    <Text style={[myStyles.white, myStyles.miniText, {marginRight: width*.02}]}>{"Continue dosing at " + perWeek[perWeek.length-1] + (units[units.length-1] == "None" ? "" : (" " + units[units.length-1])) + "?"}</Text>
                                    <Checkbox color={keepGoing ? undefined : colors.white} value={keepGoing} onValueChange={setContinue}/>
                                </View>}

                                </View>
                            </View>
                        </View>  

                    </View>      
                </View>

                <View style={[myStyles.bigView]}>
                    <View style={{marginLeft: width*.03}}>

                        <Text style={[myStyles.gray, myStyles.mainHeader, {marginTop: height*.01}]}>{"Day and Time"}</Text>

                        <View style={[{marginRight: width*.02, marginVertical: height*.01,}, myStyles.miniView]}>
                            <Text style={[myStyles.white, myStyles.text, {marginVertical: height*.02, marginLeft: width*.02, marginRight: width*.01}]}>{"Notification Days: "}</Text>
                            <ScrollView directionalLockEnabled={true} showsHorizontalScrollIndicator={false} automaticallyAdjustContentInsets={false}
                            style={{flexDirection: 'row', flex: 0.9,}} showsVerticalScrollIndicator={false}>
                                <View style={{flexDirection: 'row'}}>
                                    {days.map((elem, ind) => (
                                        <View style={{backgroundColor: colors.darkBlue, minWidth: width*.02, marginRight: width*.03, borderRadius: 5}}>
                                            <View style={{flexDirection: 'row', padding: height*.005}}>
                                                <Text style={{transform: [{translateY: height*.001}], marginRight: width *.01, color: colors.white}}>{elem}</Text>
                                                <Checkbox color={chosenDays[ind] ? undefined : colors.white} value={chosenDays[ind]} onValueChange={() => {
                                                    let arr = chosenDays
                                                    arr[ind] = !arr[ind]
                                                    setDays(arr)
                                                    myBs()
                                                }}/>
                                            </View>          
                                        </View>
                                    ))}
                                </View>
                                
                            </ScrollView>
                        </View>

                        <View style={[{marginRight: width*.02, marginVertical: height*.01}, myStyles.miniView]}>
                            <Text style={[myStyles.white, myStyles.text, {marginVertical: height*.02, marginLeft: width*.02, marginRight: width*.01}]}>{"Notification Time: "}</Text>

                            <DateTimePicker style={{backgroundColor: colors.darkBlue, borderRadius: 50}} value={new Date(time)} mode={'time'} onChange={(event, date) => setTime(date.getTime())} 
                            themeVariant='dark' accentColor={colors.white}/>
                        </View>      

                    </View>
                </View>

                <TouchableOpacity style={{backgroundColor: colors.darkBlue, height: height*.05, width: width*.2, 
                alignSelf: 'center', borderRadius: 10, marginTop: height*.02, shadowColor: colors.gray, alignItems: 'center', justifyContent: 'center',
                shadowOpacity: 0.4, elevation: 6, shadowRadius: 5, shadowOffset : { width: 0, height: height*.01},}} onPress={async () => {
                    navigation.replace("ShowPlan", {bigInd: bigInd, smallInd: smallInd, obj: makeObj(), shouldRetrieve: false, data: data, comingFromHelper: true})
                }}>

                    <Text style={[myStyles.white, myStyles.text]}>{'Save'}</Text>
            
                </TouchableOpacity>
            </ScrollView>
        </View>
        
    )
}

export default EditFood