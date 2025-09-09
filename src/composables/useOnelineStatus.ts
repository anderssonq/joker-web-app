import { ref, onMounted, onUnmounted } from "vue";
// INFO: closure usage -> functions below capture outer scope variables.
export function useOnlineStatus() {
  const isOnline = ref(navigator.onLine);

  const updateStatus = () => {
    isOnline.value = navigator.onLine;
  };

  onMounted(() => {
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
  });

  onUnmounted(() => {
    window.removeEventListener("online", updateStatus);
    window.removeEventListener("offline", updateStatus);
  });

  return { isOnline };
}