export class PermissionStatusUseCase {
  execute(permissionDenied: boolean, gpsError: boolean, role: string): string {
    if (permissionDenied) {
      return 'permissionDenied';
    } else if (gpsError) {
      return 'gpsError';
    } else {
      return role === 'customer' ? 'customer' : 'vendor';
    }
  }
}
