import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OriginService {
  private readonly origin: string;
  private readonly frontendUrl: string;
  constructor() {
    this.origin = window.location.origin;
    this.frontendUrl = `${this.origin}/`;
  }

  public getOrigin(): string {
    return this.origin;
  }

  public getFrontendUrl(): string {
    return this.frontendUrl;
  }
}
