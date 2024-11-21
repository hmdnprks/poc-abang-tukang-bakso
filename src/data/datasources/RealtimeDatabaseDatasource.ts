import { ref, onValue, update, push } from 'firebase/database';
import { realtimeDb } from '@infrastructure/firebase/firebase';
import { Marker } from '@core/entities/Marker';
import { User } from '@core/entities/User';

export class RealtimeDatabaseDatasource {
  fetchMarkers(userRole: string): Promise<{
    userMarkers: Marker[];
    vendorMarkers: Marker[];
  }> {
    return new Promise((resolve) => {
      const usersRef = ref(realtimeDb, 'users');
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const userMarkers: Marker[] = [];
        const vendorMarkers: Marker[] = [];

        for (const id in data) {
          const userData = data[id];
          const { location, status, name, role } = userData;

          if (location && status === 'active') {
            const marker: Marker = {
              id,
              position: [location.latitude, location.longitude],
              popupText: name,
            };

            if (role === userRole) {
              vendorMarkers.push(marker);
            } else {
              userMarkers.push(marker);
            }
          }
        }

        resolve({ userMarkers, vendorMarkers });
      });
    });
  }


  async registerUser(data: Omit<User, 'docId'>): Promise<User> {
    const usersRef = ref(realtimeDb, 'users');
    const newUserRef = push(usersRef);
    await update(newUserRef, data);
    return { ...data, docId: newUserRef.key ?? '' };
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
