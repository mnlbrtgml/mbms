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

      <div class="grid gap-4 py-4"></div>

      <DialogFooter>
        <Button type="submit"> Done </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- <div class="bg-gray-200 p-4 grid place-items-center">
    <div ref="divElement" class="bg-white w-[210mm] h-[297mm] p-8 flex flex-col gap-4">
      <h1>This is a sample pdf</h1>

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
          <p class="py-2 flex items-center justify-center">02/03/2024 2:45:30 PM</p>
          <p class="py-2 flex items-center justify-center">Boat Name</p>
          <p class="py-2 flex items-center justify-center">123456789</p>
          <p class="py-2 flex items-center justify-center">Brgy. Sample</p>
          <p class="py-2 flex items-center justify-center">0</p>
          <p class="py-2 flex items-center justify-center">Normal</p>
          <p class="text-balance flex flex-col justify-center">02/03/2024 2:45:30 PM</p>
        </div>
      </div>

      <img
        src="https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg"
        alt=""
        class="w-full mt-8 border"
      />
    </div>
  </div>

  <button @click="onDownload">Download PDF</button> -->
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import domtoimage from "dom-to-image";

const divElement = ref<HTMLDivElement | null>(null);
const dimension = [595, 842]; // A4 dimension

async function onDownload(): Promise<void> {
  domtoimage.toPng(divElement.value!).then((response) => {
    const pdf = new jsPDF("portrait", "pt", dimension);
    pdf.addImage(response, "PNG", 0, 0, dimension[0], dimension[1]);
    pdf.save("table.pdf");
  });
}
</script>
