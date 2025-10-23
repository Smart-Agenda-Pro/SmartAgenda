import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import colors from '@/constants/colors';
import {
  Users,
  Package,
  Scissors,
  ChevronRight,
  Menu,
  Home,
  Calendar,
  ShoppingCart,
  FileText,
  FolderOpen,
  UserCircle,
  LogOut,
  X,
  Clock,
  CreditCard,
  Tags,
  Truck,
  UserCog,
} from 'lucide-react-native';

export default function CadastrosScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

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
        signOut();
      } else {
        router.push(route as any);
      }
    }, 300);
  };

  const menuItems = [
    {
      icon: Users,
      title: 'Clientes',
      description: 'Gerenciar cadastro de clientes',
      color: colors.primary,
      route: '/cadastros/clientes' as const,
    },
    {
      icon: Scissors,
      title: 'Serviços',
      description: 'Gerenciar serviços oferecidos',
      color: colors.secondary,
      route: '/cadastros/servicos' as const,
    },
    {
      icon: Package,
      title: 'Produtos',
      description: 'Gerenciar estoque de produtos',
      color: colors.accent,
      route: '/cadastros/produtos' as const,
    },
    {
      icon: UserCog,
      title: 'Funcionários',
      description: 'Gerenciar equipe de colaboradores',
      color: '#10B981',
      route: '/cadastros/funcionarios' as const,
    },
    {
      icon: Clock,
      title: 'Horários',
      description: 'Configurar horários de funcionamento',
      color: '#8B5CF6',
      route: '/cadastros/horarios' as const,
    },
    {
      icon: CreditCard,
      title: 'Formas de Pagamento',
      description: 'Gerenciar métodos de pagamento',
      color: '#F59E0B',
      route: '/cadastros/pagamentos' as const,
    },
    {
      icon: Tags,
      title: 'Categorias',
      description: 'Organizar produtos e serviços',
      color: '#EC4899',
      route: '/cadastros/categorias' as const,
    },
    {
      icon: Truck,
      title: 'Fornecedores',
      description: 'Gerenciar fornecedores de produtos',
      color: '#06B6D4',
      route: '/cadastros/fornecedores' as const,
    },
  ];

  return (
    <View style={styles.container}>
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
            <TouchableOpacity style={styles.menuItemNav} onPress={() => navigateAndCloseMenu('/(tabs)')}>
              <Home size={22} color={colors.primary} strokeWidth={2} />
              <Text style={styles.menuItemTextNav}>Dashboard (Início)</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemNav} onPress={() => navigateAndCloseMenu('/clientes/gerenciar')}>
              <Users size={22} color='#10B981' strokeWidth={2} />
              <Text style={styles.menuItemTextNav}>Gerenciar Clientes</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemNav} onPress={() => navigateAndCloseMenu('/servicos/gerenciar')}>
              <Scissors size={22} color={colors.secondary} strokeWidth={2} />
              <Text style={styles.menuItemTextNav}>Gerenciar Serviços</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Navegação</Text>
            <TouchableOpacity style={styles.menuItemNav} onPress={() => navigateAndCloseMenu('/agenda')}>
              <Calendar size={22} color={colors.primary} strokeWidth={2} />
              <Text style={styles.menuItemTextNav}>Agenda</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemNav} onPress={() => navigateAndCloseMenu('/vendas')}>
              <ShoppingCart size={22} color={colors.secondary} strokeWidth={2} />
              <Text style={styles.menuItemTextNav}>Vendas</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemNav} onPress={() => navigateAndCloseMenu('/relatorios')}>
              <FileText size={22} color={colors.accent} strokeWidth={2} />
              <Text style={styles.menuItemTextNav}>Relatórios</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemNav} onPress={() => navigateAndCloseMenu('/cadastros')}>
              <FolderOpen size={22} color={colors.primary} strokeWidth={2} />
              <Text style={styles.menuItemTextNav}>Cadastros</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Conta</Text>
            <TouchableOpacity style={[styles.menuItemNav, styles.menuItemDanger]} onPress={() => navigateAndCloseMenu('logout')}>
              <LogOut size={22} color={colors.error} strokeWidth={2} />
              <Text style={[styles.menuItemTextNav, styles.menuItemTextDanger]}>Sair</Text>
              <ChevronRight size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
            <Menu size={28} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Cadastros</Text>
            <Text style={styles.subtitle}>Gerencie seus dados</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.menuList}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => router.push(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: `${item.color}15` },
                    ]}
                  >
                    <Icon size={24} color={item.color} strokeWidth={2} />
                  </View>
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  menuItemNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 4,
  },
  menuItemTextNav: {
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
    marginRight: 12,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  menuList: {
    padding: 16,
    gap: 12,
  },
  menuItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
