import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/auth.entity';
import { AdapterBcrypt } from './adapters/adapter-bcrypt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AdapterBcrypt],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class AuthModule {}
