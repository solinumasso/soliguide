export class GlobalConstants {
  // Storage of values if localStorage absent
  public values: { [key: string]: string } = {};
  public storageName: "localStorage" | "sessionStorage" | "globalVariable";
  public storage: Storage | null;

  constructor() {
    if (typeof localStorage !== "undefined") {
      this.storageName = "localStorage";
      this.storage = localStorage;
    } else if (
      typeof sessionStorage !== "undefined" &&
      sessionStorage !== null
    ) {
      this.storageName = "sessionStorage";
      this.storage = sessionStorage;
    } else {
      this.storageName = "globalVariable";
      this.storage = null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getItem(key: string): any | null {
    if (this.storageName !== "globalVariable" && this.storage !== null) {
      const value = this.storage.getItem(key);

      return value == null ? null : JSON.parse(value); // null or undefined
    }
    return typeof this.values[key] !== "undefined"
      ? JSON.parse(this.values[key])
      : null;
  }

  public clearStorage(): void {
    if (this.storageName === "localStorage" && this.storage !== null) {
      this.storage.clear();
    } else {
      this.values = {};
    }
  }

  public setItem(key: string, value: unknown): void {
    if (this.storageName !== "globalVariable" && this.storage !== null) {
      this.storage.setItem(key, JSON.stringify(value));
    } else {
      this.values[key] = JSON.stringify(value);
    }
  }

  public listItems(): string[] {
    if (this.storageName === "globalVariable") {
      return Object.keys(this.values);
    } else if (this.storage) {
      return Object.keys(this.storage);
    }

    return [];
  }

  public removeItem(key: string): void {
    if (this.storageName !== "globalVariable" && this.storage !== null) {
      this.storage.removeItem(key);
    } else {
      delete this.values[key];
    }
  }
}

export const globalConstants = new GlobalConstants();
