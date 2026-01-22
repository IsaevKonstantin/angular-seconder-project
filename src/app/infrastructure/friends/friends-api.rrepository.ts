import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { IFriendshipRequest } from "./model/friendship-request.model";
import { IContact } from "../../domain/friendship.model";

@Injectable({ providedIn: 'root' })
export class FriendsApiRepository {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/friends';

    public getContacts(): Observable<IContact[]> {
        return this.http.get<IContact[]>(`${this.baseUrl}/my`).pipe(
            map((users) => {
                users.map((user) => {
                    if (user.avatarBase64) {
                        user.avatarBase64 = "data:image/jpeg;base64," + user.avatarBase64;
                    }
                })
                return users;
            }),
        );
    }

    public  getContactById(id: number): Observable<IContact> {
        return this.http.get<IContact>(`${this.baseUrl}/${id}`).pipe(
            map((user) => {
                if (user.avatarBase64) {
                    user.avatarBase64 = "data:image/jpeg;base64," + user.avatarBase64;
                }
                return user;
            }),
        );
    }

    public getSearchContacts(query: string): Observable<IContact[]> {
        return this.http.get<IContact[]>(`${this.baseUrl}/search`, {params: {query}}).pipe(
            map((users) => {
                users.map((user) => {
                    if (user.avatarBase64) {
                        user.avatarBase64 = "data:image/jpeg;base64," + user.avatarBase64;
                    }
                })
                return users;
            }),
        );
    }

    public postAdd(req: IFriendshipRequest): Observable<IContact> {
        return this.http.post<IContact>(`${this.baseUrl}/add`, req).pipe(
            map((user) => {
                if (user.avatarBase64) {
                    user.avatarBase64 = "data:image/jpeg;base64," + user.avatarBase64;
                }
                return user;
            }),
        );
    }

    public postApprove(req: IFriendshipRequest): Observable<IContact> {
        return this.http.post<IContact>(`${this.baseUrl}/approve`, req).pipe(
            map((user) => {
                if (user.avatarBase64) {
                    user.avatarBase64 = "data:image/jpeg;base64," + user.avatarBase64;
                }
                return user;
            }),
        );
    }

    public postCancel(req: IFriendshipRequest): Observable<IContact> {
        return this.http.post<IContact>(`${this.baseUrl}/cancelRequest`, req).pipe(
            map((user) => {
                if (user.avatarBase64) {
                    user.avatarBase64 = "data:image/jpeg;base64," + user.avatarBase64;
                }
                return user;
            }),
        );
    }

    public postDelete(req: IFriendshipRequest): Observable<IContact> {
        return this.http.post<IContact>(`${this.baseUrl}/delete`, req).pipe(
            map((user) => {
                if (user.avatarBase64) {
                    user.avatarBase64 = "data:image/jpeg;base64," + user.avatarBase64;
                }
                return user;
            }),
        );
    }

    public postBlock(req: IFriendshipRequest): Observable<IContact> {
        return this.http.post<IContact>(`${this.baseUrl}/block`, req).pipe(
            map((user) => {
                if (user.avatarBase64) {
                    user.avatarBase64 = "data:image/jpeg;base64," + user.avatarBase64;
                }
                return user;
            }),
        );
    }
}