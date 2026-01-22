import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = sessionStorage.getItem('token');
    if (req.url.includes("/auth") || !token) {
        return next(req);
    };
    const myReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
    return next(myReq);
};