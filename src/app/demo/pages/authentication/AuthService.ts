import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://localhost:7091/apigateway/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  /* ===========================
     AUTHENTICATION
     =========================== */

  // 🔐 LOGIN
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${API_URL}/token`, {
      Email: credentials.email,
      Password: credentials.password
    });
  }

  // 📝 REGISTER (sans rôle)
  register(user: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${API_URL}/register`, user);
  }

  /* ===========================
     TOKEN MANAGEMENT
     =========================== */

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /* ===========================
     AUTH STATUS
     =========================== */

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /* ===========================
     JWT DECODE
     =========================== */

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<any>(token);
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return null;
    }
  }

  /* ===========================
     ROLES (ASP.NET Identity)
     =========================== */

  getRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];

    // Format simple
    if (decoded.roles) {
      return Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
    }

    // Claim "role"
    if (decoded.role) {
      return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
    }

    // Claim ASP.NET Identity
    const identityRole =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (identityRole) {
      return Array.isArray(identityRole) ? identityRole : [identityRole];
    }

    return [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  /* ===========================
     TOKEN VALIDATION
     =========================== */

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch {
      return true;
    }
  }

  /* ===========================
     USER INFO
     =========================== */

  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub || decoded?.username || null;
  }

  getEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.email || null;
  }
}
