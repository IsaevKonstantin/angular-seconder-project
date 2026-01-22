import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ILoginRequest } from "../../../infrastructure/auth/model/login-request.model";
import { IRegisterRequest } from "../../../infrastructure/auth/model/register-request.model";
import { AuthApiRepository } from "../../../infrastructure/auth/auth-api.repository";
import { TokenService } from "../../../core/services/token-service";

@Injectable({ providedIn: 'root' })
export class AuthFacade {
    private authApiRepo = inject(AuthApiRepository);
    private tokenService = inject(TokenService);
    private router = inject(Router);

    public login(req: ILoginRequest): Observable<boolean> {
        return this.authApiRepo.login(req).pipe(
            map(token => {
                this.tokenService.save(token.token);
                this.navigate('main');
                return true;
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    public register(req: IRegisterRequest): Observable<boolean> {
        return this.authApiRepo.register(req).pipe(
            map(token => {
                this.tokenService.save(token.token);
                this.navigate('main/settings');
                return true;
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    public navigate(url: string): void {
        this.router.navigate([`/${url}`]);
    }
}