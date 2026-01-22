import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { TokenService } from "../services/token-service";

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    private router = inject(Router);
    private tokenService = inject(TokenService);

    canActivate(): boolean | Observable<boolean> | UrlTree {
        if (!this.tokenService.get()) return true;
        return this.router.parseUrl('/main');
    }
}