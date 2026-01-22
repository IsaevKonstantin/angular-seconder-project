import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from "../../domain/user.model";
import { UserApiRepository } from "../../infrastructure/user/user-api.repository";

@Injectable({ providedIn: 'root' })
export class CanActiveService {
    private api = inject(UserApiRepository);

    public getUser(): Observable<IUser> {
        return this.api.getMe();
    }

}