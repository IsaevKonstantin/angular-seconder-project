import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { IPageData } from "../models/page-data.model";
import { TokenService } from "../../../core/services/token-service";
import { SessionService } from "../../../core/services/session.service";
import { WsService } from "../../../core/services/ws.service";

@Injectable({ providedIn: 'root' })
export class MainFacade {
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private sessionService = inject(SessionService);
    private wsService = inject(WsService);

    get MenuItems(): IPageData[] {
        return [
            { routerLink:"home", label: "MENU.HEADER.HOME", icon: "/assets/icons/home-icon.svg" },
            { routerLink:"chats", label: "MENU.HEADER.CHATS", icon: "/assets/icons/chats-icon.svg" },
        ]
    }

    get AllPages(): IPageData[] {
        return [
            { routerLink:"chats", label: "MENU.HEADER.CHATS" },
            { routerLink:"home", label: "MENU.HEADER.HOME" },
            { routerLink:"settings", label: "MENU.HEADER.SETTINGS" },
        ]
    }

    public connect(): void {
        this.wsService.init();
    }

    public disconnect(): void {
        this.wsService.destroy();
    }

    public logOut(): void {
        this.sessionService.logout();
        this.tokenService.clear();
        this.router.navigate([`/login`]);
    }
}