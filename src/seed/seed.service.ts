import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from '../products/products.service';
import { User } from '../auth/entities/auth.entity';

import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertNewUsers();

    await this.insertNewProducts(adminUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    await this.userRepository.delete({});
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUser = await this.userRepository.save(seedUsers);

    return dbUser[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
