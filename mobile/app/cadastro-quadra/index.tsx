import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { styles } from "@/src/styles/cadastro-quadra.styles";
import { atualizarQuadra, cadastrarQuadra, listarQuadras } from "@/src/services/quadrasApi";
import { buscarEmpresaSessao, limparEmpresaSessao } from "@/src/storage/empresaSession";
import type { EmpresaApi } from "@/src/services/authApi";
import { TopBar } from "@/src/components/TopBar";

const modalidades = ["Volei", "Futebol", "Futsal", "Basquete", "Tenis", "Beach Tenis"];

const diasSemana = [
  { key: "dom", label: "Dom" },
  { key: "seg", label: "Seg" },
  { key: "ter", label: "Ter" },
  { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" },
  { key: "sex", label: "Sex" },
  { key: "sab", label: "Sab" },
];

type OpcaoSimNao = "sim" | "nao" | "";

function parseNumeroOpcional(valor?: string): number | null {
  if (valor === undefined) return null;

  const trimmed = valor.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? parsed : null;
}

function simNaoFromBoolean(valor?: boolean | null): OpcaoSimNao {
  if (valor === true) {
    return "sim";
  }
  if (valor === false) {
    return "nao";
  }
  return "";
}

function booleanFromSimNao(valor: OpcaoSimNao): boolean | null {
  if (valor === "sim") {
    return true;
  }
  if (valor === "nao") {
    return false;
  }
  return null;
}

function RadioOption({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: "sim" | "nao";
  selected: OpcaoSimNao;
  onSelect: (value: OpcaoSimNao) => void;
}) {
  const ativo = selected === value;

  return (
    <TouchableOpacity style={styles.radioOption} onPress={() => onSelect(value)}>
      <View style={[styles.radioCircle, ativo ? styles.radioCircleAtiva : null]}>
        {ativo ? <View style={styles.radioInner} /> : null}
      </View>
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function CadastroQuadra() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { width } = useWindowDimensions();
  const isEdicao = Boolean(id);
  const cardWidth = Math.min(width - 48, 560);

  const [empresa, setEmpresa] = useState<EmpresaApi | null>(null);
  const [nomeQuadra, setNomeQuadra] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [preco, setPreco] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [minJogadores, setMinJogadores] = useState("");
  const [maxJogadores, setMaxJogadores] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [disponivelMensalistas, setDisponivelMensalistas] = useState<OpcaoSimNao>("");
  const [disponivelAvulso, setDisponivelAvulso] = useState<OpcaoSimNao>("sim");
  const [horarioAvulsoInicio, setHorarioAvulsoInicio] = useState("");
  const [horarioAvulsoFim, setHorarioAvulsoFim] = useState("");
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [bloquearQuadra, setBloquearQuadra] = useState<OpcaoSimNao>("");
  const [bloquearHorario, setBloquearHorario] = useState<OpcaoSimNao>("");
  const [horariosBloqueados, setHorariosBloqueados] = useState<string[]>([""]);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuadra, setIsLoadingQuadra] = useState(false);

  useEffect(() => {
    async function carregarEmpresa() {
      const empresaSessao = await buscarEmpresaSessao();

      if (!empresaSessao) {
        Alert.alert("Sessao expirada", "Faca login novamente como empresa.");
        router.replace("/login-pj");
        return;
      }

      setEmpresa(empresaSessao);

      if (id) {
        try {
          setIsLoadingQuadra(true);
          const quadras = await listarQuadras();
          const quadra = quadras.find((item) => String(item.id) === String(id));

          if (!quadra || Number(quadra.empresa_id) !== Number(empresaSessao.id)) {
            Alert.alert("Edicao de quadra", "Quadra nao encontrada.");
            router.back();
            return;
          }

          setNomeQuadra(quadra.nome || "");
          setModalidade(quadra.tipo || "");
          setPreco(typeof quadra.preco === "number" ? String(quadra.preco).replace(".", ",") : "");
          setHorarioInicio(quadra.horario_inicio || "");
          setHorarioFim(quadra.horario_fim || "");
          setMinJogadores(quadra.min_jogadores ? String(quadra.min_jogadores) : "");
          setMaxJogadores(quadra.max_jogadores ? String(quadra.max_jogadores) : "");
          setRua(quadra.rua || "");
          setNumero(quadra.numero || "");
          setBairro(quadra.bairro || "");
          setCep(quadra.cep || "");
          setCidade(quadra.cidade || "");
          setDisponivelMensalistas(simNaoFromBoolean(quadra.disponivel_mensalistas));
          setDisponivelAvulso(simNaoFromBoolean(quadra.disponivel_avulso) || "sim");
          setFotoUri(quadra.foto_url || null);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erro ao carregar quadra.";
          Alert.alert("Edicao de quadra", message);
        } finally {
          setIsLoadingQuadra(false);
        }
      }
    }

    void carregarEmpresa();
  }, [id]);

  const payloadPreco = useMemo(() => {
    if (!preco.trim()) {
      return null;
    }
    const normalizado = preco.replace(",", ".").trim();
    const parsed = Number(normalizado);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [preco]);

  const empresaPermiteMensalista = Boolean(empresa?.permite_mensalista);

  function ajustarContador(
    valorAtual: string,
    delta: number,
    setter: (value: string) => void,
    minimo = 0,
  ) {
    const atual = parseNumeroOpcional(valorAtual) ?? minimo;
    const proximo = Math.max(minimo, atual + delta);
    setter(String(proximo));
  }

  function alternarDia(dia: string) {
    setDiasSelecionados((atual) =>
      atual.includes(dia) ? atual.filter((item) => item !== dia) : [...atual, dia],
    );
  }

  async function handleSelecionarFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissao", "Permita acesso a galeria para adicionar foto da quadra.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (resultado.canceled || !resultado.assets[0]?.uri) {
      return;
    }

    setFotoUri(resultado.assets[0].uri);
  }

  function validarFormulario(): string | null {
    if (!nomeQuadra.trim()) {
      return "Informe o nome da quadra.";
    }

    if (!modalidade.trim()) {
      return "Selecione a modalidade.";
    }

    if (Number.isNaN(payloadPreco)) {
      return "Digite um preco valido.";
    }

    const min = parseNumeroOpcional(minJogadores);
    const max = parseNumeroOpcional(maxJogadores);

    if (Number.isNaN(min) || Number.isNaN(max)) {
      return "Min e max de jogadores devem ser numeros validos.";
    }

    if (min !== null && min < 1) {
      return "O minimo de jogadores deve ser pelo menos 1.";
    }

    if (max !== null && max < 1) {
      return "O maximo de jogadores deve ser pelo menos 1.";
    }

    if (min !== null && max !== null && min > max) {
      return "O minimo de jogadores nao pode ser maior que o maximo.";
    }

    if (disponivelMensalistas === "sim" && !empresaPermiteMensalista) {
      return "Ative a opcao de mensalista no perfil da empresa antes de disponibilizar esta quadra.";
    }

    return null;
  }

  function limparFormulario() {
    setNomeQuadra("");
    setModalidade("");
    setPreco("");
    setHorarioInicio("");
    setHorarioFim("");
    setMinJogadores("");
    setMaxJogadores("");
    setRua("");
    setNumero("");
    setBairro("");
    setCep("");
    setCidade("");
    setDisponivelMensalistas("");
    setDisponivelAvulso("sim");
    setHorarioAvulsoInicio("");
    setHorarioAvulsoFim("");
    setDiasSelecionados([]);
    setBloquearQuadra("");
    setBloquearHorario("");
    setHorariosBloqueados([""]);
    setFotoUri(null);
  }

  function montarPayload() {
    const min = parseNumeroOpcional(minJogadores);
    const max = parseNumeroOpcional(maxJogadores);

    const payload = {
      nome: nomeQuadra.trim(),
      tipo: modalidade.trim(),
      preco: payloadPreco,
      rua: rua.trim() || null,
      numero: numero.trim() || null,
      bairro: bairro.trim() || null,
      cep: cep.trim() || null,
      cidade: cidade.trim() || null,
      horario_inicio: horarioInicio.trim() || null,
      horario_fim: horarioFim.trim() || null,
      min_jogadores: min,
      max_jogadores: max,
      disponivel_mensalistas: booleanFromSimNao(disponivelMensalistas),
      disponivel_avulso: booleanFromSimNao(disponivelAvulso),
      foto_url: fotoUri,
    };

    console.log("MONTAR PAYLOAD:", payload);

    return payload;
  }

  async function handleSalvar() {
    if (!empresa) {
      return Alert.alert("Cadastro de quadra", "Sessao da empresa nao encontrada.");
    }

    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      return Alert.alert(isEdicao ? "Edicao de quadra" : "Cadastro de quadra", erroValidacao);
    }

    try {
      setIsSubmitting(true);
      const payload = montarPayload();

      if (isEdicao && id) {
        await atualizarQuadra(Number(id), {
          ...payload,
          empresa_id: empresa.id,
        });
        Alert.alert("Sucesso", "Quadra atualizada com sucesso!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await cadastrarQuadra({
          ...payload,
          empresa_id: empresa.id,
        });
        Alert.alert("Sucesso", "Quadra cadastrada com sucesso!");
        limparFormulario();
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(isEdicao ? "Edicao de quadra" : "Cadastro de quadra", error.message);
      } else {
        Alert.alert(isEdicao ? "Edicao de quadra" : "Cadastro de quadra", "Erro ao salvar quadra.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <TopBar
        onBack={() => router.back()}
        enableMenu
        tipoUsuario="pj"
        onLogout={async () => {
          await limparEmpresaSessao();
          router.replace("/login-pj");
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 96 : 18}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{isEdicao ? "Editar quadra" : "Cadastro de quadra"}</Text>

          <View style={[styles.card, { width: cardWidth, maxWidth: "100%" }]}>
            <TouchableOpacity style={styles.imageBox} onPress={handleSelecionarFoto}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.imagePreview} />
              ) : (
                <Text style={styles.imagePlaceholderText}>Imagem da quadra</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageAction} onPress={handleSelecionarFoto}>
              <Text style={styles.imageActionText}>{fotoUri ? "Alterar foto" : "Adicionar foto"}</Text>
            </TouchableOpacity>

            <Text style={[styles.label, styles.labelObrigatorio]}>Nome da quadra *</Text>
            <TextInput
              style={styles.input}
              value={nomeQuadra}
              onChangeText={setNomeQuadra}
              placeholder="Ex: Quadra 01"
            />

            <Text style={[styles.label, styles.labelObrigatorio]}>Modalidade *</Text>
            <View style={styles.modalidadesRow}>
              {modalidades.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalidadeChip,
                    modalidade === item ? styles.modalidadeChipAtiva : null,
                  ]}
                  onPress={() => setModalidade(item)}
                >
                  <Text
                    style={[
                      styles.modalidadeChipText,
                      modalidade === item ? styles.modalidadeChipTextAtiva : null,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label]}>Horario de funcionamento</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputSmall}
                value={horarioInicio}
                onChangeText={setHorarioInicio}
                placeholder="08:00"
              />
              <Text style={styles.rowDivider}>as</Text>
              <TextInput
                style={styles.inputSmall}
                value={horarioFim}
                onChangeText={setHorarioFim}
                placeholder="22:00"
              />
            </View>
            <Text style={styles.helperNote}>*Cada agendamento sera reservado 1 hora minimo</Text>

            <Text style={[styles.label]}>Min / Max jogadores</Text>
            <View style={styles.stepperRow}>
              <View style={styles.stepperGroup}>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() => ajustarContador(minJogadores, -1, setMinJogadores, 1)}
                >
                  <Text style={styles.stepperButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.stepperInput}
                  value={minJogadores}
                  onChangeText={setMinJogadores}
                  placeholder=""
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() => ajustarContador(minJogadores, 1, setMinJogadores, 1)}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
              </View>

            </View>
            <View style={styles.stepperRow}>
              <View style={styles.stepperGroup}>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() => ajustarContador(maxJogadores, -1, setMaxJogadores, 1)}
                >
                  <Text style={styles.stepperButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.stepperInput}
                  value={maxJogadores}
                  onChangeText={setMaxJogadores}
                  placeholder=""
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() => ajustarContador(maxJogadores, 1, setMaxJogadores, 1)}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.label]}>Rua / Avenida</Text>
            <TextInput style={styles.input} value={rua} onChangeText={setRua} />

            <Text style={[styles.label]}>Numero</Text>
            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />

            <Text style={[styles.label]}>Bairro</Text>
            <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />

            <Text style={[styles.label]}>CEP</Text>
            <TextInput
              style={styles.input}
              value={cep}
              onChangeText={(text) => setCep(text.replace(/\D/g, "").slice(0, 8))}
              keyboardType="numeric"
            />

            <Text style={[styles.label]}>Cidade</Text>
            <TextInput style={styles.input} value={cidade} onChangeText={setCidade} />

            <Text style={[styles.label]}>Valor por hora (R$)</Text>
            <TextInput
              style={styles.input}
              value={preco}
              onChangeText={setPreco}
              keyboardType="decimal-pad"
              placeholder="200,00"
            />

            {empresaPermiteMensalista ? (
              <>
                <Text style={[styles.label]}>
                  Quadra disponivel para mensalistas?
                </Text>
                <View style={styles.radioRow}>
                  <RadioOption
                    label="Sim"
                    value="sim"
                    selected={disponivelMensalistas}
                    onSelect={setDisponivelMensalistas}
                  />
                  <RadioOption
                    label="Nao"
                    value="nao"
                    selected={disponivelMensalistas}
                    onSelect={setDisponivelMensalistas}
                  />
                </View>
              </>
            ) : (
              <Text style={styles.helperNote}>
                Para oferecer mensalista nesta quadra, ative a opcao no perfil da empresa.
              </Text>
            )}

            <Text style={[styles.label]}>
              Esta quadra estara disponivel para jogar avulso?
            </Text>
            <View style={styles.radioRow}>
              <RadioOption
                label="Sim"
                value="sim"
                selected={disponivelAvulso}
                onSelect={setDisponivelAvulso}
              />
              <RadioOption label="Nao" value="nao" selected={disponivelAvulso} onSelect={setDisponivelAvulso} />
            </View>

            {disponivelAvulso === "sim" ? (
              <>
                <Text style={[styles.label]}>Horario disponivel</Text>
                <View style={styles.row}>
                  <TextInput
                    style={styles.inputSmall}
                    value={horarioAvulsoInicio}
                    onChangeText={setHorarioAvulsoInicio}
                    placeholder="08:00"
                  />
                  <Text style={styles.rowDivider}>as</Text>
                  <TextInput
                    style={styles.inputSmall}
                    value={horarioAvulsoFim}
                    onChangeText={setHorarioAvulsoFim}
                    placeholder="22:00"
                  />
                </View>
              </>
            ) : null}

            <Text style={[styles.label]}>Defina o dia da semana</Text>
            <View style={styles.diasRow}>
              {diasSemana.map((dia) => {
                const ativo = diasSelecionados.includes(dia.key);

                return (
                  <TouchableOpacity
                    key={dia.key}
                    style={[styles.diaChip, ativo ? styles.diaChipAtiva : null]}
                    onPress={() => alternarDia(dia.key)}
                  >
                    <Text style={[styles.diaChipText, ativo ? styles.diaChipTextAtiva : null]}>
                      {dia.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.label]}>Deseja bloquear essa quadra?</Text>
            <View style={styles.radioRow}>
              <RadioOption
                label="Sim"
                value="sim"
                selected={bloquearQuadra}
                onSelect={setBloquearQuadra}
              />
              <RadioOption label="Nao" value="nao" selected={bloquearQuadra} onSelect={setBloquearQuadra} />
            </View>

            <Text style={[styles.label]}>Deseja bloquear algum horario?</Text>
            <View style={styles.radioRow}>
              <RadioOption
                label="Sim"
                value="sim"
                selected={bloquearHorario}
                onSelect={setBloquearHorario}
              />
              <RadioOption
                label="Nao"
                value="nao"
                selected={bloquearHorario}
                onSelect={setBloquearHorario}
              />
            </View>

            {bloquearHorario === "sim" ? (
              <>
                <Text style={[styles.label]}>Horarios</Text>
                {horariosBloqueados.map((horario, index) => (
                  <View key={`horario-bloqueio-${index}`} style={styles.horarioBloqueioRow}>
                    <TextInput
                      style={styles.horarioBloqueioInput}
                      value={horario}
                      onChangeText={(text) => {
                        const copia = [...horariosBloqueados];
                        copia[index] = text;
                        setHorariosBloqueados(copia);
                      }}
                      placeholder="Ex: 14:00"
                    />
                    {index === horariosBloqueados.length - 1 ? (
                      <TouchableOpacity
                        style={styles.addHorarioButton}
                        onPress={() => setHorariosBloqueados((atual) => [...atual, ""])}
                      >
                        <Text style={styles.addHorarioText}>+</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))}
              </>
            ) : null}

            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.voltarButton} onPress={() => router.back()}>
                <Text style={styles.voltarText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting || isLoadingQuadra ? styles.submitButtonDisabled : null]}
                onPress={handleSalvar}
                disabled={isSubmitting || isLoadingQuadra}
              >
                <Text style={styles.submitText}>
                  {isSubmitting ? "Salvando..." : isEdicao ? "Salvar alteracoes" : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
