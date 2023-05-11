import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();
}


export const init = () => {
    main()
    .catch((e) => {
      console.error('Failed to connect to database: ', e);

      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

    return prisma;
}

export {prisma as db}