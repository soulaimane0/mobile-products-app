import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Paragraph, Title } from "react-native-paper";

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  buttonText,
  onButtonPress,
}) => (
  <View style={styles.container}>
    <Title style={styles.title}>{title}</Title>
    <Paragraph style={styles.message}>{message}</Paragraph>
    {buttonText && onButtonPress && (
      <Button mode="contained" onPress={onButtonPress} style={styles.button}>
        {buttonText}
      </Button>
    )}
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
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
});
