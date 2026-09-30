import { apiRequest } from "./api";

export type UsuarioApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
};

export type EmpresaApi = {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  bloqueado?: boolean;
  permite_mensalista?: boolean;
  is_admin?: boolean;
};

export type AdminApi = {
  id: number;
  nome: string;
  cnpj: string;
};

export type LoginPJResponse = {
  tipo: "admin" | "empresa";
  usuario?: EmpresaApi;
  empresa?: EmpresaApi;
  admin?: AdminApi;
};

type CadastroPFInput = {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  idade: number;
  bairro: string;
  cidade: string;
  telefone: string;
};

type LoginPFInput = {
  email: string;
  senha: string;
};

type CadastroPJInput = {
  nome: string;
  email: string;
  senha: string;
  cnpj: string;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
};

type LoginPJInput = {
  cnpj: string;
  senha: string;
};

type VerificarEmailInput = {
  email: string;
};

type AtualizarSenhaInput = {
  email: string;
  novaSenha: string;
};

type AtualizarUsuarioInput = {
  nome?: string;
  telefone?: string;
};

type AtualizarEmpresaInput = {
  nome?: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  permite_mensalista?: boolean;
  bloqueado?: boolean;
};

export function cadastrarPF(payload: CadastroPFInput) {
  return apiRequest<UsuarioApi>("/usuarios", {
    method: "POST",
    body: payload,
  });
}

export function loginPF(payload: LoginPFInput) {
  return apiRequest<UsuarioApi>("/auth/usuarios/login", {
    method: "POST",
    body: payload,
  });
}

export function cadastrarPJ(payload: CadastroPJInput) {
  return apiRequest<EmpresaApi>("/empresas", {
    method: "POST",
    body: payload,
  });
}

export function loginPJ(payload: LoginPJInput) {
  return apiRequest<LoginPJResponse>("/auth/empresas/login", {
    method: "POST",
    body: payload,
  });
}

export function verificarEmail(payload: VerificarEmailInput) {
  return apiRequest<UsuarioApi>("/auth/usuarios/verificar-email", {
    method: "POST",
    body: payload,
  });
}

export function atualizarSenha(payload: AtualizarSenhaInput) {
  return apiRequest<{ message: string }>("/auth/usuarios/atualizar-senha", {
    method: "PATCH",
    body: payload,
  });
}

export function atualizarUsuario(id: number, payload: AtualizarUsuarioInput) {
  return apiRequest<UsuarioApi>(`/usuarios/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function buscarEmpresaPorId(id: number) {
  return apiRequest<EmpresaApi>(`/empresas/${id}`, {
    method: "GET",
  });
}

export function atualizarEmpresa(id: number, payload: AtualizarEmpresaInput) {
  return apiRequest<EmpresaApi>(`/empresas/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function excluirEmpresa(id: number, cnpj: string) {
  return apiRequest<void>(`/empresas/${id}?cnpj=${encodeURIComponent(cnpj)}`, {
    method: "DELETE",
  });
}

export function uploadFotoPerfil(id: number, payload: { base64: string; extension: string }) {
  return apiRequest<{ publicUrl: string }>(`/usuarios/${id}/foto`, {
    method: "POST",
    body: payload,
  });
}

export function cancelarConta(id: number) {
  return apiRequest<any>(`/usuarios/${id}`, {
    method: "DELETE",
  });
}
