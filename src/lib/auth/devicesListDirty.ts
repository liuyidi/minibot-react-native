/** Set when a device is revoked so the list can refresh once on return. */
let devicesListDirty = false;

export function markDevicesListDirty(): void {
  devicesListDirty = true;
}

export function consumeDevicesListDirty(): boolean {
  if (!devicesListDirty) {
    return false;
  }
  devicesListDirty = false;
  return true;
}
