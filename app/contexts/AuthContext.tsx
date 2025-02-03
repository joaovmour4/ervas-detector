import React, { createContext, useState, useEffect, ReactNode } from "react"
import api from "../api"
import { UserType } from "@/types/types"
import * as SecureStorage from 'expo-secure-store'
import { jwtDecode, JwtPayload } from "jwt-decode"

interface AuthContextData {
  user: UserType | null
  loading: boolean
  signIn: (login: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserData: (user: UserType | null) => Promise<void>
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

      await SecureStorage.setItemAsync("userToken", response.data);
      await SecureStorage.setItemAsync("user", JSON.stringify(token.user));

      setUser(user);
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

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
