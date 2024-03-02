<template>
  <Dialog :open="isModalVisible">
    <DialogTrigger as-child>
      <Button @click="handleModalCreation"> Create new record </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[40rem]">
      <DialogHeader>
        <DialogTitle> Boat Information </DialogTitle>
        <DialogDescription>
          Complete answering the input fields then click create when you're done.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="boat-name" class="text-right"> Boat Name </Label>
          <Input
            v-model.trim="form.boatName"
            id="boat-name"
            class="col-span-3"
            placeholder="Ex. My Boat"
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="serial-number" class="text-right"> Serial Number </Label>
          <Input
            v-model.trim="form.serialNumber"
            id="serial-number"
            class="col-span-3"
            placeholder="Ex. 123456789"
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="destination" class="text-right"> Destination </Label>
          <Select v-model="form.destination" id="destination" required>
            <SelectTrigger class="col-span-3">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel> Destinations </SelectLabel>
                <SelectItem
                  v-for="(destination, index) in destinations.destinations"
                  :key="index"
                  :value="destination.value"
                >
                  {{ destination.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button @click="handleRecordSaving" type="submit"> Create </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import destinations from "@/assets/data/destinations.json";
import type { ICreateRecord, IRealtimeDbResponse } from "@/assets/ts/interfaces";
import { database } from "@/firebase/config";
import { ref as useDbRef, onValue, set } from "firebase/database";
// import { useRecordStore } from "@/stores/record";
import { useToast } from "@/components/ui/toast/use-toast";
import { reactive, ref } from "vue";
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

const { toast } = useToast();
// const store = useRecordStore();
const isModalVisible = ref(false);
const result = reactive<IRealtimeDbResponse>({
  IsAvailable: true,
  IsDeparted: false,
  IsLoading: false,
  LoadingStatus: " ------ ",
  PassengerCount: 0,
});
const form = reactive<ICreateRecord>({
  boatName: "",
  serialNumber: "",
  destination: "",
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

async function updateDatabase(): Promise<void> {
  result.IsLoading = true;

  try {
    await set(useDbRef(database), { "0xb1": { ...result } });
  } catch (error) {
    console.log(error);
  }
}

function resetForm(): void {
  form.boatName = "";
  form.serialNumber = "";
  form.destination = "";
}

function handleModalCreation(): void {
  resetForm();
  isModalVisible.value = !isModalVisible.value;
}

async function handleRecordSaving(): Promise<void> {
  form.destination =
    destinations.destinations.find((destination) => destination.value === form.destination)
      ?.label ?? "";

  if (!Object.values(form).some((value) => value.trim().length === 0)) {
    await updateDatabase().then(() => {
      // store.createRecord(form);
      toast({
        title: "Record Successfully Created!",
        description: `Boat: ${form.boatName} | Serial Number: ${form.serialNumber} | Destination: ${form.destination}`,
        duration: 2500,
      });

      resetForm();
      isModalVisible.value = !isModalVisible.value;
    });
  }
}
</script>
