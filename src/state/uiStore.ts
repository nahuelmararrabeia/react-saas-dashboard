import { create } from 'zustand'
import { storage } from '@/lib/storage'

type UiState = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const KEY = 'rsd.ui.v1'

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: storage.get(KEY, { sidebarOpen: true }).sidebarOpen,
  setSidebarOpen: (open) => {
    storage.set(KEY, { sidebarOpen: open })
    set({ sidebarOpen: open })
  },
  toggleSidebar: () => {
    const next = !get().sidebarOpen
    storage.set(KEY, { sidebarOpen: next })
    set({ sidebarOpen: next })
  }
}))
