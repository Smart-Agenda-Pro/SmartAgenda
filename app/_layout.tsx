import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from './components/ErrorBoundary';
import { Alert } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'cadastros';

    console.log('[RootLayout] Auth state:', { isAuthenticated, inAuthGroup, segments });

    if (!isAuthenticated && inAuthGroup) {
      console.log('[RootLayout] Redirecting to login');
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      console.log('[RootLayout] Redirecting to tabs');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments, router]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Voltar" }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cadastros/clientes" options={{ headerShown: true, title: "Clientes" }} />
      <Stack.Screen name="cadastros/servicos" options={{ headerShown: true, title: "Serviços" }} />
      <Stack.Screen name="cadastros/produtos" options={{ headerShown: true, title: "Produtos" }} />
      <Stack.Screen name="clientes/gerenciar" options={{ headerShown: false }} />
      <Stack.Screen name="servicos/gerenciar" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Install a global JS error handler to avoid immediate app crash on uncaught exceptions
    // Keep a reference to the default handler so we can delegate after logging
    // @ts-ignore
    const defaultHandler = (ErrorUtils as any)?.getGlobalHandler?.();
    // @ts-ignore
    const globalHandler = (error: any, isFatal?: boolean) => {
      try {
        console.error('[GlobalError] Uncaught error', { error, isFatal });
      } catch (e) {
        // ignore
      }
      try {
        Alert.alert('Erro', 'Ocorreu um erro inesperado. Por favor, reinicie o aplicativo.');
      } catch (e) {
        // ignore
      }
      if (defaultHandler) {
        try { defaultHandler(error, isFatal); } catch (e) { /* ignore */ }
      }
    };
    // @ts-ignore
    if ((ErrorUtils as any)?.setGlobalHandler) {
      // @ts-ignore
      (ErrorUtils as any).setGlobalHandler(globalHandler);
    }

    return () => {
      if ((ErrorUtils as any)?.setGlobalHandler && defaultHandler) {
        // @ts-ignore
        (ErrorUtils as any).setGlobalHandler(defaultHandler);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
