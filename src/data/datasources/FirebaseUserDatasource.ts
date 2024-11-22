import { getDatabase, ref, push, set, update } from 'firebase/database';
import { app, realtimeDb } from '@infrastructure/firebase/firebase';

export class FirebaseUserDatasource {
  private readonly db = getDatabase(app);

  async registerUser(data: any): Promise<any> {
    const userRef = push(ref(this.db, 'users'));
    await set(userRef, data);
    return { ...data, docId: userRef.key };
  }

  async updateUserLocation(userId: string, latitude: number, longitude: number): Promise<void> {
    const userRef = ref(realtimeDb, `users/${userId}`);
    await update(userRef, {
      location: { latitude, longitude },
      status: 'active',
    });
  }

  async updateUserStatus(userId: string, status: string): Promise<void> {
    const userRef = ref(realtimeDb, `users/${userId}`);
    await update(userRef, { status });
  }
}
