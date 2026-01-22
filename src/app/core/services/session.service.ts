import { inject, Injectable } from "@angular/core";
import { userStore } from "../store/user-store";
import { IUser } from "../../domain/user.model";
import { FriendsApiRepository } from "../../infrastructure/friends/friends-api.rrepository";

@Injectable({ providedIn: 'root' })
export class SessionService {
    private store = inject(userStore);
    private friendsApiRepository = inject(FriendsApiRepository);

    public initSession(user: IUser): void {
        this.store.setUser(user);
        this.store.setContactsLoading(true);
        this.friendsApiRepository.getContacts().subscribe(contacts => {
            this.store.setContactsLoading(false);
            this.store.setContacts(contacts);
        });
    }

    public logout(): void {
        this.store.removeUser();
    }
}