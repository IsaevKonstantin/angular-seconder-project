import { computed, inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { userStore } from "../../../core/store/user-store";
import { IUser } from "../../../domain/user.model";
import { Observable, tap } from "rxjs";
import { UserApiRepository } from "../../../infrastructure/user/user-api.repository";
import { IUpdateUserDataRequest } from "../../../infrastructure/user/model/update-user-data.model";
import { TranslateService } from "@ngx-translate/core";
import { TokenService } from "../../../core/services/token-service";
import { SessionService } from "../../../core/services/session.service";

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
    private userApiRepo = inject(UserApiRepository);
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private sessionService = inject(SessionService);
    private readonly store = inject(userStore);
    private translate = inject(TranslateService);

    public readonly user = computed(() => this.store.user()!)

    public updateUserData(req: IUpdateUserDataRequest): Observable<IUser> {
        return this.userApiRepo.updateUserData(req).pipe(
            tap(user => {
                this.sessionService.initSession(user);
            }),
        )
    }

    public logOut(): void {
        this.sessionService.logout();
        this.tokenService.clear();
        this.router.navigate([`/login`]);
    }

    public changeLanguage(lang: 'ru' | 'en'): void {
        this.translate.use(lang);
    }
}