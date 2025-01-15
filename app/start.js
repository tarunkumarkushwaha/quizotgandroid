// import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setstart, setaddResult } from "../store/quizSlice";
import { useRouter } from "expo-router";
import FileUploadComponent from "../components/FileUploadComponent";

export default function Start() {
  const [questionLength, setquestionLength] = useState(10)
  const [customQuestion, setcustomQuestion] = useState(false)
  const [maxquestionLength, setmaxquestionLength] = useState(10)
  const result = useSelector((state) => state.quiz.result);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRouter();

  const questionModules = {
    javascript: () => import("../assets/questions/javascriptquestions"),
    react: () => import("../assets/questions/reactquestions"),
    html: () => import("../assets/questions/htmlquestions"),
    css: () => import("../assets/questions/cssquestions"),
    indianGK: () => import("../assets/questions/indianGKquestions"),
    wordpress: () => import("../assets/questions/wordpressquestions"),
    math: () => import("../assets/questions/mathquestions"),
    python: () => import("../assets/questions/pythonquestions"),
    science: () => import("../assets/questions/sciencequestions"),
    reasoning: () => import("../assets/questions/reasoningquestions"),
    funny: () => import("../assets/questions/funnyquestions"),
  };

  function randomShuffle(array) {
    const newArray = [];
    const copyArray = [...array];
    while (copyArray.length) {
      const randomIndex = Math.floor(Math.random() * copyArray.length);
      newArray.push(copyArray.splice(randomIndex, 1)[0]);
    }
    return newArray;
  }

  const loadQuestions = async () => {
    try {
      if (result.subject == "custom") {
        return
      }
      if (questionModules[result.subject]) {
        const module = await questionModules[result.subject]();
        setmaxquestionLength(module.default.questions.length)
        let slicedQuestions = randomShuffle(module.default.questions).slice(0, questionLength)
        dispatch(setaddResult({ TestQuestion: { time: parseInt(questionLength), questions: slicedQuestions } }));
      } else {
        Alert.alert("Notice", `No questions found for ${result.subject}`);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const startTest = async () => {
    dispatch(setaddResult({
      correctresponse: 0,
      incorrectresponse: 0,
    }));
    await loadQuestions();
    dispatch(setstart(true));
    navigation.navigate("test");
  };

  const pickerHandler = (value) => {
    if (value == "custom") {
      setcustomQuestion(true)
    } else { setcustomQuestion(false) }
    dispatch(setaddResult({
      subject: value,
    }));
  };

  useEffect(() => {
    loadQuestions();
  }, [result.subject, questionLength]);

  useFocusEffect(
    React.useCallback(() => {
      loadQuestions();
      setcustomQuestion(false)
    }, [])
  );

  let noarr = Array.from({ length: maxquestionLength }, (_, index) => index + 1)

  // console.log(" questions", result.TestQuestion);

  return (
    <View style={styles.mainContainer}>
      <Image
        source={{
          uri: "https://cdn.pixabay.com/photo/2017/02/05/04/24/question-2039124_1280.jpg",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {/* <TouchableOpacity onPress={() => router.dismissAll()} style={styles.backButton}> */}
      <TouchableOpacity onPress={() => router.dismissAll()} style={styles.backButton}>
        <Image
          source={{ uri: "https://img.icons8.com/stickers/50/back.png" }}
          style={{ width: 25, height: 25 }}
        />
      </TouchableOpacity>
      <Text style={styles.header}>Test Settings</Text>
      <View style={styles.settingsContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Subject</Text>
          <Picker
            selectedValue={result.subject}
            onValueChange={pickerHandler}
            style={styles.picker}
          >
            <Picker.Item label="General Knowledge" value="indianGK" />
            <Picker.Item label="Math" value="math" />
            <Picker.Item label="Python" value="python" />
            <Picker.Item label="Science" value="science" />
            <Picker.Item label="funny" value="funny" />
            <Picker.Item label="Reasoning" value="reasoning" />
            <Picker.Item label="HTML" value="html" />
            <Picker.Item label="CSS" value="css" />
            <Picker.Item label="JavaScript" value="javascript" />
            <Picker.Item label="React" value="react" />
            <Picker.Item label="WordPress" value="wordpress" />
            <Picker.Item label="custom questions" value="custom" />
          </Picker>
        </View>
        {!customQuestion ? <View style={styles.pickerContainer}>
          <Text style={styles.label}>Question Length</Text>
          <Picker
            selectedValue={questionLength}
            onValueChange={(value) => setquestionLength(value)}
            style={styles.picker}
          >
            {noarr.map((num) => <Picker.Item key={num} label={num.toString()} value={num} />)}
          </Picker>
        </View>
          :
          <FileUploadComponent randomShuffle={randomShuffle} setmaxquestionLength={setmaxquestionLength} />
        }

        <TouchableOpacity onPress={startTest} style={styles.button}>
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>

        {!customQuestion && <View style={styles.container}>
          <Text style={styles.title}>Test Rules</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              Test has a specified time limit. Ensure to complete it within the
              given time.
            </Text>
            <Text style={styles.listItem}>
              Once you move to the next question, you cannot return to the
              previous one.
            </Text>
            <Text style={styles.listItem}>
              Do not close the page during the test; it may cancel your test.
            </Text>
            <Text style={styles.listItem}>
              Do not navigate to other pages or minimize screen
            </Text>
            <Text style={styles.listItem}>
              Typing is not permitted, so do not use keyboard ( and you dont have one)
            </Text>
          </View>
        </View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#008000",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
},
buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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

  mainContainer: {
    flex: 1,
    backgroundColor: "#282c34",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  settingsContainer: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  pickerContainer: {
    marginVertical: 10,
    width: "100%",
  },
  label: {
    color: "#ffffff",
    marginBottom: 5,
    textAlign: "left",
    width: "100%",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#ffffff",
    backgroundColor: "#555",
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  container: {
    backgroundColor: "#f2f2f2",
    padding: 24,
    marginTop: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    marginBottom: 8,
    color: "#333",
    textAlign: "left",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
});

