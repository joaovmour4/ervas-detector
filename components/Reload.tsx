import { Animated, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Reload() {
    const spinValue = React.useRef(new Animated.Value(0)).current;
    Animated.timing(spinValue, {
        toValue: 1, // Roda de 0 a 1
        duration: 800, // Tempo da animação (0.8s)
        useNativeDriver: true, // Melhor desempenho
    }).start();
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    return(
        <Animated.View style={[styles.container, { transform: [{ rotate: spin }] }]}>
            <Ionicons
                name='reload'
                size={80}
                color={'#4A4A4A'}
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DBE7C9'
    }
})