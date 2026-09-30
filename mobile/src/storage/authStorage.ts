import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "@fairplay:users";

export type UsuarioPF = {
  tipo: "PF";
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  idade: string;
  bairro: string;
  cidade: string;
};

export type UsuarioPJ = {
  tipo: "PJ";
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  email: string;
  senha: string;
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
};

export type Usuario = UsuarioPF | UsuarioPJ;

export async function buscarUsuarios(): Promise<Usuario[]> {
  try {
    const response = await AsyncStorage.getItem(USERS_KEY);

    if (!response) {
      return [];
    }

    return JSON.parse(response) as Usuario[];
  } catch (error) {
    console.log("Erro ao buscar usuários:", error);
    return [];
  }
}

export async function cadastrarUsuario(novoUsuario: Usuario): Promise<void> {
  try {
    const usuarios = await buscarUsuarios();

    if (novoUsuario.tipo === "PF") {
      const cpfJaExiste = usuarios.some(
        (usuario) => usuario.tipo === "PF" && usuario.cpf === novoUsuario.cpf
      );

      if (cpfJaExiste) {
        throw new Error("Já existe um usuário cadastrado com este CPF.");
      }
    }

    if (novoUsuario.tipo === "PJ") {
      const cnpjJaExiste = usuarios.some(
        (usuario) => usuario.tipo === "PJ" && usuario.cnpj === novoUsuario.cnpj
      );

      if (cnpjJaExiste) {
        throw new Error("Já existe um usuário cadastrado com este CNPJ.");
      }
    }

    const novaLista = [...usuarios, novoUsuario];

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(novaLista));
  } catch (error) {
    console.log("Erro ao cadastrar usuário:", error);
    throw error;
  }
}

export async function validarLoginPF(cpf: string, senha: string): Promise<UsuarioPF | null> {
  try {
    const usuarios = await buscarUsuarios();
    const cpfLimpo = cpf.replace(/\D/g, "");

    const usuarioEncontrado = usuarios.find(
      (usuario): usuario is UsuarioPF =>
        usuario.tipo === "PF" &&
        usuario.cpf === cpfLimpo &&
        usuario.senha === senha
    );

    return usuarioEncontrado || null;
  } catch (error) {
    console.log("Erro ao validar login PF:", error);
    return null;
  }
}

export async function validarLoginPJ(cnpj: string, senha: string): Promise<UsuarioPJ | null> {
  try {
    const usuarios = await buscarUsuarios();
    const cnpjLimpo = cnpj.replace(/\D/g, "");

    const usuarioEncontrado = usuarios.find(
      (usuario): usuario is UsuarioPJ =>
        usuario.tipo === "PJ" &&
        usuario.cnpj === cnpjLimpo &&
        usuario.senha === senha
    );

    return usuarioEncontrado || null;
  } catch (error) {
    console.log("Erro ao validar login PJ:", error);
    return null;
  }
}

export async function limparUsuarios(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USERS_KEY);
  } catch (error) {
    console.log("Erro ao limpar usuários:", error);
  }
}