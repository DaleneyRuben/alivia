"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import {
  isValidLocationInput,
  type LocationInput,
} from "./isValidLocationInput";

export interface UpdateLocationInput extends LocationInput {
  locationId: string;
}

export async function updateLocation(input: UpdateLocationInput) {
  const doctorId = await requireDoctorOnlyId();
  if (!isValidLocationInput(input)) throw new Error("Invalid location");

  const location = await prisma.location.findUnique({
    where: { id: input.locationId },
  });
  if (!location || location.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }

  await prisma.location.update({
    where: { id: input.locationId },
    data: { name: input.name.trim(), address: input.address.trim() },
  });

  revalidatePath("/panel/locations");
}
