import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationinterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const myToken = localStorage.getItem('security');
  const cloneRequest = req.clone({
    setHeaders:{
      Authorization: `Bearer ${myToken}`
    }
  });
  return next(cloneRequest);
};
