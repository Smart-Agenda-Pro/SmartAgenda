import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

type State = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console for now — you can integrate Sentry, Bugsnag, etc.
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  handleReload = () => {
    // On mobile it's common to try a soft reload or ask user to restart app
    Alert.alert('Reiniciar aplicativo', 'Por favor, reinicie o aplicativo para recuperar o estado.', [
      { text: 'Fechar', style: 'cancel' },
      { text: 'Reiniciar', onPress: () => {
        // Attempt to reload by throwing to the native dev menu or exit — fallback: do nothing
        // In production we can't programmatically restart the app reliably; instruct the user
      } }
    ]);
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ocorreu um erro</Text>
          <Text style={styles.message}>{this.state.error?.message || 'Erro inesperado'}</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReload}>
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  message: { textAlign: 'center', color: '#666', marginBottom: 16 },
  button: { backgroundColor: '#2f80ed', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
