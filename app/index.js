import { Image, StyleSheet } from "react-native";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const signIn = useSelector((state) => state.quiz.signIn);
  const navigation = useNavigation();

  const TestSetting = () => {
    navigation.navigate("start");
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
        <Text style={styles.title}>Welcome to QuizOTG!</Text>
        <Text style={styles.description}>
          Master your knowledge with our diverse range of quizzes and
          challenges. Choose your subject, and dive into a world of 
          quizzes designed to challenge. Start exploring now and unlock your
          potential!
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {signIn ? (
          <TouchableOpacity
            onPress={TestSetting}
            style={styles.startTestButton}
          >
            <Text style={styles.buttonText}>Start Test</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => console.log("More details")}
            style={styles.moreDetailsButton}
          >
            <Text style={styles.buttonText}>Click for more detail</Text>
          </TouchableOpacity>
        )}
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
  },
  moreDetailsButton: {
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
  },
  buttonText: {
    color: "#333333",
    fontSize: 20,
    fontWeight: "bolder",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
});
