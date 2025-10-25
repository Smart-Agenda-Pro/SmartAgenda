import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import colors from '@/constants/colors';
import {
  Plus,
  Search,
  User,
  Phone,
  Mail,
  X,
  Check,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Star,
  Edit2,
  Trash2,
  Menu,
  Home,
  ShoppingCart,
  FileText,
  FolderOpen,
  UserCircle,
  ChevronRight,
  BarChart3,
  CalendarCheck,
  Sparkles,
  LogOut,
  Scissors,
} from 'lucide-react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Client } from '@/types/database';
import { useRouter } from 'expo-router';


type ClientWithStats = Client & {
  total_appointments?: number;
  total_spent?: number;
  last_appointment?: string;
};

export default function GerenciarClientesScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editingCliente, setEditingCliente] = useState<ClientWithStats | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<ClientWithStats | null>(null);
  const [filterVip, setFilterVip] = useState<boolean | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birth_date: '',
    notes: '',
    is_vip: false,
  });

  const { data: clientes, isLoading } = useQuery({
    queryKey: ['clientes-stats', user?.tenant_id],
    queryFn: async () => {
      if (!user?.tenant_id) return [];

      const { data: clientsData, error } = await supabase
        .from('clients')
        .select('*')
        .eq('tenant_id', user.tenant_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Clientes] Error fetching clients:', error);
        throw error;
      }

      const clientsWithStats = await Promise.all(
        (clientsData || []).map(async (client) => {
          const [appointmentsResult, salesResult] = await Promise.all([
            supabase
              .from('appointments')
              .select('id, scheduled_at', { count: 'exact' })
              .eq('client_id', client.id)
              .order('scheduled_at', { ascending: false })
              .limit(1),
            
            supabase
              .from('sales')
              .select('total')
              .eq('client_id', client.id),
          ]);

          const totalAppointments = appointmentsResult.count || 0;
          const totalSpent = salesResult.data?.reduce((sum, sale) => sum + Number(sale.total), 0) || 0;
          const lastAppointment = appointmentsResult.data?.[0]?.scheduled_at;

          return {
            ...client,
            total_appointments: totalAppointments,
            total_spent: totalSpent,
            last_appointment: lastAppointment,
          };
        })
      );

      return clientsWithStats;
    },
    enabled: !!user?.tenant_id,
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert([
          {
            tenant_id: user!.tenant_id,
            name: data.name,
            phone: data.phone || null,
            email: data.email || null,
            birth_date: data.birth_date || null,
            notes: data.notes || null,
            is_vip: data.is_vip,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return newClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes-stats'] });
      Alert.alert('Sucesso', 'Cliente criado com sucesso!');
      handleCloseModal();
    },
    onError: (error: any) => {
      console.error('[Clientes] Create error:', error);
      Alert.alert('Erro', 'Não foi possível criar o cliente');
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const { data: updatedClient, error } = await supabase
        .from('clients')
        .update({
          name: data.name,
          phone: data.phone || null,
          email: data.email || null,
          birth_date: data.birth_date || null,
          notes: data.notes || null,
          is_vip: data.is_vip,
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return updatedClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes-stats'] });
      Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
      handleCloseModal();
    },
    onError: (error: any) => {
      console.error('[Clientes] Update error:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o cliente');
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes-stats'] });
      Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
      setDetailsModalVisible(false);
    },
    onError: (error: any) => {
      console.error('[Clientes] Delete error:', error);
      Alert.alert('Erro', 'Não foi possível excluir o cliente');
    },
  });

  const filteredClientes = useMemo(() => {
    if (!clientes) return [];
    
    let filtered = clientes;

    if (searchQuery) {
      filtered = filtered.filter((cliente) =>
        cliente.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.phone?.includes(searchQuery) ||
        cliente.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterVip !== null) {
      filtered = filtered.filter((cliente) => cliente.is_vip === filterVip);
    }

    return filtered;
  }, [clientes, searchQuery, filterVip]);

  const stats = useMemo(() => {
    if (!clientes) return { total: 0, vip: 0, totalRevenue: 0, avgSpent: 0 };

    const total = clientes.length;
    const vip = clientes.filter((c) => c.is_vip).length;
    const totalRevenue = clientes.reduce((sum, c) => sum + (c.total_spent || 0), 0);
    const avgSpent = total > 0 ? totalRevenue / total : 0;

    return { total, vip, totalRevenue, avgSpent };
  }, [clientes]);

  const handleOpenModal = (cliente?: ClientWithStats) => {
    if (cliente) {
      setEditingCliente(cliente);
      setFormData({
        name: cliente.name,
        phone: cliente.phone || '',
        email: cliente.email || '',
        birth_date: cliente.birth_date || '',
        notes: cliente.notes || '',
        is_vip: cliente.is_vip,
      });
    } else {
      setEditingCliente(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        birth_date: '',
        notes: '',
        is_vip: false,
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCliente(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      birth_date: '',
      notes: '',
      is_vip: false,
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('Erro', 'Nome e telefone são obrigatórios');
      return;
    }

    if (editingCliente) {
      updateClientMutation.mutate({ ...formData, id: editingCliente.id });
    } else {
      createClientMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteClientMutation.mutate(id),
        },
      ]
    );
  };

  const handleOpenDetails = (cliente: ClientWithStats) => {
    setSelectedCliente(cliente);
    setDetailsModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      setShowMenu(false);
      await signOut();
    } catch (error) {
      console.error('[Clientes] Logout error:', error);
    }
  };

  const toggleMenu = () => {
    if (showMenu) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowMenu(false));
    } else {
      setShowMenu(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigateAndCloseMenu = (route: string) => {
    toggleMenu();
    setTimeout(() => {
      if (route === 'logout') {
        handleLogout();
      } else {
        router.push(route as any);
      }
    }, 300);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {showMenu && (
        <Pressable 
          style={styles.menuOverlay} 
          onPress={toggleMenu}
        />
      )}

      <Animated.View
        style={[
          styles.hamburgerMenu,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.menuHeader}>
          <View style={styles.menuUserInfo}>
            <View style={styles.menuUserAvatar}>
              <UserCircle size={48} color={colors.primary} strokeWidth={1.5} />
            </View>
            <View>
              <Text style={styles.menuUserName}>{user?.full_name || 'Usuário'}</Text>
              <Text style={styles.menuUserRole}>
                {user?.role === 'admin' ? 'Administrador' :
                 user?.role === 'barber' ? 'Barbeiro' : 'Atendente'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuCloseButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Principal</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/(tabs)')}
            >
              <Home size={22} color={colors.primary} strokeWidth={2} />
              <Text style={styles.menuItemText}>Dashboard (Início)</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/(tabs)')}
            >
              <BarChart3 size={22} color={colors.accent} strokeWidth={2} />
              <Text style={styles.menuItemText}>Gráficos</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/(tabs)')}
            >
              <CalendarCheck size={22} color='#3B82F6' strokeWidth={2} />
              <Text style={styles.menuItemText}>Agenda de Compromisso</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/(tabs)')}
            >
              <Sparkles size={22} color='#8B5CF6' strokeWidth={2} />
              <Text style={styles.menuItemText}>IA Insights</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/clientes/gerenciar')}
            >
              <Users size={22} color='#10B981' strokeWidth={2} />
              <Text style={styles.menuItemText}>Gerenciar Clientes</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/servicos/gerenciar')}
            >
              <Scissors size={22} color={colors.secondary} strokeWidth={2} />
              <Text style={styles.menuItemText}>Gerenciar Serviços</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Navegação</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/agenda')}
            >
              <Calendar size={22} color={colors.primary} strokeWidth={2} />
              <Text style={styles.menuItemText}>Agenda</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/vendas')}
            >
              <ShoppingCart size={22} color={colors.secondary} strokeWidth={2} />
              <Text style={styles.menuItemText}>Vendas</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/relatorios')}
            >
              <FileText size={22} color={colors.accent} strokeWidth={2} />
              <Text style={styles.menuItemText}>Relatórios</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/cadastros')}
            >
              <FolderOpen size={22} color={colors.primary} strokeWidth={2} />
              <Text style={styles.menuItemText}>Cadastros</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Conta</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateAndCloseMenu('/(tabs)')}
            >
              <UserCircle size={22} color={colors.primary} strokeWidth={2} />
              <Text style={styles.menuItemText}>Perfil (Gerenciar)</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => navigateAndCloseMenu('logout')}
            >
              <LogOut size={22} color={colors.error} strokeWidth={2} />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Sair</Text>
              <ChevronRight size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
              <Menu size={28} color={colors.primary} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.title}>Gerenciar Clientes</Text>
          </View>
          <Text style={styles.subtitle}>
            Controle completo da sua base de clientes
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIcon}>
              <Users size={24} color={colors.surface} strokeWidth={2.5} />
            </View>
            <Text style={[styles.statValue, styles.statValueLight]}>{stats.total}</Text>
            <Text style={[styles.statLabel, styles.statLabelLight]}>Total de Clientes</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.statIconSecondary]}>
              <Star size={24} color={colors.warning} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>{stats.vip}</Text>
            <Text style={styles.statLabel}>Clientes VIP</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.statIconAccent]}>
              <DollarSign size={24} color={colors.secondary} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>R$ {stats.totalRevenue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Faturamento Total</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.statIconInfo]}>
              <TrendingUp size={24} color={colors.accent} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>R$ {stats.avgSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Ticket Médio</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Search size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome, telefone ou email..."
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

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterChip, filterVip === null && styles.filterChipActive]}
              onPress={() => setFilterVip(null)}
            >
              <Text style={[styles.filterChipText, filterVip === null && styles.filterChipTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filterVip === true && styles.filterChipActive]}
              onPress={() => setFilterVip(true)}
            >
              <Star size={14} color={filterVip === true ? colors.surface : colors.warning} strokeWidth={2} />
              <Text style={[styles.filterChipText, filterVip === true && styles.filterChipTextActive]}>
                VIP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filterVip === false && styles.filterChipActive]}
              onPress={() => setFilterVip(false)}
            >
              <Text style={[styles.filterChipText, filterVip === false && styles.filterChipTextActive]}>
                Regular
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.clientesList}>
            {filteredClientes.length === 0 ? (
              <View style={styles.emptyState}>
                <Users size={48} color={colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.emptyStateTitle}>Nenhum cliente encontrado</Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery || filterVip !== null
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece adicionando seu primeiro cliente'}
                </Text>
              </View>
            ) : (
              filteredClientes.map((cliente) => (
                <TouchableOpacity
                  key={cliente.id}
                  style={styles.clienteCard}
                  onPress={() => handleOpenDetails(cliente)}
                  activeOpacity={0.7}
                >
                  <View style={styles.clienteHeader}>
                    <View style={styles.clienteAvatar}>
                      <User size={24} color={colors.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.clienteInfo}>
                      <View style={styles.clienteNameRow}>
                        <Text style={styles.clienteName}>{cliente.name}</Text>
                        {cliente.is_vip && (
                          <View style={styles.vipBadge}>
                            <Star size={10} color={colors.surface} fill={colors.surface} strokeWidth={2} />
                            <Text style={styles.vipText}>VIP</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.clienteDetails}>
                        {cliente.phone && (
                          <View style={styles.clienteDetail}>
                            <Phone size={14} color={colors.textSecondary} />
                            <Text style={styles.clienteDetailText}>{cliente.phone}</Text>
                          </View>
                        )}
                        {cliente.email && (
                          <View style={styles.clienteDetail}>
                            <Mail size={14} color={colors.textSecondary} />
                            <Text style={styles.clienteDetailText} numberOfLines={1}>
                              {cliente.email}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.clienteStats}>
                    <View style={styles.clienteStatItem}>
                      <Calendar size={16} color={colors.primary} strokeWidth={2} />
                      <Text style={styles.clienteStatValue}>{cliente.total_appointments || 0}</Text>
                      <Text style={styles.clienteStatLabel}>Atendimentos</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.clienteStatItem}>
                      <DollarSign size={16} color={colors.secondary} strokeWidth={2} />
                      <Text style={styles.clienteStatValue}>R$ {(cliente.total_spent || 0).toFixed(2)}</Text>
                      <Text style={styles.clienteStatLabel}>Gasto Total</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.clienteStatItem}>
                      <Calendar size={16} color={colors.accent} strokeWidth={2} />
                      <Text style={styles.clienteStatValue}>
                        {cliente.last_appointment
                          ? format(new Date(cliente.last_appointment), 'dd/MM', { locale: ptBR })
                          : '-'}
                      </Text>
                      <Text style={styles.clienteStatLabel}>Último</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
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
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Data de Nascimento</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.birth_date}
                  onChangeText={(text) => setFormData({ ...formData, birth_date: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Anotações sobre o cliente..."
                  placeholderTextColor={colors.textSecondary}
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.vipToggle}
                onPress={() => setFormData({ ...formData, is_vip: !formData.is_vip })}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, formData.is_vip && styles.checkboxActive]}>
                  {formData.is_vip && <Check size={16} color={colors.surface} strokeWidth={3} />}
                </View>
                <Text style={styles.vipToggleText}>Marcar como cliente VIP</Text>
              </TouchableOpacity>
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
                style={[styles.saveButton, (createClientMutation.isPending || updateClientMutation.isPending) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={createClientMutation.isPending || updateClientMutation.isPending}
                activeOpacity={0.7}
              >
                {createClientMutation.isPending || updateClientMutation.isPending ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <>
                    <Check size={20} color={colors.surface} strokeWidth={2.5} />
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Cliente</Text>
              <TouchableOpacity
                onPress={() => setDetailsModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedCliente && (
              <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.detailsHeader}>
                  <View style={styles.detailsAvatar}>
                    <User size={32} color={colors.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.detailsNameContainer}>
                    <Text style={styles.detailsName}>{selectedCliente.name}</Text>
                    {selectedCliente.is_vip && (
                      <View style={styles.vipBadge}>
                        <Star size={10} color={colors.surface} fill={colors.surface} strokeWidth={2} />
                        <Text style={styles.vipText}>VIP</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Informações de Contato</Text>
                  {selectedCliente.phone && (
                    <View style={styles.detailsRow}>
                      <Phone size={20} color={colors.textSecondary} />
                      <Text style={styles.detailsText}>{selectedCliente.phone}</Text>
                    </View>
                  )}
                  {selectedCliente.email && (
                    <View style={styles.detailsRow}>
                      <Mail size={20} color={colors.textSecondary} />
                      <Text style={styles.detailsText}>{selectedCliente.email}</Text>
                    </View>
                  )}
                  {selectedCliente.birth_date && (
                    <View style={styles.detailsRow}>
                      <Calendar size={20} color={colors.textSecondary} />
                      <Text style={styles.detailsText}>
                        {format(new Date(selectedCliente.birth_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Estatísticas</Text>
                  <View style={styles.detailsStatsGrid}>
                    <View style={styles.detailsStatCard}>
                      <Calendar size={24} color={colors.primary} strokeWidth={2} />
                      <Text style={styles.detailsStatValue}>{selectedCliente.total_appointments || 0}</Text>
                      <Text style={styles.detailsStatLabel}>Atendimentos</Text>
                    </View>
                    <View style={styles.detailsStatCard}>
                      <DollarSign size={24} color={colors.secondary} strokeWidth={2} />
                      <Text style={styles.detailsStatValue}>
                        R$ {(selectedCliente.total_spent || 0).toFixed(2)}
                      </Text>
                      <Text style={styles.detailsStatLabel}>Gasto Total</Text>
                    </View>
                  </View>
                  {selectedCliente.last_appointment && (
                    <View style={styles.detailsRow}>
                      <Calendar size={20} color={colors.textSecondary} />
                      <Text style={styles.detailsText}>
                        Último atendimento:{' '}
                        {format(new Date(selectedCliente.last_appointment), 'dd/MM/yyyy', { locale: ptBR })}
                      </Text>
                    </View>
                  )}
                </View>

                {selectedCliente.notes && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsSectionTitle}>Observações</Text>
                    <Text style={styles.detailsNotes}>{selectedCliente.notes}</Text>
                  </View>
                )}

                <View style={styles.detailsActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setDetailsModalVisible(false);
                      handleOpenModal(selectedCliente);
                    }}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={20} color={colors.primary} strokeWidth={2} />
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(selectedCliente.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={20} color={colors.error} strokeWidth={2} />
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  hamburgerMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: colors.surface,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuHeader: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  menuUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  menuUserAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.primary}15` as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuUserName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  menuUserRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  },
  menuContent: {
    flex: 1,
    padding: 16,
  },
  menuSection: {
    marginBottom: 8,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 4,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  menuItemDanger: {
    backgroundColor: `${colors.error}10` as const,
  },
  menuItemTextDanger: {
    color: colors.error,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  hamburgerButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsGrid: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconSecondary: {
    backgroundColor: `${colors.warning}15` as const,
  },
  statIconAccent: {
    backgroundColor: `${colors.secondary}15` as const,
  },
  statIconInfo: {
    backgroundColor: `${colors.accent}15` as const,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  statValueLight: {
    color: colors.surface,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  statLabelLight: {
    color: colors.surface,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
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
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  clientesList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  clienteCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  clienteHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  clienteAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.primary}15` as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  clienteName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  vipText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.surface,
  },
  clienteDetails: {
    gap: 4,
  },
  clienteDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clienteDetailText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  clienteStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  clienteStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  clienteStatValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.text,
  },
  clienteStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
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
    minHeight: 100,
  },
  vipToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  vipToggleText: {
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.surface,
  },
  detailsContainer: {
    padding: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  detailsAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}15` as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  detailsStatsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailsStatCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsStatValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  detailsStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailsNotes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  detailsActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.primary}15` as const,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.error}15` as const,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.error,
  },
});
