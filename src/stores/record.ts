import type { ICreateRecord } from "@/assets/ts/interfaces";
import { defineStore } from "pinia";
import { ref } from "vue";

function getCurrentDateAndTime(): string {
  const now: Date = new Date();
  const year: number = now.getFullYear();
  const month: number = now.getMonth() + 1;
  const day: number = now.getDate();
  const hours: number = now.getHours();
  const minutes: number = now.getMinutes();
  const seconds: number = now.getSeconds();
  const meridiem = hours >= 12 ? "PM" : "AM";
  const date: string = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  const time: string = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${meridiem}`;

  return `${date} ${time}`;
}

export const useRecordStore = defineStore(
  "record",
  () => {
    const createdAt = ref("N/A");
    const boatName = ref("N/A");
    const serialNumber = ref("N/A");
    const destination = ref("N/A");
    const passengersCount = ref("N/A");
    const loadingStatus = ref("N/A");
    const departedAt = ref("N/A");

    function createRecord(record: ICreateRecord): void {
      createdAt.value = getCurrentDateAndTime();
      boatName.value = record.boatName!;
      serialNumber.value = record.serialNumber!;
      destination.value = record.destination!;
    }

    function resetRecord(): void {
      createdAt.value = "N/A";
      boatName.value = "N/A";
      serialNumber.value = "N/A";
      destination.value = "N/A";
      passengersCount.value = "N/A";
      loadingStatus.value = "N/A";
      departedAt.value = "N/A";
    }

    return {
      createdAt,
      boatName,
      serialNumber,
      destination,
      passengersCount,
      loadingStatus,
      departedAt,
      resetRecord,
      createRecord,
    };
  },
  {
    persist: true,
  },
);
