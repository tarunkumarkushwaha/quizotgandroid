import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SingleQuestion from "../components/SingleQuestion";
import Timer from "../components/Timer";
import { DataContext } from "./_layout";

const Test = () => {
  const [questionNO, setQuestionNO] = useState(0);
  const [response, setresponse] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); 
  const { result, setresult, signIn, setstart, start } =
    useContext(DataContext);

  const navigation = useNavigation();
  const currentsong = useRef();
  const currentsong2 = useRef();

  const trueSound =
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_b8c9103636.mp3?filename=correct-83487.mp3";
  const falseSound =
    "https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=negative_beeps-6008.mp3";

  const checkAnsQuick = () => {
    if (
      result.TestQuestion.questions[questionNO].correctresponse === response
    ) {
      setresult((prevState) => ({
        ...prevState,
        correctresponse: prevState.correctresponse + 1,
      }));

      currentsong.current.play();
      Alert.alert("Correct", "Your answer is correct!");
    } else {
      setresult((prevState) => ({
        ...prevState,
        incorrectresponse: prevState.incorrectresponse + 1,
      }));

      currentsong2.current.play();
      Alert.alert("Incorrect", "Your answer is incorrect.");
    }
    setDisabled(true);
  };

  const yourNext = () => {
    checkanswer();
    setDisabled(false);
    setresponse("");
    if (questionNO < result.TestQuestion.questions.length - 1) {
      setQuestionNO((prev) => prev + 1);
    } else {
      Alert.alert("Last Question", "This is the last question.");
    }
  };

  const checkanswer = () => {
    // console.log("ans check");
    if (!disabled) {
      const isCorrect =
        response === result.TestQuestion.questions[questionNO].correctresponse;

      setresult((prevState) => ({
        ...prevState,
        correctresponse: isCorrect
          ? prevState.correctresponse + 1
          : prevState.correctresponse,
        incorrectresponse: !isCorrect
          ? prevState.incorrectresponse + 1
          : prevState.incorrectresponse,
      }));
    }
  };

  const updateTimeLeft = (remainingTime) => {
    // console.log("update time");
    
    const totalTime = result.TestQuestion.time * 60; 
    const elapsedTimeInSeconds = totalTime - remainingTime;
  
    setresult((prevState) => ({
      ...prevState,
      timeLeft: {
        min: Math.floor(remainingTime / 60), 
        sec: remainingTime % 60,
      },
      timeTaken: {
        min: Math.floor(elapsedTimeInSeconds / 60), 
        sec: elapsedTimeInSeconds % 60,
      },
    }));
  };  

  const finalSubmit = (remainingTime) => {
  
    checkanswer();

    updateTimeLeft(remainingTime);

    Alert.alert("Success", "Test submitted successfully");
    setstart(false);
    navigation.navigate("results");
  };

  return (
    <View style={[styles.container, styles.lightBackground]}>
      <audio
        src={trueSound}
        loop={false}
        ref={currentsong}
        crossOrigin={"anonymous"}
      ></audio>
      <audio
        src={falseSound}
        loop={false}
        ref={currentsong2}
        crossOrigin={"anonymous"}
      ></audio>
      <Timer finalSubmit={finalSubmit} setRemainingTime={setRemainingTime} remainingTime={remainingTime} />
      {signIn ? (
        result.TestQuestion && (
          <View style={styles.questionContainer}>
            
            <SingleQuestion
              question={result.TestQuestion.questions[questionNO]}
              disabled={disabled}
              response={response}
              setresponse={setresponse}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={yourNext} style={styles.button}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={checkAnsQuick} style={styles.button}>
                <Text style={styles.buttonText}>Check</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => finalSubmit(remainingTime)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Final Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      ) : (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Please log in to use the app</Text>
          {/* <Button title="Login" onPress={() => navigation.navigate("Login")} /> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  darkBackground: {
    backgroundColor: "#333",
  },
  lightBackground: {
    backgroundColor: "#f0f8ff",
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  loginPrompt: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
});

export default Test;
