-- Migration: campos de mensalista, admin e detalhes de quadra
alter table public.empresas add column if not exists permite_mensalista boolean not null default false;
alter table public.empresas add column if not exists is_admin boolean not null default false;

alter table public.quadras add column if not exists horario_inicio varchar(10);
alter table public.quadras add column if not exists horario_fim varchar(10);
alter table public.quadras add column if not exists min_jogadores integer;
alter table public.quadras add column if not exists max_jogadores integer;
alter table public.quadras add column if not exists disponivel_mensalistas boolean default false;
alter table public.quadras add column if not exists disponivel_avulso boolean default true;
alter table public.quadras add column if not exists foto_url text;
