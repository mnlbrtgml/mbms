<template>
  <header class="w-full p-2 sticky top-0">
    <nav class="p-2 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-4xl font-bold uppercase">Motor Banca Monitoring System</h1>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <div class="bg-green-600 size-6 rounded-full" />
            </TooltipTrigger>
            <TooltipContent>
              <p>There's available boat nearby</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div class="space-x-2">
        <CreateRecord />
        <UploadImage />
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CreateRecord from "@/components/CreateRecord.vue";
import UploadImage from "@/components/UploadImage.vue";
</script>
