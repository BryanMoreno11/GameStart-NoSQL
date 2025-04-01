import {
  CanActivate,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    const token = localStorage.getItem('loginAdmin');
    if (!token) {
      console.log("No hay token");
      this.router.navigate(['/inicio']);
      return false;
    }
    return true;
  }
}
