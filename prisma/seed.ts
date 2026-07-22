import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedDoctors } from "./seed/doctors";
import { DOCTORS } from "./seed/doctorsData";

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

  await seedDoctors(prisma, passwordHash);

  console.log(`Seeded dev accounts (password: ${DEV_PASSWORD}):`);
  console.log("  admin@alivia.bo   ADMIN");
  for (const doctor of DOCTORS) {
    const onboarded = doctor.onboardedAt ? "onboarded" : "first login";
    console.log(
      `  ${doctor.email.padEnd(32)} DOCTOR (${doctor.specialty}, ${onboarded})`,
    );
    if (doctor.assistant) {
      console.log(`  ${doctor.assistant.email.padEnd(32)} ASSISTANT`);
    }
  }
}

main().finally(() => prisma.$disconnect());
