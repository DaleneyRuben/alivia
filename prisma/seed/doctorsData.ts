import type { DoctorConfig } from "./types";
import { monthsAgo, toMinutes } from "./helpers";

const MON_FRI = [1, 2, 3, 4, 5];

export const DOCTORS: DoctorConfig[] = [
  {
    email: "doctor@alivia.bo",
    name: "Dra. Valeria Rojas",
    phone: "+59171234567",
    specialty: "Pediatría",
    practiceName: "Consultorio Zabala",
    yearsExperience: 12,
    university: "Universidad Mayor de San Andrés",
    bio: "Pediatra con más de una década de experiencia en atención integral de niños y adolescentes.",
    onboardedAt: new Date(),
    medicalHistoryEnabled: true,
    accountActive: true,
    subscriptionStatus: "ACTIVE",
    assistant: {
      email: "asistente@alivia.bo",
      name: "María Fernanda Quispe",
      phone: "+59176543210",
    },
    locations: [
      {
        name: "Consultorio Zabala",
        address: "Av. 6 de Agosto 2170, Sopocachi, La Paz",
        scheduleBlocks: [
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(9),
            endMinutes: toMinutes(12),
            slotDurationMinutes: 60,
            slotCapacity: 3,
          },
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(14),
            endMinutes: toMinutes(18),
            slotDurationMinutes: 60,
            slotCapacity: 3,
          },
        ],
      },
    ],
    vacations: [{ locationName: null, startDayOffset: 20, endDayOffset: 27 }],
    patients: [
      {
        name: "Camila Torrez",
        phone: "+59170011001",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: -30,
            startHour: 9,
            durationMinutes: 60,
            status: "ATTENDED",
            source: "PATIENT",
          },
          {
            locationName: "Consultorio Zabala",
            dayOffset: 1,
            startHour: 10,
            durationMinutes: 60,
            status: "SCHEDULED",
            confirmation: "CONFIRMED",
            source: "PATIENT",
          },
        ],
        history: {
          dateOfBirth: "2015-04-12",
          bloodType: "O+",
          allergiesAndHistory: "Ninguna conocida",
          entries: [
            {
              diagnosis: "Control de niño sano",
              treatment: "Vacunas al día, continuar controles trimestrales",
              createdAt: monthsAgo(2),
            },
            {
              diagnosis: "Faringitis viral",
              treatment: "Paracetamol según peso, abundantes líquidos",
              createdAt: monthsAgo(1),
            },
            {
              diagnosis: "Control de niño sano",
              treatment: "Desarrollo acorde a edad, sin observaciones",
              createdAt: monthsAgo(0),
            },
          ],
        },
      },
      {
        name: "Diego Fernández",
        phone: "+59170011002",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: -15,
            startHour: 11,
            durationMinutes: 60,
            status: "ATTENDED",
            source: "PATIENT",
          },
          {
            locationName: "Consultorio Zabala",
            dayOffset: 0,
            startHour: 14,
            durationMinutes: 60,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
        history: {
          bloodType: "A-",
          allergiesAndHistory: "Alergia a la penicilina",
          entries: [
            {
              diagnosis: "Otitis media aguda",
              treatment: "Amoxicilina 7 días, control en una semana",
              createdAt: monthsAgo(1),
            },
          ],
        },
      },
      {
        name: "Isabel Mamani",
        phone: "+59170011003",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: -60,
            startHour: 9,
            durationMinutes: 60,
            status: "ATTENDED",
            source: "PATIENT",
          },
        ],
        history: {
          bloodType: "B+",
          entries: [
            {
              diagnosis: "Dermatitis atópica",
              treatment: "Crema hidratante y corticoide tópico leve",
              createdAt: monthsAgo(3),
            },
            {
              diagnosis: "Control de seguimiento dermatitis",
              treatment: "Mejoría notable, continuar hidratación",
              createdAt: monthsAgo(1),
            },
          ],
        },
      },
      {
        // "Nueva" — only a Scheduled appointment, no Attended visit yet
        name: "Andrea Villca",
        phone: "+59170011004",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: 0,
            startHour: 9,
            durationMinutes: 60,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        // "Nueva" — Scheduled for tomorrow, tests Confirmaciones pending state
        name: "Rodrigo Salinas",
        phone: "+59170011005",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: 1,
            startHour: 9,
            durationMinutes: 60,
            status: "SCHEDULED",
            confirmation: "PENDING",
            source: "PATIENT",
          },
        ],
      },
      {
        // fills the 9:00 slot to capacity (3) alongside Andrea Villca above
        name: "Sandra Choque",
        phone: "+59170011006",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: 0,
            startHour: 9,
            durationMinutes: 60,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Pablo Yujra",
        phone: "+59170011007",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: 0,
            startHour: 9,
            durationMinutes: 60,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        // walk-in past capacity (3 already booked at 9:00 above) — staff override
        name: "Marcos Quiroga",
        phone: "+59170011008",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: 0,
            startHour: 9,
            durationMinutes: 60,
            status: "SCHEDULED",
            source: "STAFF",
          },
        ],
      },
      {
        // proves cancelling reopens the slot
        name: "Elena Ríos",
        phone: "+59170011009",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: 0,
            startHour: 15,
            durationMinutes: 60,
            status: "CANCELLED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Jorge Apaza",
        phone: "+59170011010",
        appointments: [
          {
            locationName: "Consultorio Zabala",
            dayOffset: -2,
            startHour: 15,
            durationMinutes: 60,
            status: "NO_SHOW",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
  {
    // bare concierge-created account: name only, not yet onboarded (ADR-0005)
    email: "doctor.nuevo@alivia.bo",
    name: "Dr. Marco Antonio Salazar",
    phone: "+59169876543",
    specialty: "Medicina General",
    onboardedAt: null,
    medicalHistoryEnabled: false,
    accountActive: true,
    subscriptionStatus: "ACTIVE",
    locations: [],
    patients: [],
  },
  {
    email: "doctor.dermatologia@alivia.bo",
    name: "Dr. Andrés Choque",
    phone: "+59172223344",
    specialty: "Dermatología",
    practiceName: "Piel Sana - San Miguel",
    yearsExperience: 8,
    university: "Universidad Católica Boliviana",
    onboardedAt: monthsAgo(5),
    medicalHistoryEnabled: false,
    accountActive: true,
    subscriptionStatus: "ACTIVE",
    locations: [
      {
        name: "Piel Sana - San Miguel",
        address: "Calle 21, San Miguel, La Paz",
        scheduleBlocks: [
          {
            weekdays: [1, 3, 5],
            startMinutes: toMinutes(9),
            endMinutes: toMinutes(13),
            slotDurationMinutes: 30,
            slotCapacity: 2,
          },
        ],
      },
    ],
    patients: [
      {
        name: "Yolanda Mamani",
        phone: "+59170022001",
        appointments: [
          {
            locationName: "Piel Sana - San Miguel",
            dayOffset: 0,
            startHour: 9,
            durationMinutes: 30,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Esteban Rojas",
        phone: "+59170022002",
        appointments: [
          {
            locationName: "Piel Sana - San Miguel",
            dayOffset: 1,
            startHour: 9,
            durationMinutes: 30,
            status: "SCHEDULED",
            confirmation: "CONFIRMED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Beatriz Choque",
        phone: "+59170022003",
        appointments: [
          {
            locationName: "Piel Sana - San Miguel",
            dayOffset: -8,
            startHour: 9,
            durationMinutes: 30,
            status: "ATTENDED",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
  {
    email: "doctor.cardiologia@alivia.bo",
    name: "Dra. Carla Mendoza",
    phone: "+59173334455",
    specialty: "Cardiología",
    practiceName: "Clínica del Corazón",
    yearsExperience: 15,
    university: "Universidad Mayor de San Andrés",
    bio: "Cardióloga especializada en prevención y manejo de enfermedades cardiovasculares.",
    onboardedAt: monthsAgo(4),
    medicalHistoryEnabled: true,
    accountActive: true,
    subscriptionStatus: "ACTIVE",
    assistant: {
      email: "asistente.cardiologia@alivia.bo",
      name: "Rosa Ticona",
      phone: "+59176112233",
    },
    locations: [
      {
        name: "Clínica del Corazón - Miraflores",
        address: "Av. Busch 1250, Miraflores, La Paz",
        scheduleBlocks: [
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(8),
            endMinutes: toMinutes(12),
            slotDurationMinutes: 45,
            slotCapacity: 2,
          },
        ],
      },
      {
        name: "Consultorio San Miguel",
        address: "Calle 15, San Miguel, La Paz",
        scheduleBlocks: [
          {
            weekdays: [2, 4],
            startMinutes: toMinutes(15),
            endMinutes: toMinutes(18),
            slotDurationMinutes: 60,
            slotCapacity: 1,
          },
        ],
      },
    ],
    vacations: [
      {
        locationName: "Consultorio San Miguel",
        startDayOffset: 14,
        endDayOffset: 18,
      },
    ],
    patients: [
      {
        name: "Teresa Choquehuanca",
        phone: "+59170033001",
        appointments: [
          {
            locationName: "Clínica del Corazón - Miraflores",
            dayOffset: -20,
            startHour: 8,
            durationMinutes: 45,
            status: "ATTENDED",
            source: "PATIENT",
          },
        ],
        history: {
          bloodType: "O-",
          allergiesAndHistory: "Hipertensión diagnosticada hace 5 años",
          entries: [
            {
              diagnosis: "Hipertensión arterial controlada",
              treatment: "Losartán 50mg diario, control en 3 meses",
              createdAt: monthsAgo(2),
            },
            {
              diagnosis: "Control cardiológico de rutina",
              treatment: "ECG normal, continuar tratamiento actual",
              createdAt: monthsAgo(0),
            },
          ],
        },
      },
      {
        name: "Ramiro Escobar",
        phone: "+59170033002",
        appointments: [
          {
            locationName: "Consultorio San Miguel",
            dayOffset: -10,
            startHour: 15,
            durationMinutes: 60,
            status: "ATTENDED",
            source: "PATIENT",
          },
        ],
        history: {
          bloodType: "AB+",
          entries: [
            {
              diagnosis: "Arritmia leve",
              treatment: "Holter 24hs solicitado, seguimiento en 2 semanas",
              createdAt: monthsAgo(1),
            },
          ],
        },
      },
      {
        name: "Gabriela Rocha",
        phone: "+59170033003",
        appointments: [
          {
            locationName: "Clínica del Corazón - Miraflores",
            dayOffset: 0,
            startHour: 8,
            durationMinutes: 45,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Oscar Ferrufino",
        phone: "+59170033004",
        appointments: [
          {
            locationName: "Consultorio San Miguel",
            dayOffset: 1,
            startHour: 15,
            durationMinutes: 60,
            status: "SCHEDULED",
            confirmation: "CONFIRMED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Nadia Suarez",
        phone: "+59170033005",
        appointments: [
          {
            locationName: "Clínica del Corazón - Miraflores",
            dayOffset: -7,
            startHour: 9,
            durationMinutes: 45,
            status: "NO_SHOW",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
  {
    email: "doctor.ginecologia@alivia.bo",
    name: "Dr. Fernando Vargas",
    phone: "+59174445566",
    specialty: "Ginecología",
    practiceName: "Consultorio Obrajes",
    yearsExperience: 10,
    onboardedAt: monthsAgo(4),
    medicalHistoryEnabled: false,
    accountActive: true,
    subscriptionStatus: "INACTIVE",
    locations: [
      {
        name: "Consultorio Obrajes",
        address: "Av. Hernando Siles, Obrajes, La Paz",
        scheduleBlocks: [
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(9),
            endMinutes: toMinutes(13),
            slotDurationMinutes: 30,
            slotCapacity: 2,
          },
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(15),
            endMinutes: toMinutes(18),
            slotDurationMinutes: 30,
            slotCapacity: 2,
          },
        ],
      },
    ],
    patients: [
      {
        name: "Norma Quispe",
        phone: "+59170044001",
        appointments: [
          {
            locationName: "Consultorio Obrajes",
            dayOffset: 0,
            startHour: 9,
            durationMinutes: 30,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Claudia Fernández",
        phone: "+59170044002",
        appointments: [
          {
            locationName: "Consultorio Obrajes",
            dayOffset: -5,
            startHour: 15,
            durationMinutes: 30,
            status: "NO_SHOW",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
  {
    email: "doctor.traumatologia@alivia.bo",
    name: "Dra. Patricia Flores",
    phone: "+59175556677",
    specialty: "Traumatología",
    practiceName: "Centro de Rehabilitación Achumani",
    yearsExperience: 9,
    onboardedAt: monthsAgo(3),
    medicalHistoryEnabled: false,
    // deactivated: tests admin Desactivar/Reactivar + blocked panel login
    accountActive: false,
    subscriptionStatus: "ACTIVE",
    assistant: {
      email: "asistente.traumatologia@alivia.bo",
      name: "Katherine Choque",
      phone: "+59176223344",
    },
    locations: [
      {
        name: "Centro de Rehabilitación Achumani",
        address: "Calle 15, Achumani, La Paz",
        scheduleBlocks: [
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(8),
            endMinutes: toMinutes(12),
            slotDurationMinutes: 30,
            slotCapacity: 4,
          },
        ],
      },
    ],
    patients: [
      {
        name: "Hugo Vargas",
        phone: "+59170055001",
        appointments: [
          {
            locationName: "Centro de Rehabilitación Achumani",
            dayOffset: 1,
            startHour: 8,
            durationMinutes: 30,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
  {
    email: "doctor.psicologia@alivia.bo",
    name: "Dr. Ricardo Paz",
    phone: "+59176667788",
    specialty: "Psicología",
    practiceName: "Consultorio Calacoto",
    yearsExperience: 6,
    onboardedAt: monthsAgo(2),
    medicalHistoryEnabled: false,
    accountActive: true,
    subscriptionStatus: "ACTIVE",
    locations: [
      {
        name: "Consultorio Calacoto",
        address: "Av. Montenegro, Calacoto, La Paz",
        scheduleBlocks: [
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(10),
            endMinutes: toMinutes(18),
            slotDurationMinutes: 50,
            slotCapacity: 1,
          },
        ],
      },
    ],
    patients: [
      {
        name: "Sergio Mamani",
        phone: "+59170066001",
        appointments: [
          {
            locationName: "Consultorio Calacoto",
            dayOffset: 0,
            startHour: 10,
            durationMinutes: 50,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Patricia Choque",
        phone: "+59170066002",
        appointments: [
          {
            locationName: "Consultorio Calacoto",
            dayOffset: -3,
            startHour: 11,
            durationMinutes: 50,
            status: "ATTENDED",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
  {
    email: "doctor.odontologia@alivia.bo",
    name: "Dra. Sofía Guzmán",
    phone: "+59177778899",
    specialty: "Odontología",
    practiceName: "Consultorio Dental Guzmán",
    yearsExperience: 11,
    university: "Universidad Católica Boliviana",
    onboardedAt: monthsAgo(1),
    medicalHistoryEnabled: true,
    accountActive: true,
    subscriptionStatus: "ACTIVE",
    assistant: {
      email: "asistente.odontologia@alivia.bo",
      name: "Verónica Alanoca",
      phone: "+59176334455",
    },
    locations: [
      {
        name: "Consultorio Dental Guzmán - Sopocachi",
        address: "Calle Rosendo Gutiérrez, Sopocachi, La Paz",
        scheduleBlocks: [
          {
            weekdays: [1, 2, 3, 4, 5, 6],
            startMinutes: toMinutes(9),
            endMinutes: toMinutes(13),
            slotDurationMinutes: 40,
            slotCapacity: 1,
          },
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(15),
            endMinutes: toMinutes(19),
            slotDurationMinutes: 40,
            slotCapacity: 1,
          },
        ],
      },
    ],
    vacations: [{ locationName: null, startDayOffset: 10, endDayOffset: 17 }],
    patients: [
      {
        name: "Vania Choque",
        phone: "+59170077001",
        appointments: [
          {
            locationName: "Consultorio Dental Guzmán - Sopocachi",
            dayOffset: -40,
            startHour: 9,
            durationMinutes: 40,
            status: "ATTENDED",
            source: "PATIENT",
          },
          {
            locationName: "Consultorio Dental Guzmán - Sopocachi",
            dayOffset: -20,
            startHour: 9,
            durationMinutes: 40,
            status: "ATTENDED",
            source: "PATIENT",
          },
          {
            locationName: "Consultorio Dental Guzmán - Sopocachi",
            dayOffset: -5,
            startHour: 9,
            durationMinutes: 40,
            status: "ATTENDED",
            source: "PATIENT",
          },
        ],
        history: {
          bloodType: "A+",
          entries: [
            {
              diagnosis: "Caries dental pieza 26",
              treatment: "Obturación con resina compuesta",
              createdAt: monthsAgo(1),
            },
            {
              diagnosis: "Limpieza y control periodontal",
              treatment: "Profilaxis dental, buena higiene oral",
              createdAt: monthsAgo(0),
            },
            {
              diagnosis: "Control post-obturación",
              treatment: "Pieza 26 en buen estado, sin dolor",
              createdAt: new Date(),
            },
          ],
        },
      },
      {
        name: "Freddy Laura",
        phone: "+59170077002",
        appointments: [
          {
            locationName: "Consultorio Dental Guzmán - Sopocachi",
            dayOffset: 0,
            startHour: 9,
            durationMinutes: 40,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Gladys Apaza",
        phone: "+59170077003",
        appointments: [
          {
            locationName: "Consultorio Dental Guzmán - Sopocachi",
            dayOffset: 1,
            startHour: 15,
            durationMinutes: 40,
            status: "SCHEDULED",
            confirmation: "CONFIRMED",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
  {
    email: "doctor.nutricion@alivia.bo",
    name: "Dr. Hugo Mamani",
    phone: "+59178889900",
    specialty: "Nutrición",
    practiceName: "Consultorio Nutricional Mamani",
    yearsExperience: 5,
    onboardedAt: monthsAgo(1),
    medicalHistoryEnabled: false,
    accountActive: true,
    subscriptionStatus: "ACTIVE",
    locations: [
      {
        name: "Consultorio Nutricional Mamani",
        address: "Av. Ballivián, Calacoto, La Paz",
        scheduleBlocks: [
          {
            weekdays: [2, 4],
            startMinutes: toMinutes(9),
            endMinutes: toMinutes(13),
            slotDurationMinutes: 30,
            slotCapacity: 2,
          },
        ],
      },
    ],
    patients: [
      {
        name: "Elena Quispe",
        phone: "+59170088001",
        appointments: [
          {
            locationName: "Consultorio Nutricional Mamani",
            dayOffset: 1,
            startHour: 9,
            durationMinutes: 30,
            status: "SCHEDULED",
            confirmation: "CONFIRMED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Ramiro Choque",
        phone: "+59170088002",
        appointments: [
          {
            locationName: "Consultorio Nutricional Mamani",
            dayOffset: 0,
            startHour: 9,
            durationMinutes: 30,
            status: "CANCELLED",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
  {
    email: "doctor.oftalmologia@alivia.bo",
    name: "Dra. Lucía Cárdenas",
    phone: "+59179990011",
    specialty: "Oftalmología",
    practiceName: "Centro Oftalmológico Cárdenas",
    yearsExperience: 14,
    university: "Universidad Mayor de San Andrés",
    onboardedAt: new Date(),
    medicalHistoryEnabled: true,
    accountActive: true,
    subscriptionStatus: "ACTIVE",
    assistant: {
      email: "asistente.oftalmologia@alivia.bo",
      name: "Daniela Colque",
      phone: "+59176445566",
    },
    locations: [
      {
        name: "Centro Oftalmológico Cárdenas - Miraflores",
        address: "Av. Saavedra, Miraflores, La Paz",
        scheduleBlocks: [
          {
            weekdays: MON_FRI,
            startMinutes: toMinutes(8),
            endMinutes: toMinutes(12),
            slotDurationMinutes: 20,
            slotCapacity: 3,
          },
        ],
      },
    ],
    patients: [
      {
        name: "Ivan Quispe",
        phone: "+59170099001",
        appointments: [
          {
            locationName: "Centro Oftalmológico Cárdenas - Miraflores",
            dayOffset: -12,
            startHour: 8,
            durationMinutes: 20,
            status: "ATTENDED",
            source: "PATIENT",
          },
        ],
        history: {
          bloodType: "O+",
          entries: [
            {
              diagnosis: "Miopía leve",
              treatment: "Lentes correctivos -1.50, control anual",
              createdAt: monthsAgo(1),
            },
            {
              diagnosis: "Control anual de agudeza visual",
              treatment: "Sin cambios significativos en la graduación",
              createdAt: new Date(),
            },
          ],
        },
      },
      {
        name: "Carmen Choquehuanca",
        phone: "+59170099002",
        appointments: [
          {
            locationName: "Centro Oftalmológico Cárdenas - Miraflores",
            dayOffset: 0,
            startHour: 8,
            durationMinutes: 20,
            status: "SCHEDULED",
            source: "PATIENT",
          },
        ],
      },
      {
        name: "Marcelo Vargas",
        phone: "+59170099003",
        appointments: [
          {
            locationName: "Centro Oftalmológico Cárdenas - Miraflores",
            dayOffset: 1,
            startHour: 8,
            durationMinutes: 20,
            status: "SCHEDULED",
            confirmation: "PENDING",
            source: "PATIENT",
          },
        ],
      },
    ],
  },
];
