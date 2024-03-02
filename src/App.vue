<template>
  <template v-if="isAuthenticated">
    <TheHeader />

    <main class="p-4">
      <p>Account signed in: {{ email }}</p>
    </main>

    <Toaster />
  </template>

  <template v-else>
    <TheLoading />
  </template>
</template>

<script lang="ts" setup>
import type { IResponse } from "@/assets/ts/interfaces";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ref } from "vue";
import Toaster from "@/components/ui/toast/Toaster.vue";
import useSignIn from "@/firebase/auth/signin";
import TheLoading from "@/components/TheLoading.vue";
import TheHeader from "@/components/TheHeader.vue";

const isAuthenticated = ref(false);
const email = ref<string | null>(null);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    isAuthenticated.value = true;
    email.value = user.email;
  } else {
    try {
      const response: IResponse = await useSignIn(
        import.meta.env.VITE_FIREBASE_EMAIL,
        import.meta.env.VITE_FIREBASE_PASSWORD,
      );

      if (response) isAuthenticated.value = true;
    } catch (error: any) {
      isAuthenticated.value = false;
    }
  }
});
</script>
