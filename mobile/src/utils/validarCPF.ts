export function formatarCPF(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11)

  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
}

export function cpfTem11Digitos(valor: string) {
  return valor.replace(/\D/g, "").length === 11
}