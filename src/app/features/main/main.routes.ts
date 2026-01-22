import { Routes } from "@angular/router";
import { AuthGuard } from "../../core/guards/auth.guard";

const MAIN_ROUTE_CONFIG = {
    MAIN: "main",
    HOME: "home",
    SETTINGS: "settings",
    CHATS: "chats",
    CHATS_ID: ":id",
    NO_PATH: '**',
} as const;

export const mainRoutes: Routes = [
    {
        path: MAIN_ROUTE_CONFIG.MAIN,
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/main/main').then((c) => c.Main),
        children: [
            {
                path: MAIN_ROUTE_CONFIG.HOME, 
                loadComponent: () => import('../home/pages/home/home').then((c) => c.Home)
            },
            {
                path: MAIN_ROUTE_CONFIG.SETTINGS, 
                loadComponent: () => import('../settings/pages/settings/settings').then((c) => c.Settings)
            },
            {
                path: MAIN_ROUTE_CONFIG.CHATS, 
                loadComponent: () => import('../chats/pages/chats-list/chats-list').then((c) => c.ChatsList),
                children: [
                    {
                        path: MAIN_ROUTE_CONFIG.CHATS_ID,
                        loadComponent: () => import('../chats/pages/chat/chat').then((c) => c.Chat),
                    }
                ],
            },
            {
                path: MAIN_ROUTE_CONFIG.NO_PATH,
                redirectTo: MAIN_ROUTE_CONFIG.HOME,
            }
        ],
    },
];
