<template>
  <header v-if="status" class="w-full p-2 sticky top-0">
    <nav class="p-2 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-4xl font-bold uppercase">Motor Banca Monitoring System</h1>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <div :class="status[0]" class="size-6 rounded-full" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ status[1] }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div class="space-x-2">
        <CreateRecord v-if="status[0].includes('green')" />

        <template v-else>
          <UploadImage />
          <DownloadRecord />
        </template>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import type { IRealtimeDbResponse } from "@/assets/ts/interfaces";
import { database } from "@/firebase/config";
import { reactive, computed } from "vue";
import { ref as useDbRef, onValue } from "firebase/database";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CreateRecord from "@/components/CreateRecord.vue";
import UploadImage from "@/components/UploadImage.vue";
import DownloadRecord from "@/components/DownloadRecord.vue";

const result = reactive<IRealtimeDbResponse>({
  IsAvailable: true,
  IsDeparted: false,
  IsLoading: false,
  LoadingStatus: " ------ ",
  PassengerCount: 0,
});

const status = computed(() => {
  if (!result.IsAvailable && !result.IsLoading && result.IsDeparted) {
    return ["bg-red-600", "There is no boat nearby"];
  } else if (result.IsAvailable) {
    return ["bg-green-600", "There is available boat nearby"];
  } else {
    return ["bg-blue-600", "The boat is currently loading"];
  }
});

const realtimeDatabaseRef = useDbRef(database);

onValue(realtimeDatabaseRef, (snapshot) => {
  const response: any = snapshot.val();

  if (response["0xb1"]) {
    result.IsAvailable = response["0xb1"].IsAvailable;
    result.IsDeparted = response["0xb1"].IsDeparted;
    result.PassengerCount = response["0xb1"].PassengerCount;
    result.IsLoading = response["0xb1"].IsLoading;
    result.LoadingStatus = response["0xb1"].LoadingStatus;
  }
});
</script>
