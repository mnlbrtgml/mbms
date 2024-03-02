<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button> Create Record </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[40rem]">
      <DialogHeader>
        <DialogTitle> Create Record </DialogTitle>

        <DialogDescription>
          Complete answering the input fields then click create when you're done.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="boat-name" class="text-right"> Boat Name </Label>
          <Input v-model.trim="form.boatName!" id="boat-name" class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="serial-number" class="text-right"> Serial Number </Label>
          <Input v-model.trim="form.serialNumber!" id="serial-number" class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="destination" class="text-right"> Destination </Label>
          <Select v-model="form.destination!" id="destination">
            <SelectTrigger class="col-span-3">
              <SelectValue />
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
        <DialogClose as-child>
          <Button type="button" variant="outline"> Cancel </Button>
        </DialogClose>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button type="button"> Done </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle :class="isFormFilledOut ? 'text-primary' : 'text-destructive'">
                {{ alertTitle }}
              </AlertDialogTitle>
              <AlertDialogDescription> {{ alertDescription }} </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel v-if="isFormFilledOut"> Cancel </AlertDialogCancel>
              <AlertDialogAction @click="isFormFilledOut ? handleRecordSaving() : undefined">
                {{ alertAction }}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import destinations from "@/assets/data/destinations.json";
import type { ICreateRecord, IRtdbResponse } from "@/assets/ts/interfaces";
import { ref as useRtdbRef, onValue, set } from "firebase/database";
import { database } from "@/firebase/config";
import { useRecordStore } from "@/stores/record";
import { useToast } from "@/components/ui/toast/use-toast";
import { ref, reactive, computed, watch } from "vue";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const { toast } = useToast();
const store = useRecordStore();
const rtdbRef = useRtdbRef(database);
const isDialogOpen = ref(false);
const isFormFilledOut = computed(
  () => !Object.values(form).some((value: string | null) => value === null || value.length === 0),
);
const alertTitle = computed(() => (isFormFilledOut.value ? "Saving Confirmation" : "Saving Error"));
const alertDescription = computed(() =>
  isFormFilledOut.value
    ? "This action cannot be undone. This will create a new record as the currently active boat."
    : "Please complete all the input fields to create a new record.",
);
const alertAction = computed(() => (isFormFilledOut.value ? "Create" : "Okay"));
const rtdbData = reactive<IRtdbResponse>({
  IsAvailable: true,
  IsDeparted: false,
  IsLoading: false,
  LoadingStatus: " ------ ",
  PassengerCount: 0,
});
const form = reactive<ICreateRecord>({
  boatName: null,
  serialNumber: null,
  destination: null,
});

function resetForm(): void {
  form.boatName = null;
  form.serialNumber = null;
  form.destination = null;
}

async function updateDatabase(): Promise<void> {
  rtdbData.IsLoading = true;

  try {
    await set(rtdbRef, { "0xb1": { ...rtdbData } });
  } catch (error) {
    console.log(error);
  }
}

async function handleRecordSaving(): Promise<void> {
  form.destination =
    destinations.destinations.find((destination) => destination.value === form.destination)
      ?.label ?? null;

  if (isFormFilledOut.value) {
    await updateDatabase().then(() => {
      store.createRecord(form);

      toast({
        title: "Record Successfully Created!",
        description: `BN: ${form.boatName} | SN: ${form.serialNumber} | D: ${form.destination}`,
        duration: 2500,
      });

      isDialogOpen.value = false;
    });
  }
}

onValue(rtdbRef, (snapshot) => {
  const data: any = snapshot.val();

  if (data["0xb1"]) {
    rtdbData.IsAvailable = data["0xb1"].IsAvailable;
    rtdbData.IsDeparted = data["0xb1"].IsDeparted;
    rtdbData.PassengerCount = data["0xb1"].PassengerCount;
    rtdbData.IsLoading = data["0xb1"].IsLoading;
    rtdbData.LoadingStatus = data["0xb1"].LoadingStatus;
  }
});

watch(isDialogOpen, (newValue) => {
  if (!newValue) resetForm();
});
</script>
