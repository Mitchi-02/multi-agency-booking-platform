import { create } from "zustand"

interface SidebarToggleHook {
  toggleCollapse: boolean
  invokeToggleCollapse: () => void
}

export const useSidebarToggle = create<SidebarToggleHook>((set, get) => ({
  toggleCollapse: false,
  invokeToggleCollapse: () => set({ toggleCollapse: !get().toggleCollapse })
}))

//MANICH KHADEM BIHA....
