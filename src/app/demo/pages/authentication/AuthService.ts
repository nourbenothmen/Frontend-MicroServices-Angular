import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://localhost:7091/apigateway/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  /* ===========================
     AUTHENTICATION
     =========================== */

  // 🔐 LOGIN → /token (IMPORTANT)
login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post(`${API_URL}/token`, {
    Email: credentials.email,    // ⚠ correspond au backend
    Password: credentials.password
  });
}

  // 📝 REGISTER → /register
  register(user: {
    username: string;
    password: string;
    roles: { roleName: string }[];
  }): Observable<any> {
    return this.http.post(`${API_URL}/register`, user);
  }

  /* ===========================
     TOKEN MANAGEMENT
     =========================== */

  saveToken(token: string): void {
    localStorage.setItem('access-token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access-token');
  }

  logout(): void {
    localStorage.removeItem('access-token');
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
     ROLES
     =========================== */

  getRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];

    // ASP.NET Identity → role ou roles
    if (decoded.role) {
      return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
    }

    if (decoded.roles) {
      return decoded.roles;
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
}
