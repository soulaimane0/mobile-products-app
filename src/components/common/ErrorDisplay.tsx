import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Title, Text } from "react-native-paper";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  onRetry,
  onGoBack,
}) => (
  <View style={styles.container}>
    <Title style={styles.title}>Error</Title>
    <Text style={styles.message}>{message}</Text>
    <View style={styles.buttonContainer}>
      {onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          style={styles.button}
          icon="refresh"
        >
          Retry
        </Button>
      )}
      {onGoBack && (
        <Button
          mode="outlined"
          onPress={onGoBack}
          style={styles.button}
          icon="arrow-left"
        >
          Go Back
        </Button>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    color: "#f44336",
    marginBottom: 8,
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  button: {
    marginHorizontal: 8,
  },
});
