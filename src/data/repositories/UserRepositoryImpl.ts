// src/data/repositories/UserRepositoryImpl.ts
import { UserRepository } from '../../core/repositories/UserRepository';
import { User } from '../../core/entities/User';
import { FirebaseUserDatasource } from '../datasources/FirebaseUserDatasource';

export class UserRepositoryImpl implements UserRepository {
  private datasource: FirebaseUserDatasource;

  constructor(datasource: FirebaseUserDatasource) {
    this.datasource = datasource;
  }

  async registerUser(data: Omit<User, 'docId'>): Promise<User> {
    return this.datasource.registerUser(data);
  }
}
