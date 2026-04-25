import { PrismaClient, RoleType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Start Seeding ---");

  const users = [
    {
      name: "Admin Global",
      email: "admin@example.com",
      picture: "https://ui-avatars.com/api/?name=Admin+Global",
      role: RoleType.admin,
    },
    {
      name: "User Testing",
      email: "user@example.com",
      picture: "https://ui-avatars.com/api/?name=User+Testing",
      role: RoleType.admin,
    },
  ];

  for (const u of users) {
    const existingUser = await prisma.user.findFirst({
      where: { email: u.email },
    });

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: u.name,
            picture: u.picture,
            role: u.role,
          },
        })
      : await prisma.user.create({
          data: u,
        });

    console.log(`Created user with id: ${user.id}`);
  }

  console.log("--- Seeding Finished ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
