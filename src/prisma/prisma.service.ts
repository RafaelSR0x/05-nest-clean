import "dotenv/config";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    super({ adapter });
  }
  onModuleInit() {
    return this.$connect;
  }
  onModuleDestroy() {
    return this.$disconnect;
  }
}
