// src/HistoryModalContext.tsx
import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { ActiveModal, HistoryModalContextType, HistoryModalProviderProps } from "./types"; // Import types

// Helper to check if we are in a browser environment (client-side)
const isNotSsr = (): boolean => typeof window !== 'undefined';

export const HistoryModalContext = createContext<HistoryModalContextType>({
  activeModals: [],
  closeModal: () => {},
  openModal: () => {},
  openModalChecker: () => undefined,
});

export const HistoryModalProvider: React.FC<HistoryModalProviderProps> = ({ children }) => {
  const [activeModals, setActiveModals] = useState<ActiveModal[]>([]);

  const openModalChecker = useCallback((modalId: string): ActiveModal | undefined => {
    return activeModals.find((item) => item.id === modalId);
  }, [activeModals]);

  const openModal = useCallback(({ modalId, ...data }: { modalId: string; [key: string]: any }) => {
    if (isNotSsr()) {
      window.history.pushState({ modalId, data }, "");
    }
    setActiveModals((prev) => [...prev, { id: modalId, data }]);
  }, []);

  const closeModal = useCallback((modalId: string) => {
    setActiveModals((prev) => {
      return prev.filter((item) => item.id !== modalId);
    });
    if (isNotSsr()) {
      window.history.replaceState({}, "");
    }
  }, []);

  useEffect(() => {
    if (isNotSsr()) {
      const handlePopState = (event: PopStateEvent) => {
        setActiveModals((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated.pop();
          }
          return updated;
        });
        window.history.replaceState({}, "");
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);

  const contextValue: HistoryModalContextType = {
    activeModals,
    openModal,
    closeModal,
    openModalChecker,
  };

  return (
    <HistoryModalContext.Provider value={contextValue}>
      {children}
    </HistoryModalContext.Provider>
  );
};

export const useHistoryModals = (): HistoryModalContextType => {
  const context = useContext(HistoryModalContext);
  if (!context) {
    throw new Error("useHistoryModals must be used within a HistoryModalProvider");
  }
  return context;
};