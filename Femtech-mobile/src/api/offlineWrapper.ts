import { offlineStorage } from '../services/OfflineStorage';

type CacheKey = 'profile' | 'wallet' | 'milestones' | 'quizzes' | 'vouchers' | 'articles';

interface OfflineOptions {
  cacheKey?: CacheKey;
  cacheDuration?: number;
  fallbackData?: any;
  queueIfOffline?: boolean;
  actionType?: 'QUIZ_SUBMIT' | 'MILESTONE_CLAIM' | 'PROFILE_UPDATE';
}

async function setCachedData(cacheKey: CacheKey, data: any): Promise<void> {
  switch (cacheKey) {
    case 'profile':
      await offlineStorage.cacheProfile(data);
      break;
    case 'wallet':
      await offlineStorage.cacheWallet(data);
      break;
    case 'milestones':
      await offlineStorage.cacheMilestones(data);
      break;
    case 'quizzes':
      await offlineStorage.cacheQuizzes(data);
      break;
    case 'vouchers':
      await offlineStorage.cacheVouchers(data);
      break;
    case 'articles':
      await offlineStorage.cacheArticles(data);
      break;
  }
}

async function getCachedData(cacheKey: CacheKey): Promise<any> {
  switch (cacheKey) {
    case 'profile':
      return offlineStorage.getCachedProfile();
    case 'wallet':
      return offlineStorage.getCachedWallet();
    case 'milestones':
      return offlineStorage.getCachedMilestones();
    case 'quizzes':
      return offlineStorage.getCachedQuizzes();
    case 'vouchers':
      return offlineStorage.getCachedVouchers();
    case 'articles':
      return offlineStorage.getCachedArticles();
    default:
      return null;
  }
}

export async function withOfflineSupport<T>(
  apiCall: () => Promise<T>,
  options: OfflineOptions = {}
): Promise<T> {
  const { cacheKey, fallbackData } = options;
  const isOnline = offlineStorage.getIsOnline();

  // If online, make the API call
  if (isOnline) {
    try {
      const result = await apiCall();
      
      // Cache the result if cacheKey provided
      if (cacheKey && result) {
        await setCachedData(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      // On error, try to return cached data
      if (cacheKey) {
        const cached = await getCachedData(cacheKey);
        if (cached) {
          console.log(`Returning cached ${cacheKey} due to API error`);
          return cached as T;
        }
      }
      throw error;
    }
  }

  // Offline handling
  console.log('Device is offline');

  // For read operations, return cached data
  if (cacheKey) {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      console.log(`Returning cached ${cacheKey}`);
      return cached as T;
    }
  }

  // Return fallback data if provided
  if (fallbackData !== undefined) {
    return fallbackData;
  }

  throw new Error('No internet connection and no cached data available');
}

export default withOfflineSupport;
