import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { hash } from "bcrypt";
import { z } from "zod";
import { PrismaService } from "src/prisma/prisma.service";

const createAccountBodyScheme = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodyScheme = z.infer<typeof createAccountBodyScheme>

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBodyScheme) {
    const { name, email, password } = createAccountBodyScheme.parse(body);

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException("Esse email de usuário já existe");
    }

    const hashedPassword = await hash(password, 12);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
