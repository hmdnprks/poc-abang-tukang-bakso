import { User } from '../entities/User';

export interface UserRepository {
  registerUser(data: Omit<User, 'docId'>): Promise<User>;
  updateUserLocation(userId: string, latitude: number, longitude: number): Promise<void>;
  updateUserStatus(userId: string, status: string): Promise<void>;
}
