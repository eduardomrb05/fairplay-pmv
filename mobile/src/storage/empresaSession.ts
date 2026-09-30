import AsyncStorage from "@react-native-async-storage/async-storage";
import type { EmpresaApi } from "@/src/services/authApi";

const EMPRESA_SESSION_KEY = "@fairplay:empresa-session";

export async function salvarEmpresaSessao(empresa: EmpresaApi): Promise<void> {
  await AsyncStorage.setItem(EMPRESA_SESSION_KEY, JSON.stringify(empresa));
}

export async function buscarEmpresaSessao(): Promise<EmpresaApi | null> {
  const payload = await AsyncStorage.getItem(EMPRESA_SESSION_KEY);
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as EmpresaApi;
  } catch {
    return null;
  }
}

export async function limparEmpresaSessao(): Promise<void> {
  await AsyncStorage.removeItem(EMPRESA_SESSION_KEY);
}
