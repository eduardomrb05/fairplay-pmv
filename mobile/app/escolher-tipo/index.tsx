import { ImageBackground, View, Text, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { styles } from "../../src/styles/escolher-tipo.styles"

export default function EscolherTipo() {
  const router = useRouter()

  return (
    <ImageBackground
      source={require("../../assets/images/background.jpg")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.logoArea}>
            <Image
              source={require("../../assets/images/FairPlay nome abaixo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.buttonsWrapper}>
            <View style={styles.buttonsArea}>
              <TouchableOpacity
                style={styles.blueButton}
                onPress={() => router.push("/login-pf")}
              >
                <Text style={styles.buttonText}>CPF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blueButton}
                onPress={() => router.push("/login-pj")}
              >
                <Text style={styles.buttonText}>CNPJ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.yellowButton}
                onPress={() => router.push("/escolher-cadastro")}
              >
                <Text style={styles.buttonText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}
