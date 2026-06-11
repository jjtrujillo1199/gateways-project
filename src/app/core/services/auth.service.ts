import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        access_token: string;
    };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl  = 'http://localhost:3000/auth';
    private tokenKey = 'jwt_token';
    private http     = inject(HttpClient);

    /**
     * Realiza el proceso de login enviando las credenciales al backend y almacenando el token JWT en localStorage.
     *
     * @param {{ username: string; password: string }} credentials
     * @return {*} 
     * @memberof AuthService
     */
    login(credentials: { username: string; password: string }) {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
            .pipe(
                tap(res => {
                    console.log('Login successful, token received:', res.data.access_token);
                    localStorage.setItem(this.tokenKey, res.data.access_token);
                })
            );
    }

    /**
     * Obtiene el token JWT almacenado en localStorage.
     *
     * @return {*} 
     * @memberof AuthService
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Elimina el token JWT almacenado en localStorage.
     *
     * @memberof AuthService
     */
    logout() {
        localStorage.removeItem(this.tokenKey);
    }

    /**
     * Verifica si el usuario está autenticado comprobando la existencia de un token JWT válido en localStorage.
     *
     * @return {*}  {boolean}
     * @memberof AuthService
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
