import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      console.log("Auth Guard invoked ! ")

      if (!this.auth.isLoggedIn()) {
        console.log("Auth Guard AUTH ERROR ! User cannot access")
        alert("Please login to access this area");
        this.router.navigateByUrl('/');
        return false;
      } else {
        console.log("Auth Guard OK ! User can access")
        return true;
      }
  }
}


