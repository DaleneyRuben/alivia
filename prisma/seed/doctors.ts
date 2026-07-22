import type { PrismaClient } from "../../src/generated/prisma/client";
import {
  addDaysIso,
  daysFromNow,
  isoToDate,
  laPazToday,
  toMinutes,
} from "./helpers";
import { DOCTORS } from "./doctorsData";

export async function seedDoctors(
  prisma: PrismaClient,
  passwordHash: string,
): Promise<void> {
  const today = laPazToday();

  for (const config of DOCTORS) {
    const user = await prisma.user.upsert({
      where: { email: config.email },
      update: { passwordHash, active: config.accountActive },
      create: {
        email: config.email,
        passwordHash,
        role: "DOCTOR",
        active: config.accountActive,
      },
    });

    const doctor = await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: config.name,
        phone: config.phone,
        specialty: config.specialty,
        practiceName: config.practiceName,
        yearsExperience: config.yearsExperience,
        university: config.university,
        bio: config.bio,
        onboardedAt: config.onboardedAt,
        medicalHistoryEnabled: config.medicalHistoryEnabled,
        subscription: {
          create: {
            status: config.subscriptionStatus,
            renewsAt:
              config.subscriptionStatus === "ACTIVE" ? daysFromNow(30) : null,
          },
        },
        locations: {
          create: config.locations.map((location) => ({
            name: location.name,
            address: location.address,
            scheduleBlocks: { create: location.scheduleBlocks },
          })),
        },
      },
      include: { locations: true },
    });

    const locationsByName = new Map(
      doctor.locations.map((location) => [location.name, location]),
    );

    if (config.assistant) {
      const assistantUser = await prisma.user.upsert({
        where: { email: config.assistant.email },
        update: { passwordHash },
        create: {
          email: config.assistant.email,
          passwordHash,
          role: "ASSISTANT",
        },
      });
      await prisma.assistant.upsert({
        where: { userId: assistantUser.id },
        update: {},
        create: {
          userId: assistantUser.id,
          doctorId: doctor.id,
          name: config.assistant.name,
          phone: config.assistant.phone,
        },
      });
    }

    for (const vacation of config.vacations ?? []) {
      const location = vacation.locationName
        ? locationsByName.get(vacation.locationName)
        : null;
      await prisma.vacation.create({
        data: {
          doctorId: doctor.id,
          locationId: location?.id ?? null,
          startDate: isoToDate(addDaysIso(today, vacation.startDayOffset)),
          endDate: isoToDate(addDaysIso(today, vacation.endDayOffset)),
        },
      });
    }

    for (const patientConfig of config.patients) {
      const patient = await prisma.patient.upsert({
        where: {
          doctorId_phone: { doctorId: doctor.id, phone: patientConfig.phone },
        },
        update: {},
        create: {
          doctorId: doctor.id,
          name: patientConfig.name,
          phone: patientConfig.phone,
        },
      });

      for (const appointment of patientConfig.appointments) {
        const location = locationsByName.get(appointment.locationName);
        if (!location) {
          throw new Error(
            `Unknown location "${appointment.locationName}" for ${config.name}`,
          );
        }
        const startMinutes = toMinutes(
          appointment.startHour,
          appointment.startMinute ?? 0,
        );
        await prisma.appointment.create({
          data: {
            doctorId: doctor.id,
            locationId: location.id,
            patientId: patient.id,
            date: isoToDate(addDaysIso(today, appointment.dayOffset)),
            startMinutes,
            endMinutes: startMinutes + appointment.durationMinutes,
            status: appointment.status,
            confirmation: appointment.confirmation ?? "PENDING",
            source: appointment.source,
          },
        });
      }

      if (patientConfig.history) {
        await prisma.medicalProfile.create({
          data: {
            patientId: patient.id,
            dateOfBirth: patientConfig.history.dateOfBirth
              ? isoToDate(patientConfig.history.dateOfBirth)
              : null,
            bloodType: patientConfig.history.bloodType,
            allergiesAndHistory: patientConfig.history.allergiesAndHistory,
          },
        });
        for (const entry of patientConfig.history.entries) {
          await prisma.diagnosisEntry.create({
            data: {
              patientId: patient.id,
              diagnosis: entry.diagnosis,
              treatment: entry.treatment,
              createdAt: entry.createdAt,
            },
          });
        }
      }
    }
  }
}
