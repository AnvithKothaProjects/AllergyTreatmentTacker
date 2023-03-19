import { Button, Image, View, Text, useWindowDimensions, ScrollView } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

function ImageDisplay(props) {
    const {height, width} = useWindowDimensions();

    return (
        <View style={{padding:5}}>
            <Image source={{ uri: props.picture }} style={{ width: 100, height: 100, 
            resizeMode:"cover", borderRadius:10}}/>
            <View style={{position: 'absolute', top: height*.01, left: width*.01}}>
                <Ionicons name={'close-circle-outline'} size={30} color={"black"} onPress={() => {
                    props.func(props.index)
                }}/>
            </View>
        </View>
    )
}

export default ImageDisplay