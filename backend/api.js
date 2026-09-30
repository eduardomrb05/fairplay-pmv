import express from "express";
import cors from "cors";
import connection from "./config/db.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

function sanitizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function isUniqueViolation(error) {
  return error?.code === "23505";
}

function isMissingColumnError(error) {
  if (!error) {
    return false;
  }

  const code = String(error.code || "");
  if (code === "42703" || code === "PGRST204") {
    return true;
  }

  const message = String(error.message || "").toLowerCase();
  return message.includes("column") && message.includes("schema cache");
}

function normalizePreco(preco) {
  if (preco === undefined || preco === null || preco === "") {
    return null;
  }

  const parsed = Number(preco);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeBoolean(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  if (normalized === "true" || normalized === "sim" || normalized === "1") {
    return true;
  }
  if (normalized === "false" || normalized === "nao" || normalized === "0") {
    return false;
  }

  return null;
}

function buildQuadraExtendedPayload(body, basePayload) {
  const horarioInicio = body.horario_inicio !== undefined ? body.horario_inicio : body.horarioInicio;
  const horarioFim = body.horario_fim !== undefined ? body.horario_fim : body.horarioFim;
  const minJogadores =
    body.min_jogadores !== undefined ? body.min_jogadores : body.minJogadores;
  const maxJogadores =
    body.max_jogadores !== undefined ? body.max_jogadores : body.maxJogadores;
  const disponivelMensalistas =
    body.disponivel_mensalistas !== undefined ? body.disponivel_mensalistas : body.disponivelMensalistas;
  const disponivelAvulso =
    body.disponivel_avulso !== undefined ? body.disponivel_avulso : body.disponivelAvulso;
  const fotoUrl = body.foto_url !== undefined ? body.foto_url : body.fotoUrl;

  return {
    ...basePayload,
    horario_inicio:
      horarioInicio !== undefined && horarioInicio !== null
        ? String(horarioInicio).trim() || null
        : undefined,
    horario_fim:
      horarioFim !== undefined && horarioFim !== null
        ? String(horarioFim).trim() || null
        : undefined,
    min_jogadores:
      minJogadores !== undefined && minJogadores !== null && minJogadores !== ""
        ? Number(minJogadores)
        : minJogadores === null || minJogadores === ""
          ? null
          : undefined,
    max_jogadores:
      maxJogadores !== undefined && maxJogadores !== null && maxJogadores !== ""
        ? Number(maxJogadores)
        : maxJogadores === null || maxJogadores === ""
          ? null
          : undefined,
    disponivel_mensalistas:
      disponivelMensalistas !== undefined ? normalizeBoolean(disponivelMensalistas) : undefined,
    disponivel_avulso: disponivelAvulso !== undefined ? normalizeBoolean(disponivelAvulso) : undefined,
    foto_url: fotoUrl !== undefined ? (fotoUrl ? String(fotoUrl).trim() : null) : undefined,
  };
}

function mapDbErrorMessage(error, fallback) {
  if (!error) {
    return fallback;
  }

  const code = String(error.code || "");

  if (code === "23503") {
    return "Empresa invalida ou referencia inexistente no banco.";
  }

  if (code === "42501") {
    return "Sem permissao no banco. Use SUPABASE_SECRET_KEY com service role no backend.";
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/usuarios", async (_req, res) => {
  try {
    const { data, error } = await connection
      .from("usuarios")
      .select("id, nome, email, telefone")
      .order("id", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuarios." });
  }
});

app.post("/usuarios", async (req, res) => {
  console.log("BODY CADASTRO:", req.body);

  const { nome, email, senha, cpf, idade, bairro, cidade, telefone } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      message: "Nome, e-mail e senha sao obrigatorios."
    });
  }

  try {
    const { data, error } = await connection
      .from("usuarios")
      .insert({
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        senha: String(senha),
        cpf: sanitizeDigits(cpf),
        idade: Number(idade),
        bairro: bairro ? String(bairro).trim() : null,
        cidade: cidade ? String(cidade).trim() : null,
        telefone: sanitizeDigits(telefone),
      })
      .select("id, nome, email, cpf, idade, bairro, cidade, telefone")
      .single();

    if (error) {
      console.log("SUPABASE ERROR:", error);

      if (isUniqueViolation(error)) {
        return res.status(409).json({
          message: "Ja existe usuario com este e-mail."
        });
      }

      throw error;
    }

    console.log("USUARIO CADASTRADO:", data);

    res.status(201).json(data);

  } catch (error) {
    console.log("ERRO AO CADASTRAR USUARIO:", error);

    res.status(500).json({
      message: "Erro ao cadastrar usuario.",
      details: error?.message,
      code: error?.code,
    });
  }
});

