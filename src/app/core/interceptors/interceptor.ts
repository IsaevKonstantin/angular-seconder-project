import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const requestWithHeaders = req.clone({
        setHeaders: {
            Header: `SeconderApp`
        }
    });
    return next(requestWithHeaders);
};