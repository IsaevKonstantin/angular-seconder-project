// --- Полифил для Sock.js / Node.js библиотек ---
(window as any).global = window;

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './app/core/interceptors/interceptor';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(
      withInterceptors([authInterceptor, httpInterceptor]),
    ),
    provideRouter(routes, withViewTransitions()),
  ]}
).catch((err) => console.error(err));
