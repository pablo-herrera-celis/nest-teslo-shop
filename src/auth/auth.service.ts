import { Inject, Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/auth.entity';

import { AdapterBcrypt } from './adapters/adapter-bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptAdapter: AdapterBcrypt,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...dataUser } = createUserDto;
      const user = this.userRepository.create({
        ...dataUser,
        password: await this.bcryptAdapter.hashSync(password),
      });

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw error;
  }
}
