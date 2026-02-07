import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginDto, LoginResponse, MeResponse, RegisterDto } from '../models/auth.models';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'jiralite_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenSig = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  token = computed(() => this.tokenSig());
  isLoggedIn = computed(() => !!this.tokenSig());

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/auth/register`, dto);
  }

  login(dto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, dto).pipe(
      tap(res => this.setToken(res.token))
    );
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${environment.apiUrl}/api/auth/me`);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSig.set(null);
  }

  private setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenSig.set(token);
  }
}