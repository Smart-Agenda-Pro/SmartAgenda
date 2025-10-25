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
  Scissors,
  Clock,
  DollarSign,
  X,
  Check,
} from 'lucide-react-native';

type Servico = {
  id: string;
  nome: string;
  preco: number;
  duracao: number;
  descricao?: string;
  ativo: boolean;
};

export default function ServicosScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    duracao: '',
    descricao: '',
  });

  const [servicos] = useState<Servico[]>([
    {
      id: '1',
      nome: 'Corte Masculino',
      preco: 45.0,
      duracao: 30,
      descricao: 'Corte tradicional ou moderno',
      ativo: true,
    },
    {
      id: '2',
      nome: 'Barba',
      preco: 35.0,
      duracao: 20,
      descricao: 'Aparar e finalizar',
      ativo: true,
    },
    {
      id: '3',
      nome: 'Corte + Barba',
      preco: 70.0,
      duracao: 45,
      descricao: 'Combo completo',
      ativo: true,
    },
    {
      id: '4',
      nome: 'Corte Infantil',
      preco: 35.0,
      duracao: 25,
      ativo: true,
    },
    {
      id: '5',
      nome: 'Sobrancelha',
      preco: 15.0,
      duracao: 10,
      ativo: true,
    },
  ]);

  const filteredServicos = servicos.filter((servico) =>
    servico.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (servico?: Servico) => {
    if (servico) {
      setEditingServico(servico);
      setFormData({
        nome: servico.nome,
        preco: servico.preco.toString(),
        duracao: servico.duracao.toString(),
        descricao: servico.descricao || '',
      });
    } else {
      setEditingServico(null);
      setFormData({ nome: '', preco: '', duracao: '', descricao: '' });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingServico(null);
    setFormData({ nome: '', preco: '', duracao: '', descricao: '' });
  };

  const handleSave = () => {
    if (!formData.nome || !formData.preco || !formData.duracao) {
      Alert.alert('Erro', 'Nome, preço e duração são obrigatórios');
      return;
    }
    Alert.alert('Sucesso', 'Serviço salvo com sucesso!');
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar serviços..."
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
          <View style={styles.servicosList}>
            {filteredServicos.map((servico) => (
              <TouchableOpacity
                key={servico.id}
                style={styles.servicoCard}
                onPress={() => handleOpenModal(servico)}
                activeOpacity={0.7}
              >
                <View style={styles.servicoHeader}>
                  <View style={styles.servicoIcon}>
                    <Scissors size={24} color={colors.secondary} strokeWidth={2} />
                  </View>
                  <View style={styles.servicoInfo}>
                    <Text style={styles.servicoName}>{servico.nome}</Text>
                    {servico.descricao && (
                      <Text style={styles.servicoDescription}>
                        {servico.descricao}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.servicoDetails}>
                  <View style={styles.detailItem}>
                    <DollarSign size={16} color={colors.success} strokeWidth={2} />
                    <Text style={styles.detailValue}>
                      R$ {servico.preco.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailItem}>
                    <Clock size={16} color={colors.primary} strokeWidth={2} />
                    <Text style={styles.detailValue}>{servico.duracao} min</Text>
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
                  {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
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
                    placeholder="Nome do serviço"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.nome}
                    onChangeText={(text) =>
                      setFormData({ ...formData, nome: text })
                    }
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Preço (R$) *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.preco}
                      onChangeText={(text) =>
                        setFormData({ ...formData, preco: text })
                      }
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Duração (min) *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="30"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.duracao}
                      onChangeText={(text) =>
                        setFormData({ ...formData, duracao: text })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Descrição</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Descrição do serviço (opcional)"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.descricao}
                    onChangeText={(text) =>
                      setFormData({ ...formData, descricao: text })
                    }
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
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
  servicosList: {
    padding: 16,
    gap: 12,
  },
  servicoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  servicoHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  servicoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.secondary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicoInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  servicoName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  servicoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  servicoDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  detailDivider: {
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
  textArea: {
    minHeight: 80,
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
