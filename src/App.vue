<template>
  <template v-if="isAuthenticated">
    <TheHeader />

    <main class="p-4">
      <div class="p-8 flex flex-col gap-4">
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
            <p class="py-2 text-pretty flex items-center justify-center">{{ store.createdAt }}</p>
            <p class="py-2 text-pretty flex items-center justify-center">{{ store.boatName }}</p>
            <p class="py-2 text-pretty flex items-center justify-center">
              {{ store.serialNumber }}
            </p>
            <p class="py-2 text-pretty flex items-center justify-center">
              {{ store.destination }}
            </p>
            <p class="py-2 text-pretty flex items-center justify-center">
              {{ store.passengersCount }}
            </p>
            <p class="py-2 text-pretty flex items-center justify-center">
              {{ store.loadingStatus }}
            </p>
            <p class="text-pretty flex flex-col justify-center">{{ store.departedAt }}</p>
          </div>
        </div>
      </div>

      <div class="px-8 pb-8">
        <Button @click="useGetRecords">Refresh table</Button>

        <div class="flex flex-col gap-4">
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
              v-for="(record, index) in records"
              :key="index"
              class="bg-gray-100 text-gray-700 text-xs rounded-b-lg grid grid-cols-7 text-center divide-x"
            >
              <p class="py-2 text-pretty flex items-center justify-center">
                {{ record.createdAt }}
              </p>
              <p class="py-2 text-pretty flex items-center justify-center">{{ record.boatName }}</p>
              <p class="py-2 text-pretty flex items-center justify-center">
                {{ record.serialNumber }}
              </p>
              <p class="py-2 text-pretty flex items-center justify-center">
                {{ record.destination }}
              </p>
              <p class="py-2 text-pretty flex items-center justify-center">
                {{ record.passengersCount }}
              </p>
              <p class="py-2 text-pretty flex items-center justify-center">
                {{ record.loadingStatus }}
              </p>
              <p class="text-pretty flex flex-col justify-center">{{ record.departedAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Toaster />
  </template>

  <template v-else>
    <TheLoading />
  </template>
</template>

<script lang="ts" setup>
import type { IResponse, IRtdbResponse } from "@/assets/ts/interfaces";
import { ref as useRtdbRef, onValue, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { database, auth, db } from "@/firebase/config";
import { useRecordStore } from "@/stores/record";
import { ref, reactive } from "vue";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Toaster from "@/components/ui/toast/Toaster.vue";
import useSignIn from "@/firebase/auth/signin";
import TheLoading from "@/components/TheLoading.vue";
import TheHeader from "@/components/TheHeader.vue";
import Button from "./components/ui/button/Button.vue";

interface IRecordDB {
  createdAt: string;
  boatName: string;
  serialNumber: string;
  destination: string;
  passengersCount: string;
  loadingStatus: string;
  departedAt: string;
}

const store = useRecordStore();
const isAuthenticated = ref(false);
const records = reactive<IRecordDB[]>([]);
const rtdbData = reactive<IRtdbResponse>({
  IsAvailable: true,
  IsDeparted: false,
  IsLoading: false,
  LoadingStatus: " ------ ",
  PassengerCount: 0,
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    isAuthenticated.value = true;

    await useGetRecords();

    const rtdbRef = useRtdbRef(database);

    onValue(rtdbRef, async (snapshot) => {
      const data: any = snapshot.val();

      if (!data["0xb1"].IsAvailable && !data["0xb1"].IsDeparted && !data["0xb1"].IsLoading) {
        store.resetRecord();
      }

      if (!data["0xb1"].IsDeparted) {
        rtdbData.IsAvailable = data["0xb1"].IsAvailable;
        rtdbData.IsDeparted = data["0xb1"].IsDeparted;
        rtdbData.PassengerCount = data["0xb1"].PassengerCount;
        rtdbData.IsLoading = data["0xb1"].IsLoading;
        rtdbData.LoadingStatus = data["0xb1"].LoadingStatus;

        store.passengersCount = rtdbData.PassengerCount.toString();
        store.loadingStatus = rtdbData.LoadingStatus;
      } else {
        store.setDeparted();

        set(rtdbRef, {
          "0xb1": {
            IsAvailable: false,
            IsDeparted: true,
            IsLoading: false,
            LoadingStatus: " ------ ",
            PassengerCount: 0,
          },
        });

        try {
          await addDoc(collection(db, "records"), {
            createdAt: store.createdAt,
            boatName: store.boatName,
            serialNumber: store.serialNumber,
            destination: store.destination,
            passengersCount: store.passengersCount,
            loadingStatus: store.loadingStatus,
            departedAt: store.departedAt,
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    });
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

async function useGetRecords(): Promise<void> {
  const getRecords = await getDocs(collection(db, "records"));

  getRecords.forEach((record) => {
    const data = record.data();
    records.push(data as IRecordDB);
  });
}
</script>
