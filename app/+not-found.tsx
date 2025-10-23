import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Página não encontrada</Text>
        <Text style={styles.description}>A página que você procura não existe.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar para o início</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.surface,
  },
});
