import { create } from 'zustand';

interface NoshonState {
  isShowToolbar: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowToolbar: (shown: boolean) => void;
}

export const useNoshonStore = create<NoshonState>((set) => ({
  isShowToolbar: false,
  setShowToolbar: (shown: boolean) => set(() => ({ isShowToolbar: shown })),
  // toggleShowToolbar: () => set((state) => ({ isShowToolbar: !state.isShowToolbar })),
}));
