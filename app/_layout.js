import React, {
  createContext,
  useState,
} from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asseet loading is completee.
SplashScreen.preventAutoHideAsync();
export const DataContext = createContext();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [signIn, setsignIn] = useState(true);
  const [result, setresult] = useState({
    TestQuestion: {
      time: 1, // in minutes
      questions: [
        // ... question
      ],
    },
    correctresponse: 0,
    incorrectresponse: 0,
    subject: "indianGK",
    timeLeft: { min: 0, sec: 0 },
    timeTaken: { min: 0, sec: 0 },
  });
  const [CustomQuestions, setCustomQuestions] = useState([]);
  const [start, setstart] = useState(false);
  const [timeover, setTimeover] = useState(false);

  const storeData = async (key, value) => {
    try {
      const stringifiedObject = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringifiedObject);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    const saveResult = () => {
      storeData("result", result);
    };
    !isLoading && saveResult();
  }, [result]);

  // console.log(result);

  return (
      <DataContext.Provider
        value={{
          isLoading,
          setIsLoading,
          start,
          setstart,
          timeover,
          setTimeover,
          signIn,
          setsignIn,
          CustomQuestions,
          setCustomQuestions,
          result,
          setresult,
          storeData,
        }}
      >
        <Stack screenOptions={{ headerShown: false }}/>
      </DataContext.Provider>
  );
}

