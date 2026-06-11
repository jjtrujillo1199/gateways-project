import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'http://localhost:3000';
    private http = inject(HttpClient);

    get<T>(endpoint: string, params?: { [param: string]: string | number | boolean }): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
            params: params as any,
            observe: 'body'
        });
    }

    post<T>(endpoint: string, body: any) {
        return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
    }

    patch<T>(endpoint: string, body: any) {
        return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body);
    }

    delete<T>(endpoint: string) {
        return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
    }
}
