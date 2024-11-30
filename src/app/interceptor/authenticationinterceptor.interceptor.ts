import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationinterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  debugger
  const myToken = localStorage.getItem('authToken');

  // Only add Authorization header if the token exists
  if (myToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${myToken}`
      }
    });
    return next(clonedRequest);
  }

  // If token doesn't exist, just pass the original request
  return next(req);
};
