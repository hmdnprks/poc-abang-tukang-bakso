export class PermissionStatusUseCase {
  execute(permissionDenied: boolean, gpsError: boolean, role: string): string {
    if (this.isPermissionDenied(permissionDenied)) {
      return 'permissionDenied';
    }
    if (this.isGpsError(gpsError)) {
      return 'gpsError';
    }
    return this.getRoleStatus(role);
  }

  private isPermissionDenied(permissionDenied: boolean): boolean {
    return permissionDenied;
  }

  private isGpsError(gpsError: boolean): boolean {
    return gpsError;
  }

  private isCustomer(role: string): boolean {
    return role === 'customer';
  }

  private isVendor(role: string): boolean {
    return role === 'vendor';
  }

  private getRoleStatus(role: string): string {
    if (this.isCustomer(role)) {
      return 'customer';
    }
    if (this.isVendor(role)) {
      return 'vendor';
    }
    return 'unknown';
  }
}
