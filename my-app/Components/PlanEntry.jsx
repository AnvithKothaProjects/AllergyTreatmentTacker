import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import {React} from 'react';
import myStyles from '../styles';
import colors from '../colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import * as Haptics from 'expo-haptics';

function PlanEntry({ text, navigation, bigIndex, littleIndex, closeFunc, navFunc, obj, data }) {
    const {height, width} = useWindowDimensions();
    const [b, setB] = useState("")
    const swipeableRef = useRef("");

    const style = new StyleSheet.create({
        view: {
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            maxWidth: width*.75,
            flex: 0,
            alignItems: 'baseline'
        }
    })

    const myBs = () => {
        if (b == "") {
            setB("b")
        } else {
            setB("")
        }
    }

    const left = () => {
        return (
            <View style={{backgroundColor: '#e65353', flex: 1, borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
            alignItems: 'center', flexDirection: 'row'}}>
                <Ionicons name='trash-outline' size={29} color={colors.white} style={{marginLeft: 10}}/>                
            </View>
        )
    }

    const right = () => {
        return (
            <View style={{backgroundColor: colors.darkBlue, flex: 1, borderTopRightRadius: 10, borderBottomRightRadius: 10,
            alignItems: 'center', flexDirection: 'row-reverse'}}>
                <Ionicons name='pencil' size={29} color={colors.white} style={{marginRight: 10}}/>
            </View>
        )
    }

    const closeSwipeable = () => {
        swipeableRef.current.close();
    }

    return (
        <Swipeable
            renderLeftActions={left}
            renderRightActions={right}
            onSwipeableOpen={(direction) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                if (direction == "left") {
                    try {
                        closeFunc(bigIndex, littleIndex)
                        closeSwipeable()
                    } catch (TypeError) {
                        console.log("Error")
                    }
                    
                } else {
                    navFunc(bigIndex, littleIndex, obj, data)
                }
            }}
            friction={1.5}
            ref={swipeableRef}
        > 
            <View style={{backgroundColor: '#f2f2f2',}}>
                <View style={[style.view, {alignItems: 'center'}]}>
                    <Ionicons name='caret-forward-outline' size={17} color={colors.gray} style={{marginRight: 5}}/>
                    <Text style={[myStyles.text, myStyles.gray]}>{text}</Text>
                </View>
            </View>
            
        </Swipeable>
    )
}

export default PlanEntry