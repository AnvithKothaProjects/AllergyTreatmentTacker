import React, { useState, useEffect, useRef } from 'react'
import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import PlanEntry from './PlanEntry'
import DashedLine from 'react-native-dashed-line';
import Ionicons from '@expo/vector-icons/Ionicons';
import foodPlan from '../Objects/foodPlan'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import BackgroundImg from './BackgroundImg';
import myStyles from '../styles';
import colors from '../colors';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
})

function Plan ({ navigation, route }) {
    const {bigInd, smallInd, obj, shouldRetrieve, data, comingFromHelper, comingFromCalendar} = route.params
    const {height, width} = useWindowDimensions();
    const topics = ["Treatment Foods", "Maintenance Foods", "Recommended Foods", "Medicines"]
    const [bs, setBs] = useState("")
    const [addSection, changeAdd] = useState(-1)
    const [currText, changeText] = useState("")
    const [loading, setLoading] = useState(false)

    const [date, setDate] = useState(new Date().getTime())
    
    const [info, setInfo] = useState([[],[],[],[]])

    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();
    const responseListener = useRef();

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0ba1ae5cfamshee2f3634babfe03p1846bejsn0b1f0162d95e',
            'X-RapidAPI-Host': 'amazon-price1.p.rapidapi.com'
        }
    };    

    async function schedulePushNotification() {
        await Notifications.cancelAllScheduledNotificationsAsync()

        for (let i=0; i<info.length; i++) {
            for (let j=0; j<info[i].length; j++) {
                var curr = info[i][j]

                var newTime = new Date(date)
                newTime.setHours(new Date(curr.time).getHours())
                newTime.setMinutes(new Date(curr.time).getMinutes())

                loop1 : for (let k=0; k<16; k++) {
                    for (let day =0; day<7; day++) {
                        var ind = k

                        if (k >= curr.dosingPerWeek.length) {
                            if (!curr.dosingAfter) break loop1
                            break

                            ind = curr.dosingPerWeek.length-1
                        }

                        let numberOfDays = 7*k + day
                        let newDate = new Date(newTime.getTime() + 60*60*24*1000*numberOfDays)

                        if (curr.days[newDate.getDay()]) {
                            let title = ""
                            if (curr.units[ind] == "None" || curr.units[ind] == "") {
                                title = "Take " + curr.dosingPerWeek[ind] + " " + curr.food
                            } else {
                                title = "Take " + curr.dosingPerWeek[ind] + " " + curr.units[ind] + " of " + curr.food
                            }

                            await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: title,
                                    body: '',
                                    data: { data: 'goes here' },
                                },
                                trigger: { seconds: (newDate.getTime() - (new Date()).getTime()) / 1000 },
                            });
                        }
                    }
                }
            }
        }
        
    }

    async function registerForPushNotificationsAsync() {
        let token;
      
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        //   console.log(notification)
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        //   console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
 
    const styles = StyleSheet.create({
        container: {
            marginLeft: width*.02,
            marginTop: height*.08,
        },
        section: {
            marginLeft: width*.06,
            marginTop: height*.02,
        },
        plus: {
            marginLeft: width*.04,
            marginBottom: height*.02,
        },
        textInput: {
            marginLeft: width*.06,
            width: width*.6, 
            height: 40,
            borderWidth: 2,
            borderRadius: 10,
        },
        inputView: {
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
        }
    })

    const myBs = () => {
        if (bs == "") {
            setBs(" ")
        } else setBs("")
    }

    const closeFunc = (bigIndex, littleIndex) => {
        let newInfo = info
        newInfo[bigIndex].splice(littleIndex,1)
        setInfo(newInfo)

        myBs()
        setTimeout(() => myBs(), 100);
    }

    const navFunc = (bigInd, smallInd, obj, data) => {
        navigation.replace("EditPlan", {bigInd: bigInd, smallInd: smallInd, obj: obj, data: data})
    }

    useEffect(() => {
        console.log(comingFromHelper + " " + shouldRetrieve)
        console.log(data)
        const asyncFunc = async () => {
            if (shouldRetrieve && !comingFromHelper) {
                await retrieve()
            }
        }

        asyncFunc()
        if (comingFromHelper) {
            var newInfo = data
            if (bigInd != -1) {
                newInfo[bigInd][smallInd] = obj
            }

            setInfo(newInfo)
            myBs()
        }
        
    }, [obj, bigInd, smallInd, shouldRetrieve, comingFromHelper, data])

    async function store() {
        try {
            console.log(new Date(date).getDate())
            await AsyncStorage.setItem("latestPlan", JSON.stringify({plan: info, date: date}))
        } catch (e) {
            console.log(e + "Store Error")
        }
    }

    async function makeDates() {
        var dates = JSON.parse(await AsyncStorage.getItem("dates"))
        if (dates == null) {
            dates = new Array()
        }

        try {
            var currDate = new Date(date)

            //Clears all previous dates
            for (let i=0; i<200; i++) {
                let newDate = new Date(currDate.getTime() + 60*60*24*1000*i)
                let dateStr = newDate.getMonth() + "-" + newDate.getDate() + "-" + newDate.getFullYear()

                let index = hasDate(dates, dateStr)
                if (index != -1) dates.splice(index)
            }

            // console.log(new Date().getDate())

            for (let i=0; i<info.length; i++) {
                for (let j=0; j<info[i].length; j++) {
                    //Look at each food
                    var curr = info[i][j]
                    if (curr.dosingPerWeek.length == 0 || curr.days == [false, false, false, false, false, false, false]) continue
    
                    for (let k=0; k<16; k++) {
                        if (k >= curr.dosingPerWeek.length && !curr.dosingAfter) break

                        for (let day=0; day<7; day++) {
                            let numberOfDays = 7*k + day
                            
                            let newDate = new Date((new Date(date)).getTime() + 60*60*24*1000*numberOfDays)
                            console.log(newDate.getDate())  
                            
                            // let myDate = new Date(new Date())

                            if (curr.days[newDate.getDay()]) {
                                
                                let dateStr = newDate.getMonth() + "-" + newDate.getDate() + "-" + newDate.getFullYear()
                                let index = hasDate(dates, dateStr)
                                if (index == -1) {
                                    // console.log(numberOfDays)
                                    dates.push([dateStr, [[curr.food, false]]])
                                } else {
                                    dates[index][1].push([curr.food, false])
                                }
                            }
                        }
                    }

                }
            }
            console.log(dates)

            await AsyncStorage.setItem("dates", JSON.stringify(dates))
        } catch(e) {
            console.log(e + "Make Dates Error")
        }
    }

    function hasDate(list, str) {
        for (let i=0; i<list.length; i++) {
            if (list[i][0] == str) return i
        }
        return -1
    }

    function listOfTypes(foods) {
        // console.log(foods)
        var list = []

        for (const food of foods) {
            let works = true

            for (const elem of list) {
                if (food.foodType == elem) {
                    works = false
                    break
                }
            }

            if (works) list.push(food.foodType);
        }

        for (let i=0; i<list.length; i++) {
            if (list[i] == "Other") {
                list.splice(i, 1)
                list.push("Other")
                break
            }
        }

        return list
    }

    async function retrieve() {
        try {
            const jsonValue = await AsyncStorage.getItem("latestPlan")
            if (jsonValue == null) {
                // console.log("Null")
            } else {
                const object = JSON.parse(jsonValue)
                setInfo(object.plan)
                setDate(object.date)
                // console.log(object.date)
            }
        } catch(e) {
            console.log(e + "Retrieve Error")
        }
    }

    function getMarginTop(index) {
        if (index == 0) return height*.02
        return 0
    }

    async function callApi() {
        var list = []
        for (let i=0; i<info[0].length; i++) {
            let replace = info[0][i].food.replace(" ", "%20")

            await fetch("https://amazon-price1.p.rapidapi.com/search?keywords=" + replace + "&marketplace=US", options)
                .then(response => response.json())
                .then(response => list.push(response))
                .catch(err => console.error(err));
        }

        await AsyncStorage.setItem("api", JSON.stringify(list))
    }

    if (!loading) return (
        
        <View style={{height: height}}>
            <ScrollView style={styles.container}>
                <Text style={[myStyles.topHeading, myStyles.darkBlue, {alignSelf: 'center', marginBottom: height*.005}]}>{"Your Plan"}</Text>

                {topics.map((elem, bigInd) => (
                    <View key={bigInd}>
                        <View style={styles.section}>
                            <Text style={[myStyles.mainHeader, myStyles.lightBlue]}>{topics[bigInd]}</Text>

                            {/* {info[bigInd].map((elem, smallInd) => (
                            <PlanEntry key={smallInd} text={elem.food} closeFunc={closeFunc} bigIndex={bigInd} littleIndex={smallInd} navFunc={navFunc} obj={info[bigInd][smallInd]}/>
                            ))} */}

                            {listOfTypes(info[bigInd]).map((foodType, typeInd) => (
                                <View style={{marginLeft: width*.1, marginTop: getMarginTop(typeInd), marginBottom: height*.01,}} key={typeInd}>
                                    <Text style={[myStyles.subHeader, myStyles.lightBlue]}>{foodType}</Text>
                                    {info[bigInd].map((myFood, smallInd) => (
                                        <View key={smallInd} style={{alignItems: 'baseline'}}>
                                            <GestureHandlerRootView style={{marginLeft: width*.05}}>
                                                {info[bigInd][smallInd].foodType == foodType && 
                                                <PlanEntry key={smallInd} text={myFood.food} closeFunc={closeFunc} bigIndex={bigInd}
                                                littleIndex={smallInd} navFunc={navFunc} obj={info[bigInd][smallInd]} data={info} />}
                                            </GestureHandlerRootView>
                                            
                                            
                                        </View>
                                        
                                    ))}
                                </View>
                            ))}

                            {addSection == bigInd && <View style={[styles.inputView, {marginLeft: width*.02}]}>
                                <TextInput style={[styles.textInput, {marginRight: width*.02, paddingLeft: width*.02, borderColor: colors.darkBlue}]} id={"text"} placeholder="Add a new food" onChangeText={newText => {
                                    changeText(newText)
                                }}/>

                                <Ionicons name='close' size={35} color={colors.darkBlue} onPress={() => {
                                    changeAdd(-1)
                                }}/>

                                <Ionicons name="checkmark-sharp" size={35} color={colors.darkBlue} onPress={() => {
                                    let newInfo = info
                                    newInfo[bigInd].push(new foodPlan())
                                    newInfo[bigInd][info[bigInd].length-1].food = currText
                                    newInfo[bigInd][info[bigInd].length-1].foodType = "Other"
                                    setInfo(newInfo)
                                    myBs()
                                    changeAdd(-1)
                                }}/>
                            </View>}
                                
                        </View>

                        <Ionicons name='add-circle' size={50} color={colors.darkBlue} style={styles.plus} onPress={() => {
                            changeAdd(bigInd)
                        }}/>      
                        {bigInd != 3 && <DashedLine dashLength={5} dashColor={colors.lightBlue}/>}
                    </View>
                    
                ))}
                
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, color: colors.darkBlue}}>Start Date:  </Text>
                    <DateTimePicker value={new Date(date)} mode={'date'} onChange={(event, date) => {
                        setDate(date.getTime())
                        console.log(new Date(date).getDate())
                    }} 
                    minimumDate={new Date()} maximumDate={new Date((new Date()).getTime() + 60*60*24*1000*30)}></DateTimePicker>
                </View>

                <View style={{ marginBottom: height*.05 }}>

                    <TouchableOpacity style={{backgroundColor: colors.darkBlue, height: height*.05, width: width*.2, 
                    alignSelf: 'center', borderRadius: 10, marginTop: height*.02, shadowColor: colors.gray, alignItems: 'center', justifyContent: 'center',
                    shadowOpacity: 0.4, elevation: 6, shadowRadius: 5, shadowOffset : { width: 0, height: height*.01},}} onPress={async () => {
                        setLoading(true)
                        store()
                        await schedulePushNotification()
                        await makeDates()
                        await callApi()
                        navigation.replace("Tabs")
                    }}>

                        <Text style={{color: 'white', fontSize: 30,}}>{'OK'}</Text>

                    </TouchableOpacity>

                    {/* <Button title='Straight to Calendar' onPress={async () => {
                        navigation.replace("Tabs")
                    }}/> */}

                    {/* <Button title='Print' onPress={() => {
                        console.log(data)
                    }}></Button> */}
                </View>

                {comingFromCalendar == true && <Ionicons name='close' size={50} style={{position: 'absolute', right: width*.02}} onPress={() => {
                    navigation.replace('Tabs')
                }}></Ionicons>}
            </ScrollView>
        </View>
        
    )
    return (
        <View style={{alignItems: 'center', height: height}}>
            <Text style={{marginTop: height*.5}}>{"Loading..."}</Text>
        </View>
    )
}

export default Plan 