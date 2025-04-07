import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme, appColors } from "../src/theme";
import { LogBox } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function RootLayout() {
  // Use effect at the top level of the function component
  useEffect(() => {
    LogBox.ignoreLogs([
      "AsyncStorage has been extracted from react-native core",
      "Possible Unhandled Promise Rejection",
      "Non-serializable values were found in the navigation state",
    ]);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar
            style="light"
            backgroundColor={appColors.statusBar.background}
          />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: appColors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              contentStyle: {
                backgroundColor: appColors.background,
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: "Products",
              }}
            />
            <Stack.Screen
              name="product/[id]"
              options={{
                title: "Product Details",
              }}
            />
            <Stack.Screen
              name="product/add"
              options={{
                title: "Add Product",
              }}
            />
            <Stack.Screen
              name="product/edit/[id]"
              options={{
                title: "Edit Product",
              }}
            />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