app.post("/auth/usuarios/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      message: "E-mail e senha sao obrigatorios."
    });
  }

  try {
    const { data, error } = await connection
      .from("usuarios")
      .select("id, nome, email, telefone, bloqueado")
      .eq("email", String(email).trim().toLowerCase())
      .eq("senha", String(senha))
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(401).json({
        message: "Credenciais invalidas."
      });
    }

    if (data.bloqueado) {
      return res.status(403).json({
        message: "Usuario bloqueado. Entre em contato com o administrador."
      });
    }

    return res.json({
      id: data.id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
    });

  } catch (error) {
    console.log("ERRO LOGIN USUARIO:", error);

    return res.status(500).json({
      message: "Erro ao autenticar usuario."
    });
  }
});

app.post("/auth/usuarios/verificar-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail obrigatorio." });
  }

  try {
    const { data, error } = await connection
      .from("usuarios")
      .select("id, nome, email")
      .eq("email", String(email).trim().toLowerCase())
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "E-mail nao encontrado." });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao verificar e-mail." });
  }
});

app.patch("/usuarios/:id", async (req, res) => {
  const usuarioId = Number(req.params.id);
  const { nome, telefone } = req.body;

  if (!Number.isFinite(usuarioId)) {
    return res.status(400).json({ message: "ID de usuario invalido." });
  }

  if (!nome && telefone === undefined) {
    return res.status(400).json({ message: "Informe nome ou telefone para atualizar." });
  }

  const payload = {};
  if (nome) {
    payload.nome = String(nome).trim();
  }
  if (telefone !== undefined) {
    payload.telefone = sanitizeDigits(telefone);
  }

  try {
    const { data, error } = await connection
      .from("usuarios")
      .update(payload)
      .eq("id", usuarioId)
      .select("id, nome, email, telefone")
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuario." });
  }
});

app.patch("/auth/usuarios/atualizar-senha", async (req, res) => {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ message: "E-mail e nova senha sao obrigatorios." });
  }

  if (novaSenha.length < 6) {
    return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
  }

  try {
    const { data, error } = await connection
      .from("usuarios")
      .update({ senha: String(novaSenha) })
      .eq("email", String(email).trim().toLowerCase())
      .select("id, nome, email")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }

    res.json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar senha." });
  }
});

app.post("/auth/usuarios/verificar-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail obrigatorio." });
  }

  try {
    const { data, error } = await connection
      .from("usuarios")
      .select("id, nome, email")
      .eq("email", String(email).trim().toLowerCase())
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "E-mail nao encontrado." });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao verificar e-mail." });
  }
});

app.patch("/usuarios/:id", async (req, res) => {
  const usuarioId = Number(req.params.id);
  const { nome, telefone } = req.body;

  if (!Number.isFinite(usuarioId)) {
    return res.status(400).json({ message: "ID de usuario invalido." });
  }

  if (!nome && telefone === undefined) {
    return res.status(400).json({ message: "Informe nome ou telefone para atualizar." });
  }

  const payload = {};
  if (nome) {
    payload.nome = String(nome).trim();
  }
  if (telefone !== undefined) {
    payload.telefone = sanitizeDigits(telefone);
  }

  try {
    const { data, error } = await connection
      .from("usuarios")
      .update(payload)
      .eq("id", usuarioId)
      .select("id, nome, email, telefone")
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuario." });
  }
});

