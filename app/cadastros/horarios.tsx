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
  Clock,
  X,
  Check,
} from 'lucide-react-native';

type DiaSemana = {
  id: string;
  nome: string;
  ativo: boolean;
  horaAbertura: string;
  horaFechamento: string;
  horarioAlmoco?: {
    inicio: string;
    fim: string;
  };
};

export default function HorariosScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDia, setEditingDia] = useState<DiaSemana | null>(null);

  const [formData, setFormData] = useState({
    ativo: true,
    horaAbertura: '',
    horaFechamento: '',
    temAlmoco: false,
    almocoInicio: '',
    almocoFim: '',
  });

  const [diasSemana, setDiasSemana] = useState<DiaSemana[]>([
    {
      id: '1',
      nome: 'Segunda-feira',
      ativo: true,
      horaAbertura: '09:00',
      horaFechamento: '18:00',
      horarioAlmoco: { inicio: '12:00', fim: '13:00' },
    },
    {
      id: '2',
      nome: 'Terça-feira',
      ativo: true,
      horaAbertura: '09:00',
      horaFechamento: '18:00',
      horarioAlmoco: { inicio: '12:00', fim: '13:00' },
    },
    {
      id: '3',
      nome: 'Quarta-feira',
      ativo: true,
      horaAbertura: '09:00',
      horaFechamento: '18:00',
      horarioAlmoco: { inicio: '12:00', fim: '13:00' },
    },
    {
      id: '4',
      nome: 'Quinta-feira',
      ativo: true,
      horaAbertura: '09:00',
      horaFechamento: '18:00',
      horarioAlmoco: { inicio: '12:00', fim: '13:00' },
    },
    {
      id: '5',
      nome: 'Sexta-feira',
      ativo: true,
      horaAbertura: '09:00',
      horaFechamento: '18:00',
      horarioAlmoco: { inicio: '12:00', fim: '13:00' },
    },
    {
      id: '6',
      nome: 'Sábado',
      ativo: true,
      horaAbertura: '09:00',
      horaFechamento: '14:00',
    },
    {
      id: '7',
      nome: 'Domingo',
      ativo: false,
      horaAbertura: '09:00',
      horaFechamento: '18:00',
    },
  ]);

  const handleOpenModal = (dia: DiaSemana) => {
    setEditingDia(dia);
    setFormData({
      ativo: dia.ativo,
      horaAbertura: dia.horaAbertura,
      horaFechamento: dia.horaFechamento,
      temAlmoco: !!dia.horarioAlmoco,
      almocoInicio: dia.horarioAlmoco?.inicio || '',
      almocoFim: dia.horarioAlmoco?.fim || '',
    });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingDia(null);
  };

  const handleSave = () => {
    if (formData.ativo) {
      if (!formData.horaAbertura || !formData.horaFechamento) {
        Alert.alert('Erro', 'Horário de abertura e fechamento são obrigatórios');
        return;
      }
      if (formData.temAlmoco && (!formData.almocoInicio || !formData.almocoFim)) {
        Alert.alert('Erro', 'Horário de almoço incompleto');
        return;
      }
    }
    
    Alert.alert('Sucesso', 'Horário salvo com sucesso!');
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horários de Funcionamento</Text>
        <Text style={styles.headerSubtitle}>Configure os horários da sua barbearia</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.diasList}>
          {diasSemana.map((dia) => (
            <TouchableOpacity
              key={dia.id}
              style={styles.diaCard}
              onPress={() => handleOpenModal(dia)}
              activeOpacity={0.7}
            >
              <View style={styles.diaHeader}>
                <View style={styles.diaIcon}>
                  <Clock size={24} color='#8B5CF6' strokeWidth={2} />
                </View>
                <View style={styles.diaInfo}>
                  <Text style={styles.diaNome}>{dia.nome}</Text>
                  {dia.ativo ? (
                    <>
                      <Text style={styles.diaHorario}>
                        {dia.horaAbertura} - {dia.horaFechamento}
                      </Text>
                      {dia.horarioAlmoco && (
                        <Text style={styles.diaAlmoco}>
                          Almoço: {dia.horarioAlmoco.inicio} - {dia.horarioAlmoco.fim}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text style={styles.diaFechado}>Fechado</Text>
                  )}
                </View>
                <View style={[styles.statusBadge, dia.ativo ? styles.statusAtivo : styles.statusInativo]}>
                  <Text style={[styles.statusText, dia.ativo ? styles.statusTextAtivo : styles.statusTextInativo]}>
                    {dia.ativo ? 'Aberto' : 'Fechado'}
                  </Text>
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
                {editingDia?.nome}
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Aberto neste dia</Text>
                <Switch
                  value={formData.ativo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ativo: value })
                  }
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </View>

              {formData.ativo && (
                <>
                  <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Abertura *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="09:00"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.horaAbertura}
                        onChangeText={(text) =>
                          setFormData({ ...formData, horaAbertura: text })
                        }
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Fechamento *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="18:00"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.horaFechamento}
                        onChangeText={(text) =>
                          setFormData({ ...formData, horaFechamento: text })
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Tem horário de almoço</Text>
                    <Switch
                      value={formData.temAlmoco}
                      onValueChange={(value) =>
                        setFormData({ ...formData, temAlmoco: value })
                      }
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={colors.surface}
                    />
                  </View>

                  {formData.temAlmoco && (
                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Início Almoço</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="12:00"
                          placeholderTextColor={colors.textSecondary}
                          value={formData.almocoInicio}
                          onChangeText={(text) =>
                            setFormData({ ...formData, almocoInicio: text })
                          }
                        />
                      </View>

                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Fim Almoço</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="13:00"
                          placeholderTextColor={colors.textSecondary}
                          value={formData.almocoFim}
                          onChangeText={(text) =>
                            setFormData({ ...formData, almocoFim: text })
                          }
                        />
                      </View>
                    </View>
                  )}
                </>
              )}
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
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  diasList: {
    padding: 16,
    gap: 12,
  },
  diaCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  diaHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  diaIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF615',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaInfo: {
    flex: 1,
    gap: 4,
  },
  diaNome: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  diaHorario: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  diaAlmoco: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  diaFechado: {
    fontSize: 14,
    color: colors.error,
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
    maxHeight: '80%',
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
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
