import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import {
  Plus,
  Search,
  UserCog,
  Phone,
  Mail,
  X,
  Check,
  Briefcase,
} from 'lucide-react-native';

type Funcionario = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  cargo: string;
  salario: number;
  ativo: boolean;
  dataAdmissao: string;
};

export default function FuncionariosScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cargo: '',
    salario: '',
    dataAdmissao: '',
  });

  const [funcionarios] = useState<Funcionario[]>([
    {
      id: '1',
      nome: 'Carlos Silva',
      telefone: '(11) 98765-4321',
      email: 'carlos@email.com',
      cargo: 'Barbeiro',
      salario: 3500.0,
      ativo: true,
      dataAdmissao: '2023-01-15',
    },
    {
      id: '2',
      nome: 'Ana Santos',
      telefone: '(11) 98765-1234',
      email: 'ana@email.com',
      cargo: 'Recepcionista',
      salario: 2200.0,
      ativo: true,
      dataAdmissao: '2023-06-10',
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      telefone: '(11) 98765-5678',
      email: 'pedro@email.com',
      cargo: 'Barbeiro',
      salario: 3200.0,
      ativo: true,
      dataAdmissao: '2025-03-01',
    },
  ]);

  const filteredFuncionarios = funcionarios.filter((funcionario) =>
    funcionario.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (funcionario?: Funcionario) => {
    if (funcionario) {
      setEditingFuncionario(funcionario);
      setFormData({
        nome: funcionario.nome,
        telefone: funcionario.telefone,
        email: funcionario.email || '',
        cargo: funcionario.cargo,
        salario: funcionario.salario.toString(),
        dataAdmissao: funcionario.dataAdmissao,
      });
    } else {
      setEditingFuncionario(null);
      setFormData({ nome: '', telefone: '', email: '', cargo: '', salario: '', dataAdmissao: '' });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingFuncionario(null);
    setFormData({ nome: '', telefone: '', email: '', cargo: '', salario: '', dataAdmissao: '' });
  };

  const handleSave = () => {
    if (!formData.nome || !formData.telefone || !formData.cargo) {
      Alert.alert('Erro', 'Nome, telefone e cargo são obrigatórios');
      return;
    }
    Alert.alert('Sucesso', 'Funcionário salvo com sucesso!');
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou cargo..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
          activeOpacity={0.7}
        >
          <Plus size={24} color={colors.surface} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.funcionariosList}>
          {filteredFuncionarios.map((funcionario) => (
            <TouchableOpacity
              key={funcionario.id}
              style={styles.funcionarioCard}
              onPress={() => handleOpenModal(funcionario)}
              activeOpacity={0.7}
            >
              <View style={styles.funcionarioHeader}>
                <View style={styles.funcionarioAvatar}>
                  <UserCog size={24} color='#10B981' strokeWidth={2} />
                </View>
                <View style={styles.funcionarioInfo}>
                  <Text style={styles.funcionarioName}>{funcionario.nome}</Text>
                  <View style={styles.funcionarioDetail}>
                    <Briefcase size={14} color={colors.textSecondary} />
                    <Text style={styles.funcionarioDetailText}>
                      {funcionario.cargo}
                    </Text>
                  </View>
                  <View style={styles.funcionarioDetail}>
                    <Phone size={14} color={colors.textSecondary} />
                    <Text style={styles.funcionarioDetailText}>
                      {funcionario.telefone}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.funcionarioStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    R$ {funcionario.salario.toFixed(2)}
                  </Text>
                  <Text style={styles.statLabel}>Salário</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.statLabel}>Admissão</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.nome}
                  onChangeText={(text) =>
                    setFormData({ ...formData, nome: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cargo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Barbeiro, Recepcionista"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.cargo}
                  onChangeText={(text) =>
                    setFormData({ ...formData, cargo: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.telefone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, telefone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@exemplo.com"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Salário (R$)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.salario}
                    onChangeText={(text) =>
                      setFormData({ ...formData, salario: text })
                    }
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Data Admissão</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.dataAdmissao}
                    onChangeText={(text) =>
                      setFormData({ ...formData, dataAdmissao: text })
                    }
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Check size={20} color={colors.surface} strokeWidth={2.5} />
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  funcionariosList: {
    padding: 16,
    gap: 12,
  },
  funcionarioCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  funcionarioHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  funcionarioAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B98115',
    justifyContent: 'center',
    alignItems: 'center',
  },
  funcionarioInfo: {
    flex: 1,
    gap: 6,
  },
  funcionarioName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  funcionarioDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  funcionarioDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  funcionarioStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.surface,
  },
});