app.post("/usuarios/:id/foto", async (req, res) => {
  const usuarioId = Number(req.params.id);
  const { base64, extension } = req.body;

  console.log("POST /usuarios/:id/foto called for ID:", usuarioId, "bodyLength:", base64 ? base64.length : 0);

  if (!Number.isFinite(usuarioId)) {
    return res.status(400).json({ message: "ID de usuario invalido." });
  }

  if (!base64 || typeof base64 !== "string") {
    return res.status(400).json({ message: "Imagem em base64 obrigatoria." });
  }

  const safeExtension = extension
    ? String(extension).replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
    : "jpg";
  const fileExt = safeExtension || "jpg";
  const fileName = `${usuarioId}-${Date.now()}.${fileExt}`;
  const filePath = `${usuarioId}/${fileName}`;

  try {
    const imageBuffer = Buffer.from(base64, "base64");

    const { data: uploadData, error: uploadError } = await connection.storage
      .from("fotos-perfil")
      .upload(filePath, imageBuffer, {
        upsert: true,
        contentType: `image/${fileExt}`,
      });

    if (uploadError) {
      console.error("Erro ao enviar imagem para Storage:", uploadError);
      throw uploadError;
    }

    const { data: urlData, error: urlError } = await connection.storage
      .from("fotos-perfil")
      .getPublicUrl(filePath);

    if (urlError) {
      console.error("Erro ao obter URL publica:", urlError);
      throw urlError;
    }

    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) {
      throw new Error("Não foi possível obter a URL pública da imagem.");
    }

    const { data: updateData, error: updateError } = await connection
      .from("usuarios")
      .update({ foto: publicUrl })
      .eq("id", usuarioId)
      .select("foto")
      .single();

    if (updateError) {
      console.error("Erro ao atualizar usuario com foto:", updateError);
      throw updateError;
    }

    res.json({ publicUrl: updateData?.foto || publicUrl });
  } catch (error) {
    console.error("Erro no endpoint de upload de foto:", error);
    res.status(500).json({ message: "Erro ao enviar foto de perfil." });
  }
});

app.patch("/auth/usuarios/atualizar-senha", async (req, res) => {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ message: "E-mail e nova senha sao obrigatorios." });
  }

  if (novaSenha.length < 6) {
    return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
  }

  try {
    const { data, error } = await connection
      .from("usuarios")
      .update({ senha: String(novaSenha) })
      .eq("email", String(email).trim().toLowerCase())
      .select("id, nome, email")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }

    res.json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar senha." });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioId = Number(id);

    if (!Number.isFinite(usuarioId)) {
      return res.status(400).json({ message: "ID de usuario invalido." });
    }

    const { data: usuario, error: usuarioError } = await connection
      .from("usuarios")
      .select("id")
      .eq("id", usuarioId)
      .maybeSingle();

    if (usuarioError) {
      throw usuarioError;
    }

    if (!usuario) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }

    const { error: deleteError } = await connection.from("usuarios").delete().eq("id", usuarioId);

    if (deleteError) {
      throw deleteError;
    }

    res.json({ message: "Conta cancelada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cancelar conta." });
  }
});

app.get("/empresas", async (_req, res) => {
  try {
    const { data, error } = await connection
      .from("empresas")
      .select("id, nome, email, senha, cnpj, telefone, rua, numero, bairro, cep, cidade, estado, bloqueado")
      .order("id", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar empresas." });
  }
});

app.get("/empresas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const empresaId = Number(id);

    if (!Number.isFinite(empresaId)) {
      return res.status(400).json({ message: "ID da empresa invalido." });
    }

    const { data, error } = await connection
      .from("empresas")
      .select("id, nome, email, cnpj, telefone, rua, numero, bairro, cep, cidade, estado, bloqueado")
      .eq("id", empresaId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: "Empresa nao encontrada." });
    }

    res.json(data);
  } catch (error) {
    console.log("ERRO AO BUSCAR EMPRESA:", error);
    res.status(500).json({
      message: "Erro ao buscar empresa.",
      details: error?.message,
      code: error?.code,
    });
  }
});

