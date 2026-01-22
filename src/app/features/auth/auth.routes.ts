import { Routes } from "@angular/router";
import { LoginGuard } from "../../core/guards/login.guard";

const AUTH_ROUTE_CONFIG = {
    LOGIN: 'login',
    REGISTER: 'register',
} as const;

export const authRoutes: Routes = [
    {
        path: AUTH_ROUTE_CONFIG.LOGIN,
        canActivate: [LoginGuard],
        loadComponent: () => import("./pages/login/login").then((c) => c.Login)
    },
    { 
        path: AUTH_ROUTE_CONFIG.REGISTER,
        canActivate: [LoginGuard],
        loadComponent: () => import('./pages/register/register').then((c) => c.Register)
    },
];
