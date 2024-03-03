<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button> Upload Image </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[40rem]">
      <DialogHeader>
        <DialogTitle> Upload Image </DialogTitle>
        <DialogDescription>
          Uploading a new image will override the previously uploaded image.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <Input
          @change="handleImageInputting($event)"
          id="picture"
          type="file"
          class="hidden"
          accept="image/*"
        />

        <div class="bg-secondary h-52 rounded-lg">
          <img
            v-if="previewImage"
            :src="previewImage ?? undefined"
            class="w-full h-full object-cover object-center rounded-lg"
          />
        </div>
      </div>

      <DialogFooter>
        <div class="mr-auto space-x-2">
          <Label
            for="picture"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Choose file
          </Label>
        </div>

        <DialogClose as-child>
          <Button type="button" variant="outline"> Cancel </Button>
        </DialogClose>

        <Button v-if="previewImage" @click="uploadImage" type="button"> Upload </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { useRecordStore } from "@/stores/record";
import { ref, watch } from "vue";
import { storage } from "@/firebase/config";
import { ref as useStorageRef, uploadBytes } from "firebase/storage";
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
  DialogClose,
} from "@/components/ui/dialog";

const { createdAt } = useRecordStore();
const isDialogOpen = ref<boolean>(false);
const previewImage = ref<string | null>(null);
const imageFile = ref<any>(null);

async function uploadImage(): Promise<void> {
  try {
    const storageRef = useStorageRef(storage, `images/${createdAt}`);
    const snapshot = await uploadBytes(storageRef, imageFile.value);

    if (snapshot) {
      isDialogOpen.value = false;
    }
  } catch (error) {
    console.log(error);
  }
}

function handleImageInputting(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (file) {
    URL.revokeObjectURL(previewImage.value ?? "");
    previewImage.value = URL.createObjectURL(file);
    imageFile.value = file;
  }
}

watch(isDialogOpen, (newValue) => {
  if (!newValue) {
    previewImage.value = null;
    imageFile.value = null;
    URL.revokeObjectURL(previewImage.value ?? "");
  }
});
</script>
