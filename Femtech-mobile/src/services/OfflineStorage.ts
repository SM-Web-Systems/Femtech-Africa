import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Storage keys
const KEYS = {
  PROFILE: '@offline_profile',
  WALLET: '@offline_wallet',
  MILESTONES: '@offline_milestones',
  QUIZZES: '@offline_quizzes',
  VOUCHERS: '@offline_vouchers',
  ARTICLES: '@offline_articles',
  AI_MESSAGES: '@offline_ai_messages',
  PENDING_ACTIONS: '@offline_pending_actions',
  LAST_SYNC: '@offline_last_sync',
};

export interface PendingAction {
  id: string;
  type: 'QUIZ_SUBMIT' | 'MILESTONE_CLAIM' | 'PROFILE_UPDATE' | 'AI_CHAT';
  payload: any;
  createdAt: number;
  retryCount: number;
}

class OfflineStorageService {
  private isOnline: boolean = true;
  private listeners: ((isOnline: boolean) => void)[] = [];

  constructor() {
    this.initNetworkListener();
  }

  // Initialize network state listener
  private initNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // Notify listeners
      this.listeners.forEach(listener => listener(this.isOnline));
      
      // If we came back online, trigger sync
      if (wasOffline && this.isOnline) {
        this.syncPendingActions();
      }
    });
  }

  // Subscribe to network changes
  onNetworkChange(callback: (isOnline: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Check if online
  async checkOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
    return this.isOnline;
  }

  getIsOnline(): boolean {
    return this.isOnline;
  }

  // Generic cache methods
  async cacheData<T>(key: string, data: T): Promise<void> {
    try {
      const cacheItem = {
        data,
        cachedAt: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache error:', error);
    }
  }

  async getCachedData<T>(key: string, maxAge?: number): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, cachedAt } = JSON.parse(cached);
      
      // Check if cache is expired
      if (maxAge && Date.now() - cachedAt > maxAge) {
        return null;
      }

      return data as T;
    } catch (error) {
      console.error('Get cache error:', error);
      return null;
    }
  }

  // Profile
  async cacheProfile(profile: any): Promise<void> {
    await this.cacheData(KEYS.PROFILE, profile);
  }

  async getCachedProfile(): Promise<any> {
    return this.getCachedData(KEYS.PROFILE);
  }

  // Wallet
  async cacheWallet(wallet: any): Promise<void> {
    await this.cacheData(KEYS.WALLET, wallet);
  }

  async getCachedWallet(): Promise<any> {
    return this.getCachedData(KEYS.WALLET);
  }

  // Milestones
  async cacheMilestones(milestones: any[]): Promise<void> {
    await this.cacheData(KEYS.MILESTONES, milestones);
  }

  async getCachedMilestones(): Promise<any[] | null> {
    return this.getCachedData(KEYS.MILESTONES);
  }

  // Quizzes
  async cacheQuizzes(quizzes: any[]): Promise<void> {
    await this.cacheData(KEYS.QUIZZES, quizzes);
  }

  async getCachedQuizzes(): Promise<any[] | null> {
    return this.getCachedData(KEYS.QUIZZES);
  }

  // Vouchers
  async cacheVouchers(vouchers: any[]): Promise<void> {
    await this.cacheData(KEYS.VOUCHERS, vouchers);
  }

  async getCachedVouchers(): Promise<any[] | null> {
    return this.getCachedData(KEYS.VOUCHERS);
  }

  // Articles/Educational Content
  async cacheArticles(articles: any[]): Promise<void> {
    await this.cacheData(KEYS.ARTICLES, articles);
  }

  async getCachedArticles(): Promise<any[] | null> {
    return this.getCachedData(KEYS.ARTICLES);
  }

  // AI Messages
  async cacheAIMessages(messages: any[]): Promise<void> {
    await this.cacheData(KEYS.AI_MESSAGES, messages);
  }

  async getCachedAIMessages(): Promise<any[] | null> {
    return this.getCachedData(KEYS.AI_MESSAGES);
  }

  // Pending Actions Queue
  async addPendingAction(action: Omit<PendingAction, 'id' | 'createdAt' | 'retryCount'>): Promise<void> {
    try {
      const pending = await this.getPendingActions();
      const newAction: PendingAction = {
        ...action,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        retryCount: 0,
      };
      pending.push(newAction);
      await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(pending));
    } catch (error) {
      console.error('Add pending action error:', error);
    }
  }

  async getPendingActions(): Promise<PendingAction[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PENDING_ACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Get pending actions error:', error);
      return [];
    }
  }

  async removePendingAction(id: string): Promise<void> {
    try {
      const pending = await this.getPendingActions();
      const filtered = pending.filter(a => a.id !== id);
      await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Remove pending action error:', error);
    }
  }

  async updatePendingAction(id: string, updates: Partial<PendingAction>): Promise<void> {
    try {
      const pending = await this.getPendingActions();
      const index = pending.findIndex(a => a.id === id);
      if (index !== -1) {
        pending[index] = { ...pending[index], ...updates };
        await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(pending));
      }
    } catch (error) {
      console.error('Update pending action error:', error);
    }
  }

  // Sync pending actions when back online
  async syncPendingActions(): Promise<void> {
    if (!this.isOnline) return;

    const pending = await this.getPendingActions();
    console.log(`Syncing ${pending.length} pending actions...`);

    for (const action of pending) {
      try {
        await this.executePendingAction(action);
        await this.removePendingAction(action.id);
        console.log(`Synced action: ${action.type}`);
      } catch (error) {
        console.error(`Failed to sync action ${action.type}:`, error);
        
        // Increment retry count
        if (action.retryCount < 3) {
          await this.updatePendingAction(action.id, { retryCount: action.retryCount + 1 });
        } else {
          // Remove after 3 failures
          await this.removePendingAction(action.id);
          console.log(`Removed action after 3 failures: ${action.type}`);
        }
      }
    }
  }

  private async executePendingAction(action: PendingAction): Promise<void> {
    // Import APIs dynamically to avoid circular dependencies
    const { quizzesApi, milestonesApi, profileApi, aiApi } = require('../api');

    switch (action.type) {
      case 'QUIZ_SUBMIT':
        await quizzesApi.submitQuiz(action.payload.quizId, action.payload.answers);
        break;
      case 'MILESTONE_CLAIM':
        await milestonesApi.claimReward(action.payload.milestoneId);
        break;
      case 'PROFILE_UPDATE':
        await profileApi.updateProfile(action.payload);
        break;
      case 'AI_CHAT':
        // AI chat messages are not critical to sync
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  // Last sync timestamp
  async setLastSync(): Promise<void> {
    await AsyncStorage.setItem(KEYS.LAST_SYNC, Date.now().toString());
  }

  async getLastSync(): Promise<number | null> {
    const timestamp = await AsyncStorage.getItem(KEYS.LAST_SYNC);
    return timestamp ? parseInt(timestamp) : null;
  }

  // Clear all cached data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Clear all error:', error);
    }
  }
}

export const offlineStorage = new OfflineStorageService();
export default offlineStorage;
