import React, { useState, useEffect, useRef } from 'react'
import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet, TextInput } from 'react-native'
import PlanEntry from './PlanEntry'
import DashedLine from 'react-native-dashed-line';
import Ionicons from '@expo/vector-icons/Ionicons';
import foodPlan from '../Objects/foodPlan'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
})

function Plan ({ navigation, route }) {
    const {bigInd, smallInd, obj, firstTime, data, comingFromHelper } = route.params
    const {height, width} = useWindowDimensions();
    const topics = ["Treatment Foods", "Maintenance Foods", "Recommended Foods", "Medicines"]
    const [bs, setBs] = useState("")
    const [addSection, changeAdd] = useState(-1)
    const [currText, changeText] = useState("")

    const [date, setDate] = useState(new Date().getTime())
    
    const [info, setInfo] = useState([[],[],[],[]])

    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();
    const responseListener = useRef();

    async function schedulePushNotification() {
        await Notifications.cancelAllScheduledNotificationsAsync()
        // await Notifications.scheduleNotificationAsync({
        //   content: {
        //     title: "You've got mail! 📬",
        //     body: 'Here is the notification body',
        //     data: { data: 'goes here' },
        //   },
        //   trigger: { seconds: 2 },
        // });
        for (let i=0; i<info.length; i++) {
            for (let j=0; j<info[i].length; j++) {
                var curr = info[i][j]
                if (!curr.timeSpecified || curr.days.length == 0) continue
                // console.log("New Food")

                var newTime = new Date(date)
                var foodTime = new Date(curr.time)

                newTime.setHours(foodTime.getHours())
                newTime.setMinutes(foodTime.getMinutes())

                for (let k=0; k<curr.dosingPerWeek.length; k++) {
                    for (let day=0; day<7; day++) {
                        let numberOfDays = 7*k + day
                        
                        let newDate = new Date(newTime.getTime() + 60*60*24*1000*numberOfDays)
                        if (curr.days[newDate.getDay()]) {
                            // console.log(newDate.getMonth(), newDate.getDate(), newDate.getHours(), newDate.getMinutes())
                            let title = ""
                            if (curr.units == "") title = "Eat " + curr.dosingPerWeek[k] + " " + curr.food
                            else title = "Take " + curr.dosingPerWeek[k] + " " + curr.units + " of " + curr.food
                            await Notifications.scheduleNotificationAsync({
                              content: {
                                title: title,
                                body: '',
                                data: { data: 'goes here' },
                              },
                              trigger: { seconds: (newDate.getTime() - (new Date()).getTime())/1000 },
                            });
                        }
                    }
                }

                if (!curr.dosingAfter) continue

                for (let k=curr.dosingPerWeek.length; k<16; k++) {
                    for (let day=0; day<7; day++) {
                        let numberOfDays = 7*k + day
                        
                        let newDate = new Date(newTime.getTime() + 60*60*24*1000*numberOfDays)
                        // console.log(newDate.getMonth(), newDate.getDate(), newDate.getHours(), newDate.getMinutes())
                        if (curr.days[newDate.getDay()]) {
                            
                            let title = ""
                            if (curr.units == "") title = "Eat " + curr.dosingPerWeek[curr.dosingPerWeek.length-1] + " " + curr.food
                            else title = "Take " + curr.dosingPerWeek[curr.dosingPerWeek.length-1] + " " + curr.units + " of " + curr.food
                            await Notifications.scheduleNotificationAsync({
                              content: {
                                title: title,
                                body: '',
                                data: { data: 'goes here' },
                              },
                              trigger: { seconds: (newDate.getTime() - (new Date()).getTime())/1000 },
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
        header: {
            fontSize: 27,
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
            borderWidth: 1,
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
    }

    const navFunc = (bigInd, smallInd, obj) => {
        navigation.navigate("EditPlan", {bigInd: bigInd, smallInd: smallInd, obj: obj})
    }

    useEffect(() => {
        if (bigInd != -1) {
            let newInfo = info
            newInfo[bigInd][smallInd] = obj
            setInfo(newInfo)
            myBs()
        }

        const asyncFunc = async () => {
            if (firstTime) {
                await retrieve()
            }

            if (comingFromHelper) {
                // console.log(data)
                setInfo(data)
                myBs()
            }
        }

        asyncFunc()
        
    }, [obj, bigInd, smallInd, firstTime, comingFromHelper, data])

    async function store() {
        try {
            // console.log(info)
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
            for (let i=0; i<200; i++) {
                let newDate = new Date(currDate.getTime() + 60*60*24*1000*i)
                let dateStr = newDate.getMonth() + "-" + newDate.getDate() + "-" + newDate.getFullYear()

                let index = hasDate(dates, dateStr)
                if (index != -1) dates.splice(index)
            }

            for (let i=0; i<info.length; i++) {
                for (let j=0; j<info[i].length; j++) {
                    var curr = info[i][j]
                    if (curr.dosingPerWeek.length == 0 || curr.days == [false, false, false, false, false, false, false]) continue
    
                    for (let k=0; k<16; k++) {
                        if (k >= curr.dosingPerWeek.length && !curr.dosingAfter) break

                        for (let day=0; day<7; day++) {
                            let numberOfDays = 7*k + day
                            
                            let newDate = new Date((new Date(date)).getTime() + 60*60*24*1000*numberOfDays)

                            if (curr.days[newDate.getDay()]) {
                                let dateStr = newDate.getMonth() + "-" + newDate.getDate() + "-" + newDate.getFullYear()
                                let index = hasDate(dates, dateStr)
                                if (index == -1) {
                                    dates.push([dateStr, [[curr.food, false]], []])
                                } else {
                                    dates[index][1].push([curr.food, false])
                                }
                            }
                        }
                    }

                }
            }

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

    async function retrieve() {
        try {
            const jsonValue = await AsyncStorage.getItem("latestPlan")
            if (jsonValue == null) {
                // console.log("Null")
            } else {
                const object = JSON.parse(jsonValue)
                setInfo(object.plan)
                setDate(new Date(object.date))
                // console.log(object.date)
            }
        } catch(e) {
            console.log(e + "Retrieve Error")
        }
    }

    return (
        <ScrollView style={styles.container}>
            {topics.map((elem, bigInd) => (
                <View key={bigInd}>
                    <View style={styles.section}>
                        <Text style={styles.header}>{topics[bigInd]}</Text>

                        {info[bigInd].map((elem, smallInd) => (
                            <PlanEntry key={smallInd} text={elem.food} closeFunc={closeFunc} bigIndex={bigInd} littleIndex={smallInd} navFunc={navFunc} obj={info[bigInd][smallInd]}/>
                        ))}

                        {addSection == bigInd && <View style={[styles.inputView]}>
                            <TextInput style={[styles.textInput, {marginRight: width*.02, paddingLeft: width*.02}]} id={"text"} placeholder="Add a new food" onChangeText={newText => {
                                changeText(newText)
                            }}/>

                            <Ionicons name='close-outline' size={30} color='black' onPress={() => {
                                changeAdd(-1)
                            }}/>

                            <Ionicons name="checkmark-outline" size={30} color='black'onPress={() => {
                                let newInfo = info
                                newInfo[bigInd].push(new foodPlan())
                                newInfo[bigInd][info[bigInd].length-1].food = currText
                                setInfo(newInfo)
                                myBs()
                                changeAdd(-1)
                            }}/>
                        </View>}
                            
                    </View>

                    <Ionicons name='add-circle' size={50} color='black' style={styles.plus} onPress={() => {
                        changeAdd(bigInd)
                    }}/>      
                    {bigInd != 3 && <DashedLine dashLength={5} />}
                </View>
                
            ))}
            
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20}}>Start Date:  </Text>
                <DateTimePicker value={new Date(date)} mode={'date'} onChange={(event, date) => setDate(date.getTime())} 
                minimumDate={new Date()} maximumDate={new Date((new Date()).getTime() + 60*60*24*1000*30)}></DateTimePicker>
            </View>
            <Button title='Done' onPress={async () => {
                store()
                await schedulePushNotification()
                await makeDates()
                navigation.navigate("PlanPerDay")
            }}/>
            
        </ScrollView>
    );
}

export default Plan 