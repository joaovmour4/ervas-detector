import React, { createContext, useState, useEffect, ReactNode, SetStateAction, Dispatch } from "react"
import api from "../api"
import { UserType } from "@/types/types"
import * as SecureStorage from 'expo-secure-store'
import { jwtDecode, JwtPayload } from "jwt-decode"
import { Alert } from "react-native"

interface AuthContextData {
  user: UserType | null
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  signIn: (login: string, password: string) => Promise<void>
  signUp: (login: string, email: string, city: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserData: (user: UserType | null) => Promise<void>
  fetchUserInfo: () => Promise<void>
}

interface JwtPayloadWithUser extends JwtPayload {
    user: string
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedUser = await SecureStorage.getItemAsync("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(login: string, password: string) {
    try {
      const response = await api.post("/auth/login", { name: login, password });

      const token: JwtPayloadWithUser = jwtDecode(response.data)

      const userString = JSON.stringify(token.user)

      await SecureStorage.setItemAsync("userToken", response.data);
      await SecureStorage.setItemAsync("user", userString);

      setUser(JSON.parse(userString));
    } catch (error) {
        throw new Error("Erro ao fazer login. Verifique suas credenciais.")
    }
  }

  async function signUp(login: string, email: string, city: string, password: string) {
    try {
      await api.post("/users", { name: login, email: email, city: city, password });
    } catch (error) {
      throw new Error("Erro ao fazer login. Verifique suas credenciais.")
    }
  }

  async function signOut() {
    await SecureStorage.deleteItemAsync("userToken");
    await SecureStorage.deleteItemAsync("user");
    setUser(null);
  }

  async function updateUserData(user: UserType | null) {
    if(user){
        setUser(user)
        await SecureStorage.setItemAsync("user", JSON.stringify(user))
    }
  }

  async function fetchUserInfo() {
    setLoading(true)
    const userFetched = (await api.get(`/users/id/${user?.id}`)).data as UserType
    setUser(userFetched)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, setLoading, signIn, signUp, signOut, updateUserData, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
}
