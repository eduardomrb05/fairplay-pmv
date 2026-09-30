export function formatarTelefone(valor: string) {
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);

  if (apenasNumeros.length <= 10) {
    return apenasNumeros
      .replace(/^(\d{0,2})/, "($1")
      .replace(/^(\(\d{2})(\d{0,4})/, "$1) $2")
      .replace(/(\d{4})(\d{0,4})$/, "$1-$2");
  }

  return apenasNumeros
    .replace(/^(\d{0,2})/, "($1")
    .replace(/^(\(\d{2})(\d{0,5})/, "$1) $2")
    .replace(/(\d{5})(\d{0,4})$/, "$1-$2");
}