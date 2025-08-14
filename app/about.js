import { Image, StyleSheet } from "react-native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
// import FileUploadComponent from "../components/FileUploadComponent";
// import { useSelector } from "react-redux";

export default function AboutScreen() {
//   const signIn = useSelector((state) => state.quiz.signIn);
  const navigation = useNavigation();
  const router = useRouter();

  const goToHomePage = () => {
    router.dismissAll();
  };

  return (
    <View style={styles.mainContainer}>
      <Image
        source={{
          uri: "https://cdn.pixabay.com/photo/2017/02/05/04/24/question-2039124_1280.jpg",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.overlay} />
      <Text style={styles.logoText}>QUIZOTG</Text>
      <View style={styles.contentContainer}>
      <Text style={styles.title}>About QuizOTG</Text>
      <Text style={styles.description}>
        QuizOTG is your ultimate quiz companion, designed to help you explore your skills, or simply having fun,
      </Text>
      <Text style={styles.title}>Features:</Text>
      <Text style={styles.description}>- Generate your questions powered by gemini AI</Text>
      <Text style={styles.description}>- Custom test with your questions</Text>
      <Text style={styles.description}>- Diverse quizzes across multiple categories</Text>
      <Text style={styles.description}>- User-friendly interface</Text>
      <Text style={styles.description}>- No ads</Text>
      {/* <Text style={styles.description}>Thank you for choosing QuizOTG!</Text> */}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goToHomePage} style={styles.aboutButton}>
          <Text style={styles.aboutButtonText}>Back To home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    textShadow: "3px 3px 3px #ffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "linear-gradient(90deg, #FFD700, #FFFFCC)",
  },

  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)",
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginHorizontal: 20,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  startTestButton: {
    backgroundColor: "#ffff",
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
    marginBottom: 10,
  },
  moreDetailsButton: {
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
    marginBottom: 10,
  },
  aboutButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
  },
  aboutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

