import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { CanActiveService } from "../services/can-active.service";
import { userStore } from "../store/user-store";
import { TokenService } from "../services/token-service";
import { SessionService } from "../services/session.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private canActiveService = inject(CanActiveService);
    private sessionService = inject(SessionService);
    private readonly store = inject(userStore);

    canActivate(): boolean | Observable<boolean> | UrlTree | Observable<UrlTree> | Observable<UrlTree | boolean> {
        const storeUser = this.store.user();
        const token = this.tokenService.get();
        if (storeUser && token) return true;
        if (!token) return this.router.parseUrl('/login');
        return this.canActiveService.getUser().pipe(
            catchError(() => of(null)),
            map((user) => {
                if (!user) {
                    this.tokenService.clear();
                    return this.router.parseUrl('/login');
                }
                this.sessionService.initSession(user);
                return true;
            }),
        )
    }
}