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
  Switch,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import {
  Plus,
  CreditCard,
  X,
  Check,
  Banknote,
  Smartphone,
  Percent,
} from 'lucide-react-native';

type FormaPagamento = {
  id: string;
  nome: string;
  tipo: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'outro';
  ativo: boolean;
  taxa?: number;
};

export default function PagamentosScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPagamento, setEditingPagamento] = useState<FormaPagamento | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'dinheiro' as FormaPagamento['tipo'],
    ativo: true,
    taxa: '',
  });

  const [pagamentos, setPagamentos] = useState<FormaPagamento[]>([
    {
      id: '1',
      nome: 'Dinheiro',
      tipo: 'dinheiro',
      ativo: true,
    },
    {
      id: '2',
      nome: 'Cartão de Crédito',
      tipo: 'cartao_credito',
      ativo: true,
      taxa: 3.5,
    },
    {
      id: '3',
      nome: 'Cartão de Débito',
      tipo: 'cartao_debito',
      ativo: true,
      taxa: 2.0,
    },
    {
      id: '4',
      nome: 'PIX',
      tipo: 'pix',
      ativo: true,
    },
  ]);

  const getIconByType = (tipo: FormaPagamento['tipo']) => {
    switch (tipo) {
      case 'dinheiro':
        return Banknote;
      case 'pix':
        return Smartphone;
      default:
        return CreditCard;
    }
  };

  const handleOpenModal = (pagamento?: FormaPagamento) => {
    if (pagamento) {
      setEditingPagamento(pagamento);
      setFormData({
        nome: pagamento.nome,
        tipo: pagamento.tipo,
        ativo: pagamento.ativo,
        taxa: pagamento.taxa?.toString() || '',
      });
    } else {
      setEditingPagamento(null);
      setFormData({ nome: '', tipo: 'dinheiro', ativo: true, taxa: '' });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingPagamento(null);
    setFormData({ nome: '', tipo: 'dinheiro', ativo: true, taxa: '' });
  };

  const handleSave = () => {
    if (!formData.nome) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }
    Alert.alert('Sucesso', 'Forma de pagamento salva com sucesso!');
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
          activeOpacity={0.7}
        >
          <Plus size={24} color={colors.surface} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Nova Forma</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.pagamentosList}>
          {pagamentos.map((pagamento) => {
            const Icon = getIconByType(pagamento.tipo);
            return (
              <TouchableOpacity
                key={pagamento.id}
                style={styles.pagamentoCard}
                onPress={() => handleOpenModal(pagamento)}
                activeOpacity={0.7}
              >
                <View style={styles.pagamentoHeader}>
                  <View style={styles.pagamentoIcon}>
                    <Icon size={24} color='#F59E0B' strokeWidth={2} />
                  </View>
                  <View style={styles.pagamentoInfo}>
                    <Text style={styles.pagamentoNome}>{pagamento.nome}</Text>
                    {pagamento.taxa && (
                      <View style={styles.taxaRow}>
                        <Percent size={14} color={colors.textSecondary} />
                        <Text style={styles.taxaText}>
                          Taxa: {pagamento.taxa.toFixed(2)}%
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.statusBadge, pagamento.ativo ? styles.statusAtivo : styles.statusInativo]}>
                    <Text style={[styles.statusText, pagamento.ativo ? styles.statusTextAtivo : styles.statusTextInativo]}>
                      {pagamento.ativo ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
                {editingPagamento ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
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
                  placeholder="Nome da forma de pagamento"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.nome}
                  onChangeText={(text) =>
                    setFormData({ ...formData, nome: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Taxa (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.taxa}
                  onChangeText={(text) =>
                    setFormData({ ...formData, taxa: text })
                  }
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Ativo</Text>
                <Switch
                  value={formData.ativo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ativo: value })
                  }
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
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
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  pagamentosList: {
    padding: 16,
    gap: 12,
  },
  pagamentoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pagamentoHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  pagamentoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F59E0B15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagamentoInfo: {
    flex: 1,
    gap: 4,
  },
  pagamentoNome: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  taxaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taxaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusAtivo: {
    backgroundColor: '#10B98115',
  },
  statusInativo: {
    backgroundColor: `${colors.error}15`,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statusTextAtivo: {
    color: '#10B981',
  },
  statusTextInativo: {
    color: colors.error,
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
    maxHeight: '70%',
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
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
