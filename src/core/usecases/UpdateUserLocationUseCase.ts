// src/core/usecases/UpdateUserLocationUseCase.ts
import { UserRepository } from '@core/repositories/UserRepository';

export class UpdateUserLocationUseCase {
  constructor(private userRepository: UserRepository) { }

  execute(userId: string, latitude: number, longitude: number): Promise<void> {
    return this.userRepository.updateUserLocation(userId, latitude, longitude);
  }
}
