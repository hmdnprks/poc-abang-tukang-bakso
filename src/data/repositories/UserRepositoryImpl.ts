import { UserRepository } from '../../core/repositories/UserRepository';
import { User } from '../../core/entities/User';
import { FirebaseUserDatasource } from '../datasources/FirebaseUserDatasource';

export class UserRepositoryImpl implements UserRepository {
  private readonly datasource: FirebaseUserDatasource;

  constructor(datasource: FirebaseUserDatasource) {
    this.datasource = datasource;
  }

  async registerUser(data: Omit<User, 'docId'>): Promise<User> {
    return this.datasource.registerUser(data);
  }

  async updateUserLocation(userId: string, latitude: number, longitude: number): Promise<void> {
    return this.datasource.updateUserLocation(userId, latitude, longitude);
  }

  async updateUserStatus(userId: string, status: string): Promise<void> {
    return this.datasource.updateUserStatus(userId, status);
  }
}
