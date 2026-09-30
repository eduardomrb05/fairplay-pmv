import { apiRequest } from "./api";

export type ReservaApi = {
  id: number;
  usuario_id: number;
  quadra_id: number;
  data: string;
  horario: string;
  usuario_nome?: string | null;
  quadra_nome?: string | null;
};

type CriarReservaInput = {
  usuario_id: number;
  quadra_id: number;
  data: string;
  horario: string;
};

export function listarReservas() {
  return apiRequest<ReservaApi[]>("/reservas");
}

export function criarReserva(payload: CriarReservaInput) {
  return apiRequest<ReservaApi>("/reservas", {
    method: "POST",
    body: payload,
  });
}

export function cancelarReserva(id: number) {
  return apiRequest<void>(`/reservas/${id}`, {
    method: "DELETE",
  });
}
