import { get } from "@/utils/http";
import { ref } from "vue";

export const useGet = <T>(url: string) => {
  const data = ref<T | null>(null);
  const error = ref<any | null>(null);
  const loading = ref<boolean>(true);

  get(url)
    .then((res) => {
      if (res.status !== 500) {
        data.value = res.data.data;
      }
    })
    .catch((err) => (error.value = err))
    .finally(() => (loading.value = false));

  return { data, error, loading };
};
