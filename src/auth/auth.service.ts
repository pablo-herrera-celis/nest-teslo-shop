import { Injectable } from '@nestjs/common';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/auth.entity';
import { AdapterBcrypt } from './adapters/adapter-bcryptjs';
import { CreateUserDto, LoginUserDto } from './dto';

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
      delete user.password;

      return user;

      //TODO Retornar el JWT de acceso.
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials (email)');

    const isPasswordMatch = await this.bcryptAdapter.compareSync(
      password,
      user.password,
    );

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials (password)');

    return user;

    //TODO Retornar el JWT de acceso.
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw error;
  }
}
