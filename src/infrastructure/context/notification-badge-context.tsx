import React, { createContext, useCallback, useContext, useRef, useState } from "react";

export interface NotificationSource {
    key: string;
    fetchUnread: () => Promise<{ id: string }[]>;
    markSeen: (id: string) => Promise<void>;
}

interface NotificationBadgeContextValue {
    registerSource: (source: NotificationSource) => void;
    unregisterSource: (key: string) => void;
    getCount: (key: string) => number;
    totalCount: number;
    getUnreadIds: (key: string) => Set<string>;
    markSeen: (key: string, id: string) => void;
    refresh: (key?: string) => void;
}

const NotificationBadgeContext = createContext<NotificationBadgeContextValue>({
    registerSource: () => {},
    unregisterSource: () => {},
    getCount: () => 0,
    totalCount: 0,
    getUnreadIds: () => new Set(),
    markSeen: () => {},
    refresh: () => {},
});

export const useNotificationBadge = () => useContext(NotificationBadgeContext);

export const NotificationBadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const sources = useRef<Map<string, NotificationSource>>(new Map());
    const [unreadMap, setUnreadMap] = useState<Map<string, Set<string>>>(new Map());

    const fetchSource = useCallback(async (source: NotificationSource) => {
        try {
            const items = await source.fetchUnread();
            setUnreadMap(prev => {
                const next = new Map(prev);
                next.set(source.key, new Set(items.map(i => i.id)));
                return next;
            });
        } catch {
            // no-op
        }
    }, []);

    const registerSource = useCallback((source: NotificationSource) => {
        sources.current.set(source.key, source);
        fetchSource(source);
    }, [fetchSource]);

    const unregisterSource = useCallback((key: string) => {
        sources.current.delete(key);
        setUnreadMap(prev => {
            const next = new Map(prev);
            next.delete(key);
            return next;
        });
    }, []);

    const getUnreadIds = useCallback((key: string): Set<string> => {
        return unreadMap.get(key) ?? new Set();
    }, [unreadMap]);

    const getCount = useCallback((key: string): number => {
        return getUnreadIds(key).size;
    }, [getUnreadIds]);

    const totalCount = Array.from(unreadMap.values()).reduce((sum, set) => sum + set.size, 0);

    const markSeen = useCallback((key: string, id: string) => {
        const source = sources.current.get(key);
        if (source) source.markSeen(id).catch(console.error);
        setUnreadMap(prev => {
            const set = prev.get(key);
            if (!set?.has(id)) return prev;
            const next = new Map(prev);
            const newSet = new Set(set);
            newSet.delete(id);
            next.set(key, newSet);
            return next;
        });
    }, []);

    const refresh = useCallback((key?: string) => {
        if (key) {
            const source = sources.current.get(key);
            if (source) fetchSource(source);
        } else {
            sources.current.forEach(source => fetchSource(source));
        }
    }, [fetchSource]);

    return (
        <NotificationBadgeContext.Provider value={{ registerSource, unregisterSource, getCount, totalCount, getUnreadIds, markSeen, refresh }}>
            {children}
        </NotificationBadgeContext.Provider>
    );
};
