import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { useRouter } from 'expo-router'
import { AuthContext } from './contexts/AuthContext'


export default function signup() {
    const router = useRouter()
    const Context = useContext(AuthContext)
    const [login, setLogin] = React.useState<string>("")
    const [email, setEmail] = React.useState<string>("")
    const [city, setCity] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const signupFn = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(login.length < 5){
            Alert.alert(
              "Dados inválidos",
              "O nome de usuário precisa ter cinco ou mais caracteres.",
            )
            return undefined
        }else if(!emailRegex.test(email)){
            Alert.alert(
              "Dados inválidos",
              "E-Mail inválido.",
            )
            return undefined
        }else if(city.length < 2){
            Alert.alert(
              "Dados inválidos",
              "Cidade inválida.",
            )
            return undefined
        }else if(password.length < 5){
            Alert.alert(
              "Dados inválidos",
              "A senha precisa conter cinco ou mais caracteres.",
            )
            return undefined
        }
        try {
            await Context.signUp(login.trim(), email.trim(), city.trim(), password.trim())
            Alert.alert(
                "Sucesso",
                "Usuário criado com sucesso.",
                [
                    {
                        text: "OK",
                    },
                ],
            )
            router.back()
        } catch (e) {
            Alert.alert(
                "Erro ao criar o usuário",
                "Já existe um usuário com esse nome ou e-mail cadastrado.",
                [
                    {
                        text: "OK",
                    },
                ],
            )
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                            placeholderTextColor={'#6A6A6A'}
                            autoCapitalize='none'
                        />
                        <TextInput 
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input} 
                            placeholder='E-MAIL'
                            placeholderTextColor={'#6A6A6A'}
                            autoCapitalize='none'
                            keyboardType='email-address'
                        />
                        <TextInput 
                            value={city}
                            onChangeText={setCity}
                            style={styles.input} 
                            placeholder='CIDADE'
                            placeholderTextColor={'#6A6A6A'}
                        />
                        <TextInput 
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input} 
                            placeholder='SENHA' 
                            placeholderTextColor={'#6A6A6A'}
                            textContentType='password'
                            autoCapitalize='none'
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.signInButton} onPress={signupFn}>
                            <Text style={styles.signInText}>
                                CRIAR
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    imageBackground: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 0.4
    },
    centralView: {
        display: 'flex',
        height: 600,
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
        color: '#4A4A4A',
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