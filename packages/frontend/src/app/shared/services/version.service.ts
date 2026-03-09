import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";

interface VersionInfo {
  version: string;
}

@Injectable({
  providedIn: "root",
})
export class VersionService {
  private readonly versionSubject = new BehaviorSubject<string | null>(null);
  public version$: Observable<string | null> =
    this.versionSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  /**
   * Load version from version.json file
   * This should be called once at application startup
   */
  public loadVersion(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>("/assets/version.json").pipe(
      tap((versionInfo) => {
        this.versionSubject.next(versionInfo.version);
      }),
      catchError((error) => {
        console.error("Failed to load version.json:", error);
        this.versionSubject.next("unknown");
        throw error;
      })
    );
  }

  /**
   * Get the current version (synchronous)
   */
  public getVersion(): string | null {
    return this.versionSubject.value;
  }
}
