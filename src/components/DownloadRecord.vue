<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button> Download Record </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[40rem]">
      <DialogHeader>
        <DialogTitle> Download Record </DialogTitle>
        <DialogDescription>
          Download record with the image uploaded in PDF format
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <Button @click="downloadPdfFile">Download record of {{ store.createdAt }} in PDF</Button>

        <div class="max-h-40 overflow-auto">
          <div ref="divElement" class="bg-white w-[210mm] h-[297mm] p-8 flex flex-col gap-4">
            <h1>{{ `Record for ${store.createdAt}` }}</h1>

            <div class="p-1">
              <div
                class="bg-primary text-primary-foreground text-sm rounded-t-lg grid grid-cols-7 text-center divide-x"
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
                <p class="py-2 flex items-center justify-center">Number of Passengers</p>
                <p class="py-2 flex items-center justify-center">Loading Status</p>
                <p class="text-balance flex flex-col justify-center">
                  Departed <span class="text-[0.5rem]">Date and Time</span>
                </p>
              </div>

              <div
                class="bg-gray-100 text-gray-700 text-xs rounded-b-lg grid grid-cols-7 text-center divide-x"
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

            <img
              v-if="store.imagePath !== 'N/A'"
              :src="store.imagePath"
              :alt="store.createdAt"
              class="w-full mt-8 border"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="submit"> Done </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { storage } from "@/firebase/config";
import { ref as useStorageRef, getDownloadURL } from "firebase/storage";
import { useRecordStore } from "@/stores/record";
import { ref } from "vue";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import domtoimage from "dom-to-image";

const store = useRecordStore();
const image = ref();
const divElement = ref();
const dimension = [595, 842]; // A4 dimension

async function downloadPdfFile(): Promise<void> {
  try {
    const storageRef = useStorageRef(storage, `images/${store.createdAt}`);
    const url = await getDownloadURL(storageRef);

    if (url) {
      image.value = url;

      domtoimage.toPng(divElement.value).then((response) => {
        const pdf = new jsPDF("portrait", "pt", dimension);
        pdf.addImage(response, "PNG", 0, 0, dimension[0], dimension[1]);
        pdf.save("table.pdf");
      });
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
