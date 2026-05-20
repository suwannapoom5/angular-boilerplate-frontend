import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IApiRes } from '../../model/interface/api-model';

@Injectable({
  providedIn: 'root',
})
export class AuthenApiService {
  private API_BASE_URL: string = environment.AUTHEN_API_URL;
  private httpHeaders?: HttpHeaders;

  constructor(private httpClient: HttpClient) {
  }

  get API_URL() {
    return this.API_BASE_URL;
  }

  get API_HEADERS() {
    if (!this.httpHeaders) {
      const token = localStorage.getItem('access_token');
      if (token) {
        this.httpHeaders = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`);
      } else {
        this.httpHeaders = new HttpHeaders();
      }
    }

    return this.httpHeaders;
  }

  setHttpHeaders(token: string): void {
    this.httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  get<T = any>(endpoint: string, params?: Record<string, any>): Observable<HttpResponse<IApiRes<T>>> {
    return this.httpClient.get<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, {
      observe: 'response',
      headers: this.API_HEADERS,
      params: new HttpParams({ fromObject: params ?? {} }),
    }).pipe(catchError(this.handleError));
  }

  post<T = any>(endpoint: string, data: any): Observable<HttpResponse<IApiRes<T>>> {
    return this.httpClient.post<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, data, {
      observe: 'response',
      headers: this.API_HEADERS
    }).pipe(catchError(this.handleError));
  }

  post_formData<T = any>(endpoint: string, formData: FormData): Observable<HttpResponse<IApiRes<T>>> {
    const headers = this.API_HEADERS.delete('Content-Type');
    return this.httpClient.post<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, formData, {
      observe: 'response',
      headers
    }).pipe(catchError(this.handleError));
  }

  put<T = any>(endpoint: string, data: any): Observable<HttpResponse<IApiRes<T>>> {
    return this.httpClient.put<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, data, {
      observe: 'response',
      headers: this.API_HEADERS
    }).pipe(catchError(this.handleError));
  }

  put_formData<T = any>(endpoint: string, formData: FormData): Observable<HttpResponse<IApiRes<T>>> {
    const headers = this.API_HEADERS.delete('Content-Type');
    return this.httpClient.put<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, formData, {
      observe: 'response',
      headers
    }).pipe(catchError(this.handleError));
  }

  patch<T = any>(endpoint: string, data: any): Observable<HttpResponse<IApiRes<T>>> {
    return this.httpClient.patch<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, data, {
      observe: 'response',
      headers: this.API_HEADERS
    }).pipe(catchError(this.handleError));
  }

  patch_formData<T = any>(endpoint: string, data: any): Observable<HttpResponse<IApiRes<T>>> {
    const headers = this.API_HEADERS.delete('Content-Type');
    return this.httpClient.patch<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, data, {
      observe: 'response',
      headers
    }).pipe(catchError(this.handleError));
  }

  delete<T = any>(endpoint: string, params?: Record<string, any>): Observable<HttpResponse<IApiRes<T>>> {
    return this.httpClient.delete<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, {
      observe: 'response',
      headers: this.API_HEADERS,
      params: new HttpParams({ fromObject: params ?? {} }),
    }).pipe(catchError(this.handleError));
  }

  delete_with_body<T = any>(endpoint: string, data: any): Observable<HttpResponse<IApiRes<T>>> {
    return this.httpClient.request<IApiRes<T>>('delete', `${this.API_BASE_URL}/${endpoint}`, {
      body: data,
      observe: 'response',
      headers: this.API_HEADERS,
    }).pipe(catchError(this.handleError));
  }

  delete_formData<T = any>(endpoint: string, params?: Record<string, any>): Observable<HttpResponse<IApiRes<T>>> {
    const headers = this.API_HEADERS.delete('Content-Type');
    return this.httpClient.delete<IApiRes<T>>(`${this.API_BASE_URL}/${endpoint}`, {
      observe: 'response',
      headers,
      params: new HttpParams({ fromObject: params ?? {} }),
    }).pipe(catchError(this.handleError));
  }

  blob_get(endpoint: string): Observable<Blob> {
    return this.httpClient
      .get(`${this.API_BASE_URL}/${endpoint}`, { headers: this.API_HEADERS, responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  blob_post(endpoint: string, data: any): Observable<Blob> {
    return this.httpClient
      .post(`${this.API_BASE_URL}/${endpoint}`, data, { headers: this.API_HEADERS, responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

}
