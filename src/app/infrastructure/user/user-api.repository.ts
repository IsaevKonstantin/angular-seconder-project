import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { IUser } from "../../domain/user.model";
import { IUpdateUserDataRequest } from "./model/update-user-data.model";

@Injectable({ providedIn: 'root' })
export class UserApiRepository {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/user';

    public getMe(): Observable<IUser> {
        return this.http.get<IUser>(`${this.baseUrl}/me`).pipe(
            map((response) => {
                if (response.avatarBase64) {
                    response.avatarBase64 = "data:image/jpeg;base64," + response.avatarBase64;
                }
                return response;
            }),
        )
    }

    public updateUserData(body: IUpdateUserDataRequest): Observable<IUser> {
        return this.http.put<IUser>(`${this.baseUrl}/update`, body).pipe(
            map((response) => {
                if (response.avatarBase64) {
                    response.avatarBase64 = "data:image/jpeg;base64," + response.avatarBase64;
                }
                return response;
            }),
        );
    }
}