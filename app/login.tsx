import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function login() {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/images/first_view.png')}
                style={styles.imageBackground}
            />
            <View style={styles.centralView}>
                <View style={styles.inputView}>
                    <TextInput 
                        style={styles.input} 
                        placeholder='USUÁRIO'
                        placeholderTextColor={'#4A2C1A'}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder='SENHA' 
                        placeholderTextColor={'#4A2C1A'}
                        textContentType='password'
                    />
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.signInButton}>
                        <Text style={styles.signInText}>
                            ENTRAR
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerButton}>
                        <Text style={styles.registerText}>
                            CADASTRAR-SE
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
    },
    imageBackground: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 0.4
    },
    centralView: {
        display: 'flex',
        flex: 1,
        maxHeight: '50%',
        alignContent: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#6E8B3D',
        paddingInline: 15,
        paddingBlock: 25,
        marginHorizontal: 25,
        borderRadius: 15,
    },
    inputView: {
        gap: 15,
    },
    input: {
        color: '#4A2C1A',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Montserrat',
        paddingBlock: 20,
        height: 55,
        fontSize: 16,
        borderRadius: 15,
        paddingLeft: 30
    },
    buttonView: {
        gap: 15
    },
    signInButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        paddingBlock: 20,
    },
    registerButton: {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: 15,
        paddingBlock: 20
    },
    signInText: {
        fontFamily: 'montserrat',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A2C1A',
        textAlign: 'center'
    },
    registerText: {
        fontFamily: 'montserrat',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center'
    }
})