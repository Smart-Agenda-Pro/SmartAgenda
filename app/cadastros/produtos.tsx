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
  Package,
  DollarSign,
  AlertCircle,
  X,
  Check,
} from 'lucide-react-native';

type Produto = {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  categoria?: string;
  ativo: boolean;
};

export default function ProdutosScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    estoque: '',
    estoqueMinimo: '',
    categoria: '',
  });

  const [produtos] = useState<Produto[]>([
    {
      id: '1',
      nome: 'Pomada Modeladora',
      preco: 45.0,
      estoque: 25,
      estoqueMinimo: 10,
      categoria: 'Finalizadores',
      ativo: true,
    },
    {
      id: '2',
      nome: 'Cera para Cabelo',
      preco: 38.0,
      estoque: 15,
      estoqueMinimo: 10,
      categoria: 'Finalizadores',
      ativo: true,
    },
    {
      id: '3',
      nome: 'Óleo para Barba',
      preco: 55.0,
      estoque: 8,
      estoqueMinimo: 10,
      categoria: 'Barba',
      ativo: true,
    },
    {
      id: '4',
      nome: 'Shampoo Anticaspa',
      preco: 32.0,
      estoque: 30,
      estoqueMinimo: 15,
      categoria: 'Higiene',
      ativo: true,
    },
    {
      id: '5',
      nome: 'Gel Fixador',
      preco: 28.0,
      estoque: 5,
      estoqueMinimo: 10,
      categoria: 'Finalizadores',
      ativo: true,
    },
  ]);

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produto.categoria?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto);
      setFormData({
        nome: produto.nome,
        preco: produto.preco.toString(),
        estoque: produto.estoque.toString(),
        estoqueMinimo: produto.estoqueMinimo.toString(),
        categoria: produto.categoria || '',
      });
    } else {
      setEditingProduto(null);
      setFormData({
        nome: '',
        preco: '',
        estoque: '',
        estoqueMinimo: '',
        categoria: '',
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingProduto(null);
    setFormData({
      nome: '',
      preco: '',
      estoque: '',
      estoqueMinimo: '',
      categoria: '',
    });
  };

  const handleSave = () => {
    if (
      !formData.nome ||
      !formData.preco ||
      !formData.estoque ||
      !formData.estoqueMinimo
    ) {
      Alert.alert(
        'Erro',
        'Nome, preço, estoque e estoque mínimo são obrigatórios'
      );
      return;
    }
    Alert.alert('Sucesso', 'Produto salvo com sucesso!');
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produtos..."
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
          <View style={styles.produtosList}>
            {filteredProdutos.map((produto) => {
              const isLowStock = produto.estoque <= produto.estoqueMinimo;
              return (
                <TouchableOpacity
                  key={produto.id}
                  style={styles.produtoCard}
                  onPress={() => handleOpenModal(produto)}
                  activeOpacity={0.7}
                >
                  <View style={styles.produtoHeader}>
                    <View style={styles.produtoIcon}>
                      <Package
                        size={24}
                        color={colors.accent}
                        strokeWidth={2}
                      />
                    </View>
                    <View style={styles.produtoInfo}>
                      <Text style={styles.produtoName}>{produto.nome}</Text>
                      {produto.categoria && (
                        <Text style={styles.produtoCategory}>
                          {produto.categoria}
                        </Text>
                      )}
                    </View>
                    {isLowStock && (
                      <View style={styles.lowStockBadge}>
                        <AlertCircle size={16} color={colors.error} />
                      </View>
                    )}
                  </View>
                  <View style={styles.produtoDetails}>
                    <View style={styles.detailItem}>
                      <DollarSign
                        size={16}
                        color={colors.success}
                        strokeWidth={2}
                      />
                      <Text style={styles.detailValue}>
                        R$ {produto.preco.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                      <Package size={16} color={colors.primary} strokeWidth={2} />
                      <Text
                        style={[
                          styles.detailValue,
                          isLowStock && { color: colors.error },
                        ]}
                      >
                        Estoque: {produto.estoque}
                      </Text>
                    </View>
                  </View>
                  {isLowStock && (
                    <View style={styles.lowStockWarning}>
                      <Text style={styles.lowStockText}>
                        Estoque baixo! Mínimo: {produto.estoqueMinimo}
                      </Text>
                    </View>
                  )}
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
                  {editingProduto ? 'Editar Produto' : 'Novo Produto'}
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
                    placeholder="Nome do produto"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.nome}
                    onChangeText={(text) =>
                      setFormData({ ...formData, nome: text })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Categoria</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Finalizadores, Barba, Higiene"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.categoria}
                    onChangeText={(text) =>
                      setFormData({ ...formData, categoria: text })
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
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Estoque *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.estoque}
                      onChangeText={(text) =>
                        setFormData({ ...formData, estoque: text })
                      }
                      keyboardType="number-pad"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Estoque Mín. *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.estoqueMinimo}
                      onChangeText={(text) =>
                        setFormData({ ...formData, estoqueMinimo: text })
                      }
                      keyboardType="number-pad"
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
  produtosList: {
    padding: 16,
    gap: 12,
  },
  produtoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  produtoHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  produtoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  produtoInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  produtoName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  produtoCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lowStockBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  produtoDetails: {
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
  lowStockWarning: {
    backgroundColor: `${colors.error}10`,
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  lowStockText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '500' as const,
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
