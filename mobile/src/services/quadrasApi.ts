import { apiRequest } from "./api";

export type QuadraApi = {
  id: number;
  nome: string;
  tipo: string | null;
  preco: number | null;
  empresa_id: number;
  empresa_nome: string | null;
  empresa_permite_mensalista?: boolean;
  rua?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cep?: string | null;
  cidade?: string | null;
  horario_inicio?: string | null;
  horario_fim?: string | null;
  min_jogadores?: number | null;
  max_jogadores?: number | null;
  disponivel_mensalistas?: boolean | null;
  disponivel_avulso?: boolean | null;
  foto_url?: string | null;
  foto?: string | null;
};

type QuadraPayload = {
  nome: string;
  tipo?: string | null;
  preco?: number | null;
  empresa_id: number;
  rua?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cep?: string | null;
  cidade?: string | null;
  horario_inicio?: string | null;
  horario_fim?: string | null;
  min_jogadores?: number | null;
  max_jogadores?: number | null;
  disponivel_mensalistas?: boolean | null;
  disponivel_avulso?: boolean | null;
  foto_url?: string | null;
};

type AtualizarQuadraInput = QuadraPayload & {
  empresa_id: number;
};

export function cadastrarQuadra(payload: QuadraPayload) {
  return apiRequest<QuadraApi>("/quadras", {
    method: "POST",
    body: payload,
  });
}

export function listarQuadras() {
  return apiRequest<QuadraApi[]>("/quadras");
}

export function atualizarQuadra(id: number, payload: AtualizarQuadraInput) {
  return apiRequest<QuadraApi>(`/quadras/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function excluirQuadra(id: number, empresaId: number) {
  return apiRequest<void>(`/quadras/${id}?empresa_id=${empresaId}`, {
    method: "DELETE",
  });
}

export async function cadastrarAvaliacao(payload: {
  quadra_id: number;
  usuario_id: string;
  estrelas: number;
  comentario: string;
}) {
  return await apiRequest("/avaliacoes", {
    method: "POST",
    body: payload,
  });
}
