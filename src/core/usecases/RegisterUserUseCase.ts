import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class RegisterUserUseCase {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute(data: Omit<User, 'docId'>): Promise<User> {
    return this.repository.registerUser(data);
  }
}
