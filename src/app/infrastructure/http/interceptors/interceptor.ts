import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const requestWithHeaders = req.clone({
        headers: req.headers.append("Header", "SeconderApp"),
    });
    return next(requestWithHeaders);
};