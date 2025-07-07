import { Module } from '@nestjs/common';
import { FichasController } from './fichas.controller';
import { FichasService } from './fichas.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FichasController],
  providers: [FichasService, PrismaService]
})
export class FichasModule {}
