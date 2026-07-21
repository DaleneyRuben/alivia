"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import {
  isValidLocationInput,
  type LocationInput,
} from "./isValidLocationInput";

export async function createLocation(input: LocationInput) {
  const doctorId = await requireDoctorOnlyId();
  if (!isValidLocationInput(input)) throw new Error("Invalid location");

  await prisma.location.create({
    data: { doctorId, name: input.name.trim(), address: input.address.trim() },
  });

  revalidatePath("/panel/locations");
}
