import { create, StateCreator } from 'zustand'

interface Organization {
  id: string
  name: string
  [key: string]: any
}

interface AppState {
  currentOrg: Organization | null
  setCurrentOrg: (org: Organization) => void
}

export const useAppState = create<AppState>((set: Parameters<StateCreator<AppState>>[0]) => ({
  currentOrg: null,
  setCurrentOrg: (org: Organization) => set({ currentOrg: org }),
})) 