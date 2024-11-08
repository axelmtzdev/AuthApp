import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, RegisterResponse, User } from '../interfaces';
import { CheckTokenResponse } from '../interfaces/check-token.response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseURL:string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal(<User  | null>(null));
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);


  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user:User, token: string):boolean{
    this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token)
        return true;
  }

  private setUser(user:User, token:string):boolean{
    return true;
  }


  signin(name: string, email: string, password: string):Observable<boolean>{
    const url = `${this.baseURL}/auth/register`;
    const body = {name,email, password}
    return this.http.post<RegisterResponse>(url, body)
      .pipe(
        map(({user, token}) => this.setUser(user,token)),
        catchError(err => throwError(() => err.error.message))
        )
  }

  login(email:string, password:string):Observable<boolean>{

    const url =  `${this.baseURL}/auth/login`;
    const body = { email,password }
    return this.http.post<LoginResponse>(url,body)
    .pipe(
      map(({user, token}) => this.setAuthentication(user, token)),
      catchError(err => throwError(()=> err.error.message))
    );
  }

  checkAuthStatus():Observable<boolean>{
    const url = `${this.baseURL}/auth/check-token`;
    const token = localStorage.getItem('token');

    if(!token) {
      this.logout()
      return of(false);}

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

    return this.http.get<CheckTokenResponse>(url, {headers})
    .pipe(
      map(({user, token}) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated)
        return of(false);
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
