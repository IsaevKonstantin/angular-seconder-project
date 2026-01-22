import { Routes } from "@angular/router";

const NOT_FOUND_ROUTE_CONFIG = {
    NOT_FOUND: "not-found",
} as const;

export const notFoundRoutes: Routes = [
    {
        path: NOT_FOUND_ROUTE_CONFIG.NOT_FOUND,
        loadComponent: () => import("./pages/not-found/not-found").then((c) => c.NotFound)
    },
];
