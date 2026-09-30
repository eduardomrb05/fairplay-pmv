import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UsuarioApi } from "@/src/services/authApi";

const USUARIO_SESSION_KEY = "@fairplay:usuario-session";

export async function salvarUsuarioSessao(usuario: UsuarioApi): Promise<void> {
  await AsyncStorage.setItem(USUARIO_SESSION_KEY, JSON.stringify(usuario));
}

export async function buscarUsuarioSessao(): Promise<UsuarioApi | null> {
  const payload = await AsyncStorage.getItem(USUARIO_SESSION_KEY);
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as UsuarioApi;
  } catch {
    return null;
  }
}

export async function limparUsuarioSessao(): Promise<void> {
  await AsyncStorage.removeItem(USUARIO_SESSION_KEY);
}
