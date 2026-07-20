import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const DEV_PASSWORD = "alivia123";

async function main() {
  const passwordHash = bcrypt.hashSync(DEV_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: "admin@alivia.bo" },
    update: { passwordHash },
    create: {
      email: "admin@alivia.bo",
      passwordHash,
      role: "ADMIN",
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@alivia.bo" },
    update: { passwordHash },
    create: {
      email: "doctor@alivia.bo",
      passwordHash,
      role: "DOCTOR",
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      name: "Dra. Valeria Rojas",
      phone: "+59171234567",
      specialty: "Pediatría",
      practiceName: "Consultorio Zabala",
      yearsExperience: 12,
      university: "Universidad Mayor de San Andrés",
      bio: "Pediatra con más de una década de experiencia en atención integral de niños y adolescentes.",
      onboardedAt: new Date(),
      subscription: { create: { status: "ACTIVE" } },
      locations: {
        create: {
          name: "Consultorio Zabala",
          address: "Av. 6 de Agosto 2170, Sopocachi, La Paz",
          scheduleBlocks: {
            create: [
              {
                // Mon-Fri mornings, 1h slots of up to 3 patients
                weekdays: [1, 2, 3, 4, 5],
                startMinutes: 9 * 60,
                endMinutes: 12 * 60,
                slotDurationMinutes: 60,
                slotCapacity: 3,
              },
              {
                // Mon-Fri afternoons
                weekdays: [1, 2, 3, 4, 5],
                startMinutes: 14 * 60,
                endMinutes: 18 * 60,
                slotDurationMinutes: 60,
                slotCapacity: 3,
              },
            ],
          },
        },
      },
    },
  });

  const assistantUser = await prisma.user.upsert({
    where: { email: "asistente@alivia.bo" },
    update: { passwordHash },
    create: {
      email: "asistente@alivia.bo",
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
      name: "María Fernanda Quispe",
      phone: "+59176543210",
    },
  });

  const newDoctorUser = await prisma.user.upsert({
    where: { email: "doctor.nuevo@alivia.bo" },
    update: { passwordHash },
    create: {
      email: "doctor.nuevo@alivia.bo",
      passwordHash,
      role: "DOCTOR",
    },
  });

  // bare concierge-created account: name only, not yet onboarded (ADR-0005)
  await prisma.doctor.upsert({
    where: { userId: newDoctorUser.id },
    update: {},
    create: {
      userId: newDoctorUser.id,
      name: "Dr. Marco Antonio Salazar",
      phone: "+59169876543",
      specialty: "Medicina General",
    },
  });

  console.log(`Seeded dev accounts (password: ${DEV_PASSWORD}):`);
  console.log("  admin@alivia.bo         ADMIN");
  console.log("  doctor@alivia.bo        DOCTOR (onboarded)");
  console.log("  doctor.nuevo@alivia.bo  DOCTOR (first login)");
  console.log("  asistente@alivia.bo     ASSISTANT");
}

main().finally(() => prisma.$disconnect());