app.post("/empresas", async (req, res) => {
  const { nome, email, senha, cnpj, telefone, rua, numero, bairro, cep, cidade, estado } = req.body;

  if (!nome || !email || !senha || !cnpj || !telefone) {
    return res.status(400).json({
      message: "Nome, e-mail, senha, CNPJ e telefone sao obrigatorios.",
    });
  }

  const cnpjLimpo = sanitizeDigits(cnpj);
  const telefoneLimpo = sanitizeDigits(telefone);

  try {
    const { data, error } = await connection
      .from("empresas")
      .insert([{ 
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        senha: String(senha),
        cnpj: cnpjLimpo,
        telefone: telefoneLimpo,
        rua: rua ? String(rua).trim() : null,
        numero: numero ? String(numero).trim() : null,
        bairro: bairro ? String(bairro).trim() : null,
        cep: cep ? sanitizeDigits(cep) : null,
        cidade: cidade ? String(cidade).trim() : null,
        estado: estado ? String(estado).trim().toUpperCase() : null,
        bloqueado: false,
      }])
      .select("id, nome, email, senha, cnpj, telefone, rua, numero, bairro, cep, cidade, estado, bloqueado")
      .single();

    if (error) {
      if (isUniqueViolation(error)) {
        return res.status(409).json({ message: "Ja existe empresa com este CNPJ." });
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.log("ERRO AO CADASTRAR EMPRESA:", error);
    res.status(500).json({
      message: "Erro ao cadastrar empresa.",
      details: error?.message,
      code: error?.code,
    });
  }
});

app.post("/auth/empresas/login", async (req, res) => {
  const { cnpj, senha } = req.body;

  if (!cnpj || !senha) {
    return res.status(400).json({
      message: "CNPJ e senha sao obrigatorios."
    });
  }

  const cnpjLimpo = sanitizeDigits(cnpj);

  console.log("================================");
console.log("CNPJ RECEBIDO:", cnpj);
console.log("CNPJ LIMPO:", cnpjLimpo);
console.log("SENHA:", senha);

  try {
    // LOGIN ADMIN
    const { data: admin, error: adminError } = await connection
      .from("admins")
      .select("id, nome, cnpj")
      .eq("cnpj", cnpjLimpo)
      .eq("senha", String(senha))
      .maybeSingle();

      console.log("ADMIN:", admin);
console.log("ADMIN ERROR:", adminError);

    if (adminError) {
      throw adminError;
    }

    if (admin) {
      return res.json({
        tipo: "admin",
        usuario: admin,
      });
    }

    // LOGIN EMPRESA
    const { data: empresa, error } = await connection
      .from("empresas")
      .select(
        "id, nome, email, cnpj, telefone, rua, numero, bairro, cep, cidade, estado, bloqueado, permite_mensalista, is_admin"
      )
      .eq("cnpj", cnpjLimpo)
      .eq("senha", String(senha))
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!empresa) {
      return res.status(401).json({
        message: "Credenciais invalidas."
      });
    }

    if (empresa.bloqueado) {
      return res.status(403).json({
        message:
          "Empresa bloqueada. Entre em contato com o administrador."
      });
    }

    return res.json({
      tipo: "empresa",
      usuario: empresa,
    });
  } catch (error) {
    console.log("ERRO LOGIN:", error);

    return res.status(500).json({
      message: "Erro ao autenticar empresa.",
      details: error?.message,
    });
  }
});

app.patch("/empresas/:id", async (req, res) => {
  const empresaId = Number(req.params.id);

  if (!Number.isFinite(empresaId)) {
    return res.status(400).json({ message: "ID da empresa invalido." });
  }

  const {
    nome,
    telefone,
    rua,
    numero,
    bairro,
    cep,
    cidade,
    estado,
    permite_mensalista,
    bloqueado,
  } = req.body;

  try {
    const { data: atual, error: atualError } = await connection
      .from("empresas")
      .select("*")
      .eq("id", empresaId)
      .maybeSingle();

    if (atualError) {
      throw atualError;
    }

    if (!atual) {
      return res.status(404).json({ message: "Empresa nao encontrada." });
    }

    const payload = {
      nome: nome !== undefined ? String(nome).trim() : atual.nome,
      telefone: telefone !== undefined ? sanitizeDigits(telefone) : atual.telefone,
      rua: rua !== undefined ? (rua ? String(rua).trim() : null) : atual.rua || null,
      numero: numero !== undefined ? (numero ? String(numero).trim() : null) : atual.numero || null,
      bairro: bairro !== undefined ? (bairro ? String(bairro).trim() : null) : atual.bairro || null,
      cep: cep !== undefined ? (cep ? sanitizeDigits(cep) : null) : atual.cep || null,
      cidade: cidade !== undefined ? (cidade ? String(cidade).trim() : null) : atual.cidade || null,
      estado: estado !== undefined ? (estado ? String(estado).trim().toUpperCase() : null) : atual.estado || null,
      permite_mensalista:
        permite_mensalista !== undefined
          ? normalizeBoolean(permite_mensalista)
          : atual.permite_mensalista ?? false,
      bloqueado: bloqueado !== undefined ? normalizeBoolean(bloqueado) : atual.bloqueado ?? false,
    };

    let empresaAtualizada = null;
    let updateError = null;

    ({ data: empresaAtualizada, error: updateError } = await connection
      .from("empresas")
      .update(payload)
      .eq("id", empresaId)
      .select("id, nome, email, cnpj, telefone, rua, numero, bairro, cep, cidade, estado, bloqueado, permite_mensalista, is_admin")
      .single());

    if (isMissingColumnError(updateError)) {
      const payloadBasico = {
        nome: payload.nome,
        telefone: payload.telefone,
        rua: payload.rua,
        numero: payload.numero,
        bairro: payload.bairro,
        cep: payload.cep,
        cidade: payload.cidade,
        estado: payload.estado,
        bloqueado: payload.bloqueado,
      };

      ({ data: empresaAtualizada, error: updateError } = await connection
        .from("empresas")
        .update(payloadBasico)
        .eq("id", empresaId)
        .select("id, nome, email, cnpj, telefone, rua, numero, bairro, cep, cidade, estado, bloqueado")
        .single());
    }

    if (updateError) {
      throw updateError;
    }

    res.json(empresaAtualizada);
  } catch (error) {
    console.error("PATCH /empresas/:id:", error);
    res.status(500).json({ message: mapDbErrorMessage(error, "Erro ao atualizar empresa.") });
  }
});

app.delete("/empresas/:id", async (req, res) => {
  const empresaId = Number(req.params.id);
  const { cnpj } = req.query;

  if (!Number.isFinite(empresaId)) {
    return res.status(400).json({ message: "ID da empresa invalido." });
  }

  try {
    const { data: empresa, error: empresaError } = await connection
      .from("empresas")
      .select("id, cnpj")
      .eq("id", empresaId)
      .maybeSingle();

    if (empresaError) {
      throw empresaError;
    }

    if (!empresa) {
      return res.status(404).json({ message: "Empresa nao encontrada." });
    }

    if (cnpj && sanitizeDigits(cnpj) !== sanitizeDigits(empresa.cnpj)) {
      return res.status(403).json({ message: "CNPJ nao confere com a empresa." });
    }

    const { error: deleteError } = await connection.from("empresas").delete().eq("id", empresaId);

    if (deleteError) {
      throw deleteError;
    }

    res.status(204).send();
  } catch (error) {
    console.error("DELETE /empresas/:id:", error);
    res.status(500).json({ message: mapDbErrorMessage(error, "Erro ao cancelar conta da empresa.") });
  }
});

app.get("/quadras", async (_req, res) => {
  try {
    const { data: quadras, error: quadrasError } = await connection
      .from("quadras")
      .select("*")
      .order("id", { ascending: false });

    if (quadrasError) {
      throw quadrasError;
    }

    const empresaIds = [...new Set((quadras || []).map((q) => q.empresa_id).filter(Boolean))];
    let empresaNomeById = new Map();
    let empresas = [];

    if (empresaIds.length) {
      const { data: empresasData, error: empresasError } = await connection
        .from("empresas")
        .select("id, nome, permite_mensalista")
        .in("id", empresaIds);

      if (empresasError) {
        throw empresasError;
      }

      empresas = empresasData || [];
      empresaNomeById = new Map(empresas.map((empresa) => [empresa.id, empresa.nome]));
    }

    const empresaPermiteMensalistaById = new Map(
      (empresas || []).map((empresa) => [empresa.id, Boolean(empresa.permite_mensalista)]),
    );

    const payload = (quadras || []).map((quadra) => ({
      ...quadra,
      empresa_nome: quadra.empresa_id ? empresaNomeById.get(quadra.empresa_id) || null : null,
      empresa_permite_mensalista: quadra.empresa_id
        ? empresaPermiteMensalistaById.get(quadra.empresa_id) ?? false
        : false,
    }));

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar quadras." });
  }
});

app.post("/quadras", async (req, res) => {
  const { nome, tipo, preco, empresa_id, rua, numero, bairro, cep, cidade } = req.body;

  if (!nome || !empresa_id) {
    return res.status(400).json({ message: "Nome e empresa_id sao obrigatorios." });
  }

  try {
    const empresaId = Number(empresa_id);

    if (!Number.isFinite(empresaId) || empresaId <= 0) {
      return res.status(400).json({ message: "empresa_id invalido." });
    }

    const { data: empresa, error: empresaError } = await connection
      .from("empresas")
      .select("id, nome, permite_mensalista")
      .eq("id", empresaId)
      .maybeSingle();

    if (empresaError) {
      throw empresaError;
    }

    if (!empresa) {
      return res.status(404).json({ message: "Empresa nao encontrada." });
    }

    const basePayload = {
      nome: String(nome).trim(),
      tipo: tipo ? String(tipo).trim() : null,
      preco: normalizePreco(preco),
      empresa_id: empresaId,
    };

    const payloadComEndereco = {
      ...basePayload,
      rua: rua ? String(rua).trim() : null,
      numero: numero ? String(numero).trim() : null,
      bairro: bairro ? String(bairro).trim() : null,
      cep: cep ? sanitizeDigits(cep) || null : null,
      cidade: cidade ? String(cidade).trim() : null,
    };

    const payloadCompleto = buildQuadraExtendedPayload(req.body, payloadComEndereco);

    if (
      payloadCompleto.disponivel_mensalistas === true &&
      !Boolean(empresa.permite_mensalista)
    ) {
      return res.status(400).json({
        message: "A empresa nao permite mensalistas. Ative a opcao no perfil da empresa.",
      });
    }

    let novaQuadra = null;
    let novaQuadraError = null;

    ({ data: novaQuadra, error: novaQuadraError } = await connection
      .from("quadras")
      .insert(payloadCompleto)
      .select("*")
      .single());

    if (isMissingColumnError(novaQuadraError)) {
      ({ data: novaQuadra, error: novaQuadraError } = await connection
        .from("quadras")
        .insert(payloadComEndereco)
        .select("*")
        .single());
    }

    if (isMissingColumnError(novaQuadraError)) {
      ({ data: novaQuadra, error: novaQuadraError } = await connection
        .from("quadras")
        .insert(basePayload)
        .select("*")
        .single());
    }

    if (novaQuadraError) {
      throw novaQuadraError;
    }

    res.status(201).json({
      ...novaQuadra,
      empresa_nome: empresa.nome || null,
    });
  } catch (error) {
    console.error("POST /quadras:", error);
    res.status(500).json({
      message: mapDbErrorMessage(error, "Erro ao cadastrar quadra."),
    });
  }
});

app.put("/quadras/:id", async (req, res) => {
  const { id } = req.params;
  const { empresa_id, nome, tipo, preco, rua, numero, bairro, cep, cidade } = req.body;

  if (!empresa_id) {
    return res.status(400).json({ message: "empresa_id e obrigatorio." });
  }

  try {
    const quadraId = Number(id);
    const empresaId = Number(empresa_id);

    if (!Number.isFinite(quadraId) || !Number.isFinite(empresaId)) {
      return res.status(400).json({ message: "ID invalido." });
    }

    const { data: quadraAtual, error: quadraAtualError } = await connection
      .from("quadras")
      .select("*")
      .eq("id", quadraId)
      .maybeSingle();

    if (quadraAtualError) {
      throw quadraAtualError;
    }

    if (!quadraAtual) {
      return res.status(404).json({ message: "Quadra nao encontrada." });
    }

    if (Number(quadraAtual.empresa_id) !== empresaId) {
      return res.status(403).json({ message: "Sem permissao para editar esta quadra." });
    }

    const hasAnyField =
      nome !== undefined ||
      tipo !== undefined ||
      preco !== undefined ||
      rua !== undefined ||
      numero !== undefined ||
      bairro !== undefined ||
      cep !== undefined ||
      cidade !== undefined;

    if (!hasAnyField) {
      return res.status(400).json({ message: "Informe ao menos um campo para atualizar." });
    }

    const payloadCompleto = {
      nome: nome !== undefined ? String(nome).trim() : quadraAtual.nome,
      tipo: tipo !== undefined ? (tipo ? String(tipo).trim() : null) : quadraAtual.tipo,
      preco: preco !== undefined ? (preco === null || preco === "" ? null : Number(preco)) : quadraAtual.preco,
      rua: rua !== undefined ? (rua ? String(rua).trim() : null) : quadraAtual.rua || null,
      numero: numero !== undefined ? (numero ? String(numero).trim() : null) : quadraAtual.numero || null,
      bairro: bairro !== undefined ? (bairro ? String(bairro).trim() : null) : quadraAtual.bairro || null,
      cep: cep !== undefined ? (cep ? sanitizeDigits(cep) : null) : quadraAtual.cep || null,
      cidade: cidade !== undefined ? (cidade ? String(cidade).trim() : null) : quadraAtual.cidade || null,
    };

    const payloadComExtended = buildQuadraExtendedPayload(req.body, payloadCompleto);

    const { data: empresaMensalista, error: empresaMensalistaError } = await connection
      .from("empresas")
      .select("permite_mensalista")
      .eq("id", empresaId)
      .maybeSingle();

    if (empresaMensalistaError) {
      throw empresaMensalistaError;
    }

    if (
      payloadComExtended.disponivel_mensalistas === true &&
      !Boolean(empresaMensalista?.permite_mensalista)
    ) {
      return res.status(400).json({
        message: "A empresa nao permite mensalistas. Ative a opcao no perfil da empresa.",
      });
    }

    let quadraAtualizada = null;
    let quadraAtualizadaError = null;

    ({ data: quadraAtualizada, error: quadraAtualizadaError } = await connection
      .from("quadras")
      .update(payloadComExtended)
      .eq("id", quadraId)
      .select("*")
      .single());

    if (isMissingColumnError(quadraAtualizadaError)) {
      const payloadSemExtended = {
        nome: payloadCompleto.nome,
        tipo: payloadCompleto.tipo,
        preco: payloadCompleto.preco,
        rua: payloadCompleto.rua,
        numero: payloadCompleto.numero,
        bairro: payloadCompleto.bairro,
        cep: payloadCompleto.cep,
        cidade: payloadCompleto.cidade,
      };

      ({ data: quadraAtualizada, error: quadraAtualizadaError } = await connection
        .from("quadras")
        .update(payloadSemExtended)
        .eq("id", quadraId)
        .select("*")
        .single());
    }

    if (isMissingColumnError(quadraAtualizadaError)) {
      const payloadSemEndereco = {
        nome: payloadCompleto.nome,
        tipo: payloadCompleto.tipo,
        preco: payloadCompleto.preco,
      };

      ({ data: quadraAtualizada, error: quadraAtualizadaError } = await connection
        .from("quadras")
        .update(payloadSemEndereco)
        .eq("id", quadraId)
        .select("*")
        .single());
    }

    if (quadraAtualizadaError) {
      throw quadraAtualizadaError;
    }

    const { data: empresa, error: empresaError } = await connection
      .from("empresas")
      .select("nome")
      .eq("id", empresaId)
      .maybeSingle();

    if (empresaError) {
      throw empresaError;
    }

    res.json({
      ...quadraAtualizada,
      empresa_nome: empresa?.nome || null,
    });
  } catch (error) {
    console.error("PUT /quadras/:id:", error);
    res.status(500).json({
      message: mapDbErrorMessage(error, "Erro ao atualizar quadra."),
    });
  }
});

app.delete("/quadras/:id", async (req, res) => {
  const { id } = req.params;
  const empresaId = Number(req.query.empresa_id);

  if (!Number.isFinite(empresaId)) {
    return res.status(400).json({ message: "empresa_id e obrigatorio." });
  }

  try {
    const quadraId = Number(id);

    if (!Number.isFinite(quadraId)) {
      return res.status(400).json({ message: "ID de quadra invalido." });
    }

    const { data: quadraAtual, error: quadraAtualError } = await connection
      .from("quadras")
      .select("id, empresa_id")
      .eq("id", quadraId)
      .maybeSingle();

    if (quadraAtualError) {
      throw quadraAtualError;
    }

    if (!quadraAtual) {
      return res.status(404).json({ message: "Quadra nao encontrada." });
    }

    if (Number(quadraAtual.empresa_id) !== empresaId) {
      return res.status(403).json({ message: "Sem permissao para excluir esta quadra." });
    }

    const { error: deleteError } = await connection.from("quadras").delete().eq("id", quadraId);

    if (deleteError) {
      throw deleteError;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir quadra." });
  }
});

app.get("/avaliacoes", async (req, res) => {
  const quadraId = Number(req.query.quadra_id);

  if (!Number.isFinite(quadraId)) {
    return res.status(400).json({ message: "quadra_id e obrigatorio." });
  }

  try {
    const { data, error } = await connection
      .from("avaliacoes")
      .select("id, usuario_id, quadra_id, nota, comentario, criado_em")
      .eq("quadra_id", quadraId)
      .order("criado_em", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar avaliacoes." });
  }
});

app.post("/avaliacoes", async (req, res) => {
  const { usuario_id, quadra_id, nota, comentario } = req.body;

  if (!usuario_id || !quadra_id || nota === undefined || nota === null) {
    return res.status(400).json({
      message: "usuario_id, quadra_id e nota sao obrigatorios.",
    });
  }

  const notaNumero = Number(nota);

  if (!Number.isInteger(notaNumero) || notaNumero < 1 || notaNumero > 5) {
    return res.status(400).json({ message: "A nota deve ser um numero inteiro entre 1 e 5." });
  }

  try {
    const usuarioId = Number(usuario_id);
    const quadraId = Number(quadra_id);

    const { data: usuario, error: usuarioError } = await connection
      .from("usuarios")
      .select("id")
      .eq("id", usuarioId)
      .maybeSingle();

    if (usuarioError) {
      throw usuarioError;
    }

    if (!usuario) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }

    const { data: quadra, error: quadraError } = await connection
      .from("quadras")
      .select("id")
      .eq("id", quadraId)
      .maybeSingle();

    if (quadraError) {
      throw quadraError;
    }

    if (!quadra) {
      return res.status(404).json({ message: "Quadra nao encontrada." });
    }

    const { data, error } = await connection
      .from("avaliacoes")
      .insert({
        usuario_id: usuarioId,
        quadra_id: quadraId,
        nota: notaNumero,
        comentario: comentario ? String(comentario).trim() : null,
      })
      .select("id, usuario_id, quadra_id, nota, comentario, criado_em")
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar avaliacao." });
  }
});

app.get("/reservas", async (_req, res) => {
  try {
    const { data: reservas, error: reservasError } = await connection
      .from("reservas")
      .select("id, usuario_id, quadra_id, data, horario")
      .order("data", { ascending: false })
      .order("horario", { ascending: false });

    if (reservasError) {
      throw reservasError;
    }

    const usuarioIds = [...new Set((reservas || []).map((r) => r.usuario_id).filter(Boolean))];
    const quadraIds = [...new Set((reservas || []).map((r) => r.quadra_id).filter(Boolean))];

    let usuariosById = new Map();
    if (usuarioIds.length) {
      const { data: usuarios, error: usuariosError } = await connection
        .from("usuarios")
        .select("id, nome")
        .in("id", usuarioIds);

      if (usuariosError) {
        throw usuariosError;
      }

      usuariosById = new Map((usuarios || []).map((usuario) => [usuario.id, usuario.nome]));
    }

    let quadrasById = new Map();
    if (quadraIds.length) {
      const { data: quadras, error: quadrasError } = await connection
        .from("quadras")
        .select("id, nome")
        .in("id", quadraIds);

      if (quadrasError) {
        throw quadrasError;
      }

      quadrasById = new Map((quadras || []).map((quadra) => [quadra.id, quadra.nome]));
    }

    const payload = (reservas || []).map((reserva) => ({
      ...reserva,
      usuario_nome: reserva.usuario_id ? usuariosById.get(reserva.usuario_id) || null : null,
      quadra_nome: reserva.quadra_id ? quadrasById.get(reserva.quadra_id) || null : null,
    }));

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar reservas." });
  }
});

app.post("/reservas", async (req, res) => {
  const { usuario_id, quadra_id, data, horario } = req.body;

  if (!usuario_id || !quadra_id || !data || !horario) {
    return res.status(400).json({
      message: "usuario_id, quadra_id, data e horario sao obrigatorios.",
    });
  }

  try {
    const usuarioId = Number(usuario_id);
    const quadraId = Number(quadra_id);

    const { data: usuario, error: usuarioError } = await connection
      .from("usuarios")
      .select("id, nome")
      .eq("id", usuarioId)
      .maybeSingle();

    if (usuarioError) {
      throw usuarioError;
    }

    if (!usuario) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }

    const { data: quadra, error: quadraError } = await connection
      .from("quadras")
      .select("id, nome")
      .eq("id", quadraId)
      .maybeSingle();

    if (quadraError) {
      throw quadraError;
    }

    if (!quadra) {
      return res.status(404).json({ message: "Quadra nao encontrada." });
    }

    const { data: conflito, error: conflitoError } = await connection
      .from("reservas")
      .select("id")
      .eq("quadra_id", quadraId)
      .eq("data", data)
      .eq("horario", horario)
      .maybeSingle();

    if (conflitoError) {
      throw conflitoError;
    }

    if (conflito) {
      return res.status(409).json({ message: "Horario ja reservado para esta quadra." });
    }

    const { data: novaReserva, error: novaReservaError } = await connection
      .from("reservas")
      .insert({
        usuario_id: usuarioId,
        quadra_id: quadraId,
        data,
        horario,
      })
      .select("id, usuario_id, quadra_id, data, horario")
      .single();

    if (novaReservaError) {
      throw novaReservaError;
    }

    res.status(201).json({
      ...novaReserva,
      usuario_nome: usuario.nome || null,
      quadra_nome: quadra.nome || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar reserva." });
  }
});

app.delete("/reservas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const reservaId = Number(id);

    if (!Number.isFinite(reservaId)) {
      return res.status(400).json({ message: "ID de reserva invalido." });
    }

    const { data, error } = await connection
      .from("reservas")
      .delete()
      .eq("id", reservaId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: "Reserva nao encontrada." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir reserva." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});