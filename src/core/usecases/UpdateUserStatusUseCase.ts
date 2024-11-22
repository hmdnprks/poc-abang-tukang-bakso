import { UserRepository } from '@core/repositories/UserRepository';

export class UpdateUserStatusUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(userId: string, role: string): Promise<{ message: string }> {
    try {
      await this.userRepository.updateUserStatus(userId, 'inactive');

      let message = 'Kamu telah keluar dari pantauan Tukang Bakso';
      if (role === 'vendor') {
        message = 'Kamu telah menonaktifkan status Tukang Bakso';
      }

      return { message };
    } catch (error) {
      throw new Error('Failed to update user status');
    }
  }
}
