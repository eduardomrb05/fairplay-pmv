import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { styles } from "../../src/styles/escolher-cadastro.styles"
import { TopBar } from "@/src/components/TopBar"

export default function EscolherCadastro() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <TopBar onBack={() => router.push("/escolher-tipo")} />
      <View style={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/cadastro-pf")}
        >
          <Text style={styles.text}>Pessoa Física</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/cadastro-pj")}
        >
          <Text style={styles.text}>Pessoa Jurídica</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}