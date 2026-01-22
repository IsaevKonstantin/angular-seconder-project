import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ILoginRequest } from "./model/login-request.model";
import { IRegisterRequest } from "./model/register-request.model";
import { ITokenResponse } from "./model/auth-response.model";

@Injectable({ providedIn: 'root' })
export class AuthApiRepository {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/auth';

    public login(req: ILoginRequest): Observable<ITokenResponse> {
        return this.http.post<ITokenResponse>(`${this.baseUrl}/login`, req);
    }

    public register(req: IRegisterRequest): Observable<ITokenResponse> {
        return this.http.post<ITokenResponse>(`${this.baseUrl}/register`, req);
    }
}