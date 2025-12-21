import { Routes } from '@angular/router';

const ROUTE_CONFIG = {
    LOGIN: 'login',
    REGISTER: 'register',
    MAIN: "main",
    HOME: "home",
    SETTINGS: "settings",
    CHATS: "chats",
    CONTACTS: "contacts",
    NOT_FOUND: "not-found",
    NO_PATH: '**',
} as const;

export const routes: Routes = [
    {
        path: '',
        redirectTo: ROUTE_CONFIG.LOGIN,
        pathMatch: 'full'
    },
    {
        path: ROUTE_CONFIG.LOGIN,
        loadComponent: () => import("./features/auth/ui/login/login").then((c) => c.Login)
    },
    { 
        path: ROUTE_CONFIG.REGISTER, 
        loadComponent: () => import('./features/auth/ui/register/register').then((c) => c.Register)
    },
    {
        path: ROUTE_CONFIG.NOT_FOUND, 
        loadComponent: () => import('./features/not-found/ui/not-found/not-found').then((c) => c.NotFound)
    },
    {
        path: ROUTE_CONFIG.MAIN,
        loadComponent: () => import('./features/chat/ui/main/main').then((c) => c.Main),
        children: [
            {
                path: ROUTE_CONFIG.HOME, 
                loadComponent: () => import('./features/chat/ui/home/home').then((c) => c.Home)
            },
            {
                path: ROUTE_CONFIG.SETTINGS, 
                loadComponent: () => import('./features/chat/ui/settings/settings').then((c) => c.Settings)
            },
            {
                path: ROUTE_CONFIG.CHATS, 
                loadComponent: () => import('./features/chat/ui/chats/chats').then((c) => c.Chats)
            },
            { 
                path: ROUTE_CONFIG.CONTACTS, 
                loadComponent: () => import('./features/chat/ui/contacts/contacts').then((c) => c.Contacts)
            },
            {
                path: ROUTE_CONFIG.NO_PATH,
                redirectTo: ROUTE_CONFIG.HOME,
            }
        ],
    },
    {
        path: ROUTE_CONFIG.NO_PATH,
        redirectTo: ROUTE_CONFIG.NOT_FOUND,
    }
];
