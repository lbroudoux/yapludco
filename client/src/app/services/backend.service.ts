import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackendService {

  private rootUrl: string = '/api';

  constructor(private http: HttpClient) { }

  getStatus(): Observable<any> {
    return this.http.get<any>(this.rootUrl + '/status');
  }

  enableMember(member: string): Observable<any> {
    return this.http.put<any>(this.rootUrl + '/member/' + member, {})
  }

  disableMember(member: string): Observable<any> {
    return this.http.put<any>(this.rootUrl + '/member/' + member, {})
  }

  enableDevice(member: string, device: string): Observable<any> {
    return this.http.put<any>(this.rootUrl + '/device/' + member, {})
  }

  disableDevice(member: string, device: string): Observable<any> {
    return this.http.put<any>(this.rootUrl + '/device/' + member, {})
  }
}