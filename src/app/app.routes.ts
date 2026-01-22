import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { mainRoutes } from './features/main/main.routes';
import { notFoundRoutes } from './features/not-found/not-found.routes';

const ROUTE_CONFIG = {
    MAIN: "main",
    NOT_FOUND: "not-found",
    NO_PATH: '**',
} as const;

export const routes: Routes = [
    {
        path: '',
        redirectTo: ROUTE_CONFIG.MAIN,
        pathMatch: 'full'
    },
    ...authRoutes,
    ...mainRoutes,
    ...notFoundRoutes,
    {
        path: ROUTE_CONFIG.NO_PATH,
        redirectTo: ROUTE_CONFIG.NOT_FOUND,
    }
];
