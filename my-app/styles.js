import { Button, Image, View, Text, useWindowDimensions, ScrollView, StyleSheet } from 'react-native'
import colors from './colors'

const myStyles = StyleSheet.create({
  btnText: {
      padding:8,
      color: 'white',
      fontSize: 15,
  },
  btn: {
    backgroundColor: colors.darkBlue,
    borderRadius: 10
  },
  topHeading: {
    fontSize: 50
  },
  mainHeader: {
    fontSize: 33
  },
  subHeader: {
    fontSize: 26
  },
  text: {
    fontSize: 20
  },
  miniText: {
    fontSize: 15
  },
  tinyText: {
    fontSize: 11
  },
  darkBlue: {
    color: '#5DA2D5'
  },
  lightBlue: {
    color: '#90CCF4'
  },
  gray: {
    color: '#838383'
  },
  white: {
    color: '#ffffff'
  },
  miniView: {
    backgroundColor: colors.lightBlue, 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 7,
    marginRight: 20,
    width: '97%'
  },
  bigView: {
    borderRadius: 10, 
    borderWidth: 5, 
    borderColor: colors.darkBlue
  },
  textInp: {
    borderWidth: 2, 
    borderRadius: 5,
    borderColor: colors.darkBlue, 
    color: colors.gray
  }
})

export default myStyles
