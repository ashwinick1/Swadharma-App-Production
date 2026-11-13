import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/api';

type NotificationItem = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  referenceId?: string | null;
  isRead: boolean;
  createdAt: string;
};

type FilterType = 'ALL' | 'ASSESSMENT' | 'REPORT' | 'SUPPORT' | 'ACCOUNT' | 'SYSTEM';

const filters: {label: string; value: FilterType}[] = [
  {label: 'All', value: 'ALL'},
  {label: 'Assessments', value: 'ASSESSMENT'},
  {label: 'Reports', value: 'REPORT'},
  {label: 'Support', value: 'SUPPORT'},
  {label: 'Account', value: 'ACCOUNT'},
  {label: 'System', value: 'SYSTEM'},
];

const getIcon = (type: string) => {
  switch (type) {
    case 'ASSESSMENT': return 'clipboard-check-outline';
    case 'REPORT': return 'file-document-outline';
    case 'SUPPORT': return 'ticket-outline';
    case 'ACCOUNT': return 'account-outline';
    default: return 'bell-outline';
  }
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const NotificationsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const userId = Number(route.params?.userId);

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async (refresh = false) => {
    if (!Number.isInteger(userId) || userId <= 0) {
      setError('Your user ID is missing. Please log in again.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    refresh ? setRefreshing(true) : setLoading(true);
    setError('');

    try {
      const response = await getNotifications(userId);
      const rows = Array.isArray(response)
        ? response
        : response?.notifications ?? response?.data ?? [];
      setItems(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load notifications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  const unreadCount = items.filter(item => !item.isRead).length;

  const filteredItems = useMemo(
    () => filter === 'ALL'
      ? items
      : items.filter(item => item.type === filter),
    [items, filter],
  );

  const openNotification = async (item: NotificationItem) => {
    try {
      if (!item.isRead) {
        setBusyId(item.id);
        await markNotificationAsRead(userId, item.id);
        setItems(previous => previous.map(row =>
          row.id === item.id ? {...row, isRead: true} : row,
        ));
      }
    } catch (err) {
      Alert.alert('Unable to update', err instanceof Error ? err.message : 'Please try again.');
      return;
    } finally {
      setBusyId(null);
    }

    switch (item.type) {
      case 'REPORT':
        if (item.referenceId === 'SWADHARMA_ID_CARD') {
          navigation.navigate('SwadharmaIDCard', {userId});
        } else {
          navigation.navigate('SwadharmaReport', {userId});
        }
        break;
      case 'SUPPORT':
        navigation.navigate('HelpSupport', {userId});
        break;
      case 'ASSESSMENT':
        navigation.navigate('Dashboard', {userId, scrollToJourney: true});
        break;
      default:
        break;
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markAllNotificationsAsRead(userId);
      setItems(previous => previous.map(item => ({...item, isRead: true})));
    } catch (err) {
      Alert.alert('Unable to update', err instanceof Error ? err.message : 'Please try again.');
    }
  };

  const handleDelete = (item: NotificationItem) => {
    Alert.alert('Delete notification', 'Remove this notification?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNotification(userId, item.id);
            setItems(previous => previous.filter(row => row.id !== item.id));
          } catch (err) {
            Alert.alert('Unable to delete', err instanceof Error ? err.message : 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={25} color="#FF6B00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} tintColor="#FF6B00" />
        }>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.pageTitle}>Your Updates</Text>
            <Text style={styles.pageSubtitle}>Stay up to date with your Swadharma journey.</Text>
          </View>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
            <MaterialCommunityIcons name="check-all" size={18} color="#E85B00" />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map(item => {
            const active = filter === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => setFilter(item.value)}
                style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color="#FF6B00" />
            <Text style={styles.stateText}>Loading notifications...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={42} color="#C62828" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadNotifications()}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="bell-check-outline" size={42} color="#FF6B00" />
            </View>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptyText}>New assessment, report and support updates will appear here.</Text>
          </View>
        ) : (
          filteredItems.map(item => (
            <View key={item.id} style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
              <TouchableOpacity style={styles.notificationMain} onPress={() => openNotification(item)} activeOpacity={0.75}>
                <View style={styles.notificationIcon}>
                  <MaterialCommunityIcons name={getIcon(item.type)} size={25} color="#FF6B00" />
                </View>
                <View style={styles.notificationBody}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage}>{item.message}</Text>
                  <Text style={styles.notificationDate}>{formatDate(item.createdAt)}</Text>
                </View>
                {busyId === item.id ? (
                  <ActivityIndicator size="small" color="#FF6B00" />
                ) : (
                  <MaterialCommunityIcons name="chevron-right" size={23} color="#A59A91" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color="#9A8D84" />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF8F2'},
  header: {height: 58, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18},
  backButton: {width: 40, height: 40, justifyContent: 'center'},
  headerTitle: {fontSize: 21, fontWeight: '900', color: '#30251F'},
  headerSpacer: {width: 40},
  content: {padding: 18, paddingBottom: 40},
  summaryRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12},
  pageTitle: {fontSize: 24, fontWeight: '900', color: '#30251F'},
  pageSubtitle: {fontSize: 13, lineHeight: 20, color: '#75685F', marginTop: 5, maxWidth: 230},
  unreadBadge: {backgroundColor: '#FFF0E3', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8},
  unreadBadgeText: {fontSize: 12, fontWeight: '900', color: '#E85B00'},
  markAllButton: {alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10},
  markAllText: {fontSize: 13, fontWeight: '800', color: '#E85B00'},
  filters: {gap: 8, paddingVertical: 12, paddingBottom: 18},
  filterChip: {paddingHorizontal: 15, paddingVertical: 10, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBDDD1'},
  filterChipActive: {backgroundColor: '#FF6B00', borderColor: '#FF6B00'},
  filterText: {fontSize: 13, fontWeight: '700', color: '#554940'},
  filterTextActive: {color: '#FFFFFF'},
  notificationCard: {backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: '#EEE3DA', marginBottom: 12, padding: 13},
  unreadCard: {borderColor: '#FFC18F', backgroundColor: '#FFFEFC'},
  notificationMain: {flexDirection: 'row', alignItems: 'flex-start'},
  notificationIcon: {width: 46, height: 46, borderRadius: 13, backgroundColor: '#FFF0E3', alignItems: 'center', justifyContent: 'center', marginRight: 12},
  notificationBody: {flex: 1},
  titleRow: {flexDirection: 'row', alignItems: 'center', gap: 7},
  notificationTitle: {flex: 1, fontSize: 15, lineHeight: 21, fontWeight: '900', color: '#30251F'},
  unreadDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B00'},
  notificationMessage: {fontSize: 13, lineHeight: 20, color: '#65584F', marginTop: 5},
  notificationDate: {fontSize: 11, color: '#8A7D73', marginTop: 8},
  deleteButton: {alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 5, paddingTop: 9, paddingHorizontal: 4},
  deleteText: {fontSize: 11, color: '#8A7D73', fontWeight: '700'},
  stateContainer: {paddingVertical: 55, alignItems: 'center', justifyContent: 'center'},
  stateText: {marginTop: 12, fontSize: 14, color: '#75685F'},
  errorText: {fontSize: 14, lineHeight: 21, color: '#A02D26', textAlign: 'center', marginTop: 10},
  retryButton: {marginTop: 15, backgroundColor: '#FF6B00', borderRadius: 10, paddingHorizontal: 22, paddingVertical: 11},
  retryText: {color: '#FFFFFF', fontWeight: '900'},
  emptyState: {backgroundColor: '#FFFFFF', borderRadius: 17, alignItems: 'center', padding: 28, marginTop: 12},
  emptyIcon: {width: 78, height: 78, borderRadius: 24, backgroundColor: '#FFF0E3', alignItems: 'center', justifyContent: 'center', marginBottom: 16},
  emptyTitle: {fontSize: 18, fontWeight: '900', color: '#30251F'},
  emptyText: {fontSize: 13, lineHeight: 21, color: '#75685F', textAlign: 'center', marginTop: 7},
});