import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { styles } from "../../src/styles/adm-empresas.styles";
import { supabase } from "../../src/services/supabase.js";

type Empresa = {
  id: number;
  nome: string;
  cnpj: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  bloqueado: boolean;
};

export default function AdmEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  async function carregarEmpresas() {
    const { data, error } = await supabase
      .from("empresas")
      .select(
        "id, nome, cnpj, rua, numero, bairro, cep, cidade, estado, bloqueado"
      )
      .order("nome", { ascending: true });

    if (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar as empresas.");
      return;
    }

    setEmpresas(data || []);
  }

  async function alterarStatus(empresa: Empresa) {
    const novoStatus = !empresa.bloqueado;

    const { error } = await supabase
      .from("empresas")
      .update({ bloqueado: novoStatus })
      .eq("id", empresa.id);

    if (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível alterar o status.");
      return;
    }

    setEmpresas((listaAtual) =>
      listaAtual.map((item) =>
        item.id === empresa.id
          ? { ...item, bloqueado: novoStatus }
          : item
      )
    );
  }

  useEffect(() => {
    carregarEmpresas();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/Icone FairPlay oficial.png")}
            style={styles.logo}
          />

          <View style={{ width: 90 }} />
        </View>

        <FlatList
          data={empresas}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 30 }}>
              Nenhuma empresa encontrada
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoArea}>
                <Text style={styles.infoText}>
                  {item.nome || "Nome não informado"}
                </Text>
                <Text style={styles.infoText}>
                  {item.cnpj || "CNPJ não informado"}
                </Text>
                <Text style={styles.infoText}>
                  {item.rua || "Rua / Avenida não informada"}
                </Text>
                <Text style={styles.infoText}>
                  {item.numero || "Número não informado"}
                </Text>
                <Text style={styles.infoText}>
                  {item.bairro || "Bairro não informado"}
                </Text>
                <Text style={styles.infoText}>
                  {item.cep || "CEP não informado"}
                </Text>
                <Text style={styles.infoText}>
                  {item.cidade || "Cidade não informada"}
                </Text>
                <Text style={styles.infoText}>
                  {item.estado || "Estado não informado"}
                </Text>
              </View>

              <View style={styles.rightArea}>
                <Image
                  source={require("../../assets/images/Icone FairPlay oficial.png")}
                  style={styles.companyIcon}
                />

                <View style={styles.buttonsArea}>
                  <TouchableOpacity
                    onPress={() => alterarStatus(item)}
                    style={[
                      styles.statusBadge,
                      item.bloqueado
                        ? styles.statusRed
                        : styles.statusYellow,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {item.bloqueado ? "Bloqueado" : "Ativo"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accessButton}
                    onPress={() =>
                      router.push({
                        pathname: "/adm-perfil-empresas",
                        params: {
                          id: String(item.id),
                        },
                      })
                    }
                  >
                    <Text style={styles.accessText}>ACESSAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}