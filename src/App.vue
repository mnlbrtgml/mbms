<template>
  <template v-if="isAuthenticated">
    <TheHeader />

    <main class="p-4">
      <div v-if="store.createdAt !== 'N/A'" class="p-8 flex flex-col gap-4">
        <h1>{{ `Record for ${store.createdAt}` }}</h1>

        <div class="p-1">
          <div
            class="bg-primary text-primary-foreground rounded-t-lg grid grid-cols-7 text-center divide-x"
          >
            <p class="py-2 flex items-center justify-center">
              Date <br />
              and Time
            </p>
            <p class="py-2 flex items-center justify-center">Boat Name</p>
            <p class="py-2 flex items-center justify-center">
              Serial <br />
              Number
            </p>
            <p class="py-2 flex items-center justify-center">Destination</p>
            <p class="py-2 flex items-center justify-center">
              Number of <br />
              Passengers
            </p>
            <p class="py-2 flex items-center justify-center">Loading Status</p>
            <p class="text-balance flex flex-col justify-center">
              Departed <br />
              Date and Time
            </p>
          </div>

          <div
            class="bg-gray-100 text-gray-700 text-sm rounded-b-lg grid grid-cols-7 text-center divide-x"
          >
            <p class="py-2 flex items-center justify-center">{{ store.createdAt }}</p>
            <p class="py-2 flex items-center justify-center">{{ store.boatName }}</p>
            <p class="py-2 flex items-center justify-center">{{ store.serialNumber }}</p>
            <p class="py-2 flex items-center justify-center">{{ store.destination }}</p>
            <p class="py-2 flex items-center justify-center">{{ store.passengersCount }}</p>
            <p class="py-2 flex items-center justify-center">{{ store.loadingStatus }}</p>
            <p class="text-balance flex flex-col justify-center">{{ store.departedAt }}</p>
          </div>
        </div>
      </div>

      <p v-else class="text-center">No active record</p>
    </main>

    <Toaster />
  </template>

  <template v-else>
    <TheLoading />
  </template>
</template>

<script lang="ts" setup>
import type { IResponse } from "@/assets/ts/interfaces";
import { useRecordStore } from "@/stores/record";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ref, watchEffect } from "vue";
import Toaster from "@/components/ui/toast/Toaster.vue";
import useSignIn from "@/firebase/auth/signin";
import TheLoading from "@/components/TheLoading.vue";
import TheHeader from "@/components/TheHeader.vue";

const store = useRecordStore();
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
