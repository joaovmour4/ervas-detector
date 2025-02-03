import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import api from './api'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { setItemAsync } from 'expo-secure-store'
import { UserType } from '@/types/types'
import { AuthContext } from './contexts/AuthContext'

interface JwtPayloadWithUser extends JwtPayload {
    user: string
}

export default function login() {
    const router = useRouter()
    const Context = useContext(AuthContext)
    const [login, setLogin] = React.useState<string>("")
    const [passsword, setPassword] = React.useState<string>("")

    const loginFn = async () => {
        try {
            await Context.signIn(login, passsword)
            router.navigate('/(tabs)')
        } catch (e) {
            Alert.alert(
                "Erro de Login",
                "Dados de login incorretos. Tente novamente.",
                [
                    {
                        text: "OK", // Texto do botão
                        onPress: () => console.log("OK Pressed"), // Ação ao pressionar o botão
                    },
                ],
            )
        }
    }

    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/images/first_view.png')}
                style={styles.imageBackground}
            />
            <View style={styles.centralView}>
                <View style={styles.inputView}>
                    <TextInput 
                        value={login}
                        onChangeText={setLogin}
                        style={styles.input} 
                        placeholder='USUÁRIO'
                        placeholderTextColor={'#4A2C1A'}
                    />
                    <TextInput 
                        value={passsword}
                        onChangeText={setPassword}
                        style={styles.input} 
                        placeholder='SENHA' 
                        placeholderTextColor={'#4A2C1A'}
                        textContentType='password'
                        secureTextEntry
                    />
                </View>
                <View style={styles.buttonView}> {/* Bugando quando abre o teclado em telas pequenas */}
                    <TouchableOpacity style={styles.signInButton} onPress={loginFn}>
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
        backgroundColor: '#6E8B3D',
        paddingInline: 15,
        paddingBlock: 25,
        marginHorizontal: 25,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
    },
    inputView: {
        gap: 15,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        color: '#4A2C1A',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Montserrat',
        paddingBlock: 20,
        height: 55,
        fontSize: 16,
        borderRadius: 15,
        paddingLeft: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        // Sombra para Android
        elevation: 10,
    },
    buttonView: {
        gap: 15,
        flex: 0
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A2C1A',
        textAlign: 'center'
    },
    registerText: {
        fontFamily: 'montserrat',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center'
    }
})