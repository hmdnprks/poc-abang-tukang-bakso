import { getDatabase, ref, push, set } from 'firebase/database';
import { app } from '../../infrastructure/firebase/firebase';

export class FirebaseUserDatasource {
  private db = getDatabase(app);

  async registerUser(data: any): Promise<any> {
    const userRef = push(ref(this.db, 'users'));
    await set(userRef, data);
    return { ...data, docId: userRef.key };
  }
}
