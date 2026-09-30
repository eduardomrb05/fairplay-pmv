import { apiRequest } from "./api";

export type AvaliacaoApi = {
  id: number;
  usuario_id: number;
  quadra_id: number;
  nota: number;
  comentario: string | null;
  criado_em?: string | null;
};

type CriarAvaliacaoInput = {
  usuario_id: number;
  quadra_id: number;
  nota: number;
  comentario?: string | null;
};

export function criarAvaliacao(payload: CriarAvaliacaoInput) {
  return apiRequest<AvaliacaoApi>("/avaliacoes", {
    method: "POST",
    body: payload,
  });
}

export function listarAvaliacoesPorQuadra(quadraId: number) {
  return apiRequest<AvaliacaoApi[]>(`/avaliacoes?quadra_id=${quadraId}`);
}
