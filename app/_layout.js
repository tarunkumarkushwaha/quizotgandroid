import React from "react";
import { Stack } from "expo-router";
import ReduxProvider from "../store/Redux";

export default function RootLayout() {
  return (
      <ReduxProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ReduxProvider>
  );
}