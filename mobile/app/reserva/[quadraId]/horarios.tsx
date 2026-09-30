import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { TopBar } from "@/src/components/TopBar";
import { styles } from "@/src/styles/reserva-horarios.styles";
import { buscarUsuarioSessao, limparUsuarioSessao } from "@/src/storage/usuarioSession";
import { listarReservas } from "@/src/services/reservasApi";
import { listarQuadras, type QuadraApi } from "@/src/services/quadrasApi";
import type { UsuarioApi } from "@/src/services/authApi";

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const HORARIOS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
];

function formatDateIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDatePt(dateIso: string) {
  const [year, month, day] = dateIso.split("-");
  return `${day}/${month}/${year}`;
}

export default function ReservaHorariosScreen() {
  const { quadraId, mensalista, jogadores, nivel } = useLocalSearchParams<{
    quadraId: string;
    mensalista?: string;
    jogadores?: string;
    nivel?: string;
  }>();

  const [usuario, setUsuario] = useState<UsuarioApi | null>(null);
  const [quadra, setQuadra] = useState<QuadraApi | null>(null);
  const [reservados, setReservados] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState(formatDateIso(new Date()));
  const [selectedHour, setSelectedHour] = useState("");

  const nextSevenDays = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(base);
      date.setDate(base.getDate() + index);
      return {
        iso: formatDateIso(date),
        dayName: WEEK_DAYS[date.getDay()],
        dayNumber: String(date.getDate()).padStart(2, "0"),
      };
    });
  }, []);

  useEffect(() => {
    async function carregarDados() {
      const sessao = await buscarUsuarioSessao();
      if (!sessao) {
        Alert.alert("Sessao expirada", "Faca login novamente.");
        router.replace("/login-pf");
        return;
      }
      setUsuario(sessao);

      try {
        const [quadras, reservas] = await Promise.all([listarQuadras(), listarReservas()]);
        const atual = quadras.find((item) => String(item.id) === String(quadraId)) || null;
        if (!atual) {
          Alert.alert("Reserva", "Quadra nao encontrada.");
          router.replace("/home");
          return;
        }
        setQuadra(atual);

        const slotsReservados = reservas
          .filter((reserva) => String(reserva.quadra_id) === String(quadraId))
          .map((reserva) => `${reserva.data}|${reserva.horario.slice(0, 5)}`);
        setReservados(new Set(slotsReservados));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao carregar horarios.";
        Alert.alert("Reserva", message);
      }
    }

    void carregarDados();
  }, [quadraId]);

  function handleIrParaPagamento() {
    if (!usuario || !quadra) {
      return;
    }
    if (!selectedHour) {
      Alert.alert("Reserva", "Selecione um horario para continuar.");
      return;
    }

    router.push({
      pathname: `/reserva/${quadraId}/pagamento` as never,
      params: {
        quadraId: String(quadraId),
        quadraNome: quadra.nome,
        data: selectedDate,
        horario: selectedHour,
        valor: String(quadra.preco ?? 0),
        usuarioId: String(usuario.id),
        mensalista: mensalista ?? "nao",
        jogadores: jogadores ?? "",
        nivel: nivel ?? "",
      },
    });
  }

  return (
    <View style={styles.screen}>
      <TopBar
        onBack={() => router.back()}
        enableMenu
        tipoUsuario="pf"
        onLogout={async () => {
          await limparUsuarioSessao();
          router.replace("/escolher-tipo");
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dia e horario da reserva</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
          {nextSevenDays.map((day) => (
            <TouchableOpacity
              key={day.iso}
              style={[styles.dayButton, selectedDate === day.iso ? styles.dayButtonActive : null]}
              onPress={() => {
                setSelectedDate(day.iso);
                setSelectedHour("");
              }}
            >
              <Text style={styles.dayText}>{day.dayName}</Text>
              <Text style={styles.dayNumber}>{day.dayNumber}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.sectionTitle}>Horarios disponiveis</Text>
        {HORARIOS.map((hour) => {
          const isBooked = reservados.has(`${selectedDate}|${hour}`);
          const isSelected = selectedHour === hour;
          return (
            <TouchableOpacity
              key={hour}
              disabled={isBooked}
              style={[
                styles.slotItem,
                isBooked ? styles.slotItemBlocked : null,
                isSelected ? styles.slotItemSelected : null,
              ]}
              onPress={() => setSelectedHour(hour)}
            >
              <Text style={styles.slotText}>{hour}</Text>
              <Text
                style={[
                  styles.slotStatus,
                  isBooked ? styles.slotStatusBlocked : null,
                  isSelected ? styles.slotStatusSelected : null,
                ]}
              >
                {isBooked ? "Ocupado" : isSelected ? "Selecionado" : "Livre"}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Quadra: {quadra?.nome ?? "-"}</Text>
          <Text style={styles.summaryText}>Dia: {formatDatePt(selectedDate)}</Text>
          <Text style={styles.summaryText}>Hora: {selectedHour || "Nao selecionada"}</Text>
          <Text style={styles.summaryText}>Mensalista: {mensalista === "sim" ? "Sim" : "Nao"}</Text>
          <Text style={styles.summaryText}>Jogadores: {jogadores ?? "-"}</Text>
          <Text style={styles.summaryText}>Nivel: {nivel ?? "-"}</Text>
          <Text style={styles.summaryText}>
            Valor: {typeof quadra?.preco === "number" ? `R$ ${quadra.preco.toFixed(2)}` : "Consultar"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.actionButton, !selectedHour ? styles.actionButtonDisabled : null]}
          onPress={handleIrParaPagamento}
          disabled={!selectedHour}
        >
          <Text style={styles.actionButtonText}>Ir para Pagamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}