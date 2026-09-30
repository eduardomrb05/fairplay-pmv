create table if not exists public.usuarios (
  id bigint generated always as identity primary key,
  nome varchar(100) not null,
  email varchar(100) not null unique,
  senha varchar(255) not null,
  telefone varchar(20)
);

create table if not exists public.empresas (
  id bigint generated always as identity primary key,
  nome varchar(100) not null,
  cnpj varchar(20) not null unique,
  contato varchar(100) not null
);

create table if not exists public.quadras (
  id bigint generated always as identity primary key,
  nome varchar(100) not null,
  tipo varchar(50),
  preco numeric(10, 2),
  empresa_id bigint not null references public.empresas(id) on delete cascade,
  rua varchar(150),
  numero varchar(20),
  bairro varchar(100),
  cep varchar(20),
  cidade varchar(100)
);

create table if not exists public.avaliacoes (
  id bigint generated always as identity primary key,
  usuario_id bigint not null references public.usuarios(id) on delete cascade,
  quadra_id bigint not null references public.quadras(id) on delete cascade,
  nota smallint not null check (nota >= 1 and nota <= 5),
  comentario text,
  criado_em timestamptz not null default now()
);

create table if not exists public.reservas (
  id bigint generated always as identity primary key,
  usuario_id bigint not null references public.usuarios(id) on delete cascade,
  quadra_id bigint not null references public.quadras(id) on delete cascade,
  data date not null,
  horario time not null,
  constraint reservas_quadra_data_horario_unique unique (quadra_id, data, horario)
);
