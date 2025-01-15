import React, { useState, useRef, useContext, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import SingleQuestion from "../components/SingleQuestion";
import Timer from "../components/Timer";
import { useSelector, useDispatch } from "react-redux";
import { setstart, setaddResult, incrementInCorrectResponse, incrementCorrectResponse } from "../store/quizSlice";

import { useFocusEffect } from "@react-navigation/native";

const Test = () => {
  const [questionNO, setQuestionNO] = useState(0);
  const [response, setresponse] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const result = useSelector((state) => state.quiz.result);
  const signIn = useSelector((state) => state.quiz.signIn);
  const start = useSelector((state) => state.quiz.start);
  const dispatch = useDispatch();

  const resetState = () => {
    setQuestionNO(0);
    setresponse("");
    setDisabled(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      resetState();
    }, [])
  );

  const navigation = useNavigation();

  const trueSound =
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_b8c9103636.mp3?filename=correct-83487.mp3";
  const falseSound =
    "https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=negative_beeps-6008.mp3";

  const playSound = async (soundUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: soundUrl });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const checkAnsQuick = () => {
    if (result.TestQuestion.questions[questionNO].correctresponse === response) {
      dispatch(incrementCorrectResponse());

      playSound(trueSound);
      Alert.alert("Correct", "Your answer is correct!");
    } else {
      dispatch(incrementInCorrectResponse());
      playSound(falseSound);
      Alert.alert("Incorrect", "Your answer is incorrect.");
    }
    setDisabled(true);
  };

  const yourNext = () => {

    if (questionNO + 1 < result.TestQuestion.questions.length - 1) {
      setQuestionNO((prev) => prev + 1);
      response && checkanswer();
      setDisabled(false);
      setresponse("");
    } else {
      Alert.alert("Last Question", "This is the last question.");
      // console.log("last questions")
    }
  };

  const checkanswer = () => {
    if (!disabled) {
      const isCorrect =
        response === result.TestQuestion.questions[questionNO].correctresponse;
      isCorrect ? dispatch(incrementCorrectResponse()) : dispatch(incrementInCorrectResponse())
    }
  };

  const updateTimeLeft = (remainingTime) => {
    const totalTime = result.TestQuestion.time * 60;
    const elapsedTimeInSeconds = totalTime - remainingTime;
    dispatch(setaddResult({
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

  const finalSubmit = (remainingTime = 0) => {
    response && checkanswer();
    updateTimeLeft(remainingTime);
    Alert.alert("Success", "Test submitted successfully");
    setstart(false);
    navigation.navigate("results");
  };

  // console.log(start, "visited test page")

  return (
    <View style={[styles.container, styles.lightBackground]}>
      <Timer
        finalSubmit={finalSubmit}
        setRemainingTime={setRemainingTime}
        remainingTime={remainingTime}
      />
      {signIn ? (
        result.TestQuestion && (
          <View style={styles.questionContainer}>
            <SingleQuestion
              question={result.TestQuestion.questions[questionNO]}
              disabled={disabled}
              questionNO={questionNO}
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