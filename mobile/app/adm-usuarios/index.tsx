import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { styles } from "../../src/styles/adm-usuarios.styles";
import { supabase } from "../../src/services/supabase.js";
import { Ionicons } from "@expo/vector-icons";

type Usuario = {
    id: string;
    nome: string;
    cpf: string;
    idade?: string;
    cidade?: string;
    bloqueado: boolean;
};

export default function AdmUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    async function carregarUsuarios() {
        const { data, error } = await supabase
            .from("usuarios")
            .select("id, nome, cpf, idade, cidade, bloqueado")
            .order("nome", { ascending: true });

        if (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível carregar os usuários.");
            return;
        }

        setUsuarios(data || []);
    }

    async function alterarStatus(usuario: Usuario) {
        const novoStatus = !usuario.bloqueado;

        const { error } = await supabase
            .from("usuarios")
            .update({ bloqueado: novoStatus })
            .eq("id", usuario.id);

        if (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível alterar o status.");
            return;
        }

        setUsuarios((listaAtual) =>
            listaAtual.map((item) =>
                item.id === usuario.id
                    ? { ...item, bloqueado: novoStatus }
                    : item
            )
        );
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    return (
        <View style={styles.screen}>

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={28}
                            color="#000"
                        />
                    </TouchableOpacity>

                    <Image
                        source={require("../../assets/images/Icone FairPlay oficial.png")}
                        style={styles.logo}
                    />

                </View>

                <FlatList
                    data={usuarios}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={{ textAlign: "center", marginTop: 30 }}>
                            Nenhum usuário encontrado
                        </Text>
                    }
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <View style={styles.infoArea}>
                                <Text style={styles.infoText}>{item.nome}</Text>
                                <Text style={styles.infoText}>{item.cpf}</Text>
                                <Text style={styles.infoText}>{item.idade || "Idade não informada"}</Text>
                                <Text style={styles.infoText}>{item.cidade || "Cidade não informada"}</Text>
                            </View>

                            <View style={styles.rightArea}>
                                <Image
                                    source={require("../../assets/images/Icone FairPlay oficial.png")}
                                    style={styles.avatar}
                                />

                                <View style={styles.buttonsRow}>
                                    <TouchableOpacity
                                        onPress={() => alterarStatus(item)}
                                        style={[
                                            styles.statusBadge,
                                            item.bloqueado ? styles.statusRed : styles.statusYellow,
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
                                                pathname: "/adm-perfil-usuario",
                                                params: {
                                                    id: item.id,
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