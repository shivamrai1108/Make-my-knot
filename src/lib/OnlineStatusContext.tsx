import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

export interface UserOnlineStatus {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  isTyping?: boolean;
  location?: string;
}

interface OnlineStatusContextType {
  onlineUsers: Map<string, UserOnlineStatus>;
  getUserStatus: (userId: string) => UserOnlineStatus | null;
  updateUserStatus: (status: 'online' | 'offline' | 'away') => void;
  setTypingStatus: (isTyping: boolean, chatId?: string) => void;
  getLastSeenText: (userId: string) => string;
  isUserOnline: (userId: string) => boolean;
  getTotalOnlineUsers: () => number;
  getOnlineUsersList: () => UserOnlineStatus[];
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

interface OnlineStatusProviderProps {
  children: ReactNode;
}

// User data - loaded from database in production
const mockUsers: { id: string; name: string; avatar: string }[] = [];

export const OnlineStatusProvider: React.FC<OnlineStatusProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [onlineUsers, setOnlineUsers] = useState<Map<string, UserOnlineStatus>>(new Map());
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
    setIsVisible(!document.hidden);
  }, []);

  // Initialize mock online users
  useEffect(() => {
    const initializeUsers = () => {
      const now = new Date();
      const initialUsers = new Map<string, UserOnlineStatus>();

      mockUsers.forEach((mockUser, index) => {
        // Randomly assign status for demo
        const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Calculate random last seen time
        const minutesAgo = Math.floor(Math.random() * 120); // 0-120 minutes ago
        const lastSeen = new Date(now.getTime() - (minutesAgo * 60 * 1000));

        initialUsers.set(mockUser.id, {
          userId: mockUser.id,
          status: randomStatus,
          lastSeen: lastSeen,
          isTyping: false,
          location: index % 3 === 0 ? 'Mobile' : 'Desktop'
        });
      });

      // Set current user as online if logged in
      if (user?.id) {
        initialUsers.set(user.id, {
          userId: user.id,
          status: 'online',
          lastSeen: now,
          isTyping: false,
          location: 'Desktop'
        });
      }

      setOnlineUsers(initialUsers);
    };

    initializeUsers();
  }, [user]);

  // Track user activity and page visibility
  useEffect(() => {
    if (!isClient) return;
    
    const handleActivity = () => {
      setLastActivity(new Date());
      if (user?.id) {
        updateUserStatus('online');
      }
    };

    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      
      if (user?.id) {
        if (visible) {
          updateUserStatus('online');
        } else {
          // Set to away after page becomes hidden
          setTimeout(() => {
            if (!document.hidden) return;
            updateUserStatus('away');
          }, 5000); // 5 seconds delay
        }
      }
    };

    // Add activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, isClient]);

  // Auto-set to away after inactivity
  useEffect(() => {
    const checkInactivity = () => {
      if (!user?.id) return;
      
      const now = new Date();
      const timeSinceActivity = now.getTime() - lastActivity.getTime();
      const fiveMinutes = 5 * 60 * 1000;

      if (timeSinceActivity > fiveMinutes && isVisible) {
        updateUserStatus('away');
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastActivity, isVisible, user]);

  // Simulate real-time updates for other users
  useEffect(() => {
    const simulateStatusUpdates = () => {
      setOnlineUsers(prevUsers => {
        const newUsers = new Map(prevUsers);
        const userIds = Array.from(newUsers.keys()).filter(id => id !== user?.id);
        
        if (userIds.length === 0) return newUsers;

        // Randomly update one user's status
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
        const currentStatus = newUsers.get(randomUserId);
        
        if (currentStatus) {
          const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          newUsers.set(randomUserId, {
            ...currentStatus,
            status: newStatus,
            lastSeen: newStatus === 'offline' ? new Date() : currentStatus.lastSeen
          });
        }

        return newUsers;
      });
    };

    const interval = setInterval(simulateStatusUpdates, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const getUserStatus = (userId: string): UserOnlineStatus | null => {
    return onlineUsers.get(userId) || null;
  };

  const updateUserStatus = (status: 'online' | 'offline' | 'away') => {
    if (!user?.id) return;

    setOnlineUsers(prevUsers => {
      const newUsers = new Map(prevUsers);
      const currentStatus = newUsers.get(user.id);
      
      newUsers.set(user.id, {
        userId: user.id,
        status,
        lastSeen: status === 'offline' ? new Date() : (currentStatus?.lastSeen || new Date()),
        isTyping: status === 'offline' ? false : (currentStatus?.isTyping || false),
        location: currentStatus?.location || 'Desktop'
      });

      return newUsers;
    });

    // In a real app, you would send this to your backend/WebSocket server
    // Example: socketService.updateStatus(status);
  };

  const setTypingStatus = (isTyping: boolean, chatId?: string) => {
    if (!user?.id) return;

    setOnlineUsers(prevUsers => {
      const newUsers = new Map(prevUsers);
      const currentStatus = newUsers.get(user.id);
      
      if (currentStatus) {
        newUsers.set(user.id, {
          ...currentStatus,
          isTyping
        });
      }

      return newUsers;
    });

    // In a real app, you would send typing indicators to specific chat participants
    // Example: socketService.sendTypingStatus(chatId, isTyping);
  };

  const getLastSeenText = (userId: string): string => {
    const status = getUserStatus(userId);
    if (!status) return 'Unknown';

    if (status.status === 'online') return 'Online now';
    if (status.status === 'away') return 'Away';

    const now = new Date();
    const lastSeen = status.lastSeen;
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return lastSeen.toLocaleDateString();
  };

  const isUserOnline = (userId: string): boolean => {
    const status = getUserStatus(userId);
    return status?.status === 'online';
  };

  const getTotalOnlineUsers = (): number => {
    return Array.from(onlineUsers.values()).filter(status => status.status === 'online').length;
  };

  const getOnlineUsersList = (): UserOnlineStatus[] => {
    return Array.from(onlineUsers.values())
      .filter(status => status.status === 'online')
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  };

  // Handle beforeunload to set user offline
  useEffect(() => {
    if (!isClient) return;
    
    const handleBeforeUnload = () => {
      if (user?.id) {
        updateUserStatus('offline');
        // In a real app, you might want to send this synchronously
        // navigator.sendBeacon('/api/user/status', JSON.stringify({ status: 'offline' }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, isClient]);

  const value: OnlineStatusContextType = {
    onlineUsers,
    getUserStatus,
    updateUserStatus,
    setTypingStatus,
    getLastSeenText,
    isUserOnline,
    getTotalOnlineUsers,
    getOnlineUsersList
  };

  return (
    <OnlineStatusContext.Provider value={value}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = (): OnlineStatusContextType => {
  const context = useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error('useOnlineStatus must be used within an OnlineStatusProvider');
  }
  return context;
};
