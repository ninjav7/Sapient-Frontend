import { LoadingStore } from '../../../store/LoadingStore';

export const setProcessing = (value) => {
    LoadingStore.update((s) => {
        s.isLoading = value;
    });
};
