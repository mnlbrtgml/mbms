<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button> Upload image </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[40rem]">
      <DialogHeader>
        <DialogTitle> Add Image File </DialogTitle>
        <DialogDescription>
          Uploading a new image will override the previously uploaded image
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4"></div>

      <DialogFooter>
        <Button type="submit"> Done </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
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
</script>
