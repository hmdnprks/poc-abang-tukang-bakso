import { User } from '../entities/User';

export interface UserRepository {
  registerUser(data: Omit<User, 'docId'>): Promise<User>;
}
