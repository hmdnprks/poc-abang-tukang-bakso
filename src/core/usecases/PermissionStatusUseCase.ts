export class PermissionStatusUseCase {
  execute(permissionDenied: boolean, gpsError: boolean, role: string): string {
    if (this.isPermissionDenied(permissionDenied)) {
      return 'permissionDenied';
    } else if (this.isGpsError(gpsError)) {
      return 'gpsError';
    } else {
      return this.getRoleStatus(role);
    }
  }

  private isPermissionDenied(permissionDenied: boolean): boolean {
    return permissionDenied;
  }

  private isGpsError(gpsError: boolean): boolean {
    return gpsError;
  }

  private getRoleStatus(role: string): string {
    return role === 'customer' ? 'customer' : 'vendor';
  }
}
