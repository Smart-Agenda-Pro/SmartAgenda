import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import colors from '@/constants/colors';
import { Scissors } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { signIn, updatePassword } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      console.log('[Login] Attempting login:', email);
      const { error } = await signIn(email.trim(), password);

      if (error) {
        console.error('[Login] Error:', error);
        Alert.alert('Erro ao fazer login', 'Email ou senha incorretos');
      } else {
        console.log('[Login] Success, navigating...');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('[Login] Exception:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      console.log('[Login] Updating password for:', resetEmail);
      const { error } = await updatePassword(resetEmail.trim(), newPassword);

      if (error) {
        console.error('[Login] Update password error:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a senha. Verifique se o email está correto.');
      } else {
        Alert.alert(
          'Senha Atualizada',
          'Sua senha foi alterada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowResetPassword(false);
                setResetEmail('');
                setNewPassword('');
                setConfirmPassword('');
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('[Login] Exception:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Scissors size={48} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Barbearia Pro</Text>
            <Text style={styles.subtitle}>
              {showResetPassword ? 'Recuperar Senha' : 'Sistema de Gestão'}
            </Text>
          </View>

          {!showResetPassword ? (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                  testID="email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!loading}
                  testID="password-input"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                testID="login-button"
              >
                {loading ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPassword}
                disabled={loading}
                onPress={() => setShowResetPassword(true)}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.resetDescription}>
                Digite seu email e escolha uma nova senha.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.textLight}
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                  testID="reset-email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nova Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textLight}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!loading}
                  testID="new-password-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!loading}
                  testID="confirm-password-input"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
                testID="reset-button"
              >
                {loading ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <Text style={styles.buttonText}>Redefinir Senha</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToLogin}
                disabled={loading}
                onPress={() => {
                  setShowResetPassword(false);
                  setResetEmail('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.backToLoginText}>Voltar para o login</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {showResetPassword
                ? 'Digite seu email cadastrado e escolha uma nova senha segura'
                : 'Use suas credenciais fornecidas pelo administrador'}
            </Text>
          </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  resetDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});
