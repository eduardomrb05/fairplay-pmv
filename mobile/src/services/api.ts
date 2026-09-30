import { Platform } from "react-native";

function getDefaultApiUrl() {
  if (Platform.OS === "web") {
    return "http://localhost:3000";
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }

  return "http://localhost:3000";
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || getDefaultApiUrl();

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: options.body
        ? JSON.stringify(options.body)
        : undefined,
    });
  } catch {
    throw new Error(
      `Nao foi possivel conectar na API (${url}). Verifique EXPO_PUBLIC_API_URL e se o backend esta em execucao.`
    );
  }

  let responseData: any = null;

  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    throw new Error(
      responseData?.message ||
      responseData?.erro ||
      responseData?.details ||
      "Nao foi possivel concluir a requisicao."
    );
  }

  return responseData as T;
}

export { API_BASE_URL };