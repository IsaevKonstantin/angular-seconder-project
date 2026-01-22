import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TokenService {
    public save(token: string): void {
        sessionStorage.setItem('token', token);
    }

    public get(): string | null {
        return sessionStorage.getItem('token');
    }

    public clear(): void {
        sessionStorage.removeItem('token');
    }
}