import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AdapterBcrypt } from '../auth/adapters/adapter-bcryptjs';

@Module({
  controllers: [SeedController],
  providers: [SeedService, AdapterBcrypt],
  imports: [ProductsModule, AuthModule],
})
export class SeedModule {}
