import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/jiralite.models';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7284/api/projects'; // HTTPS to link backend

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  create(dto: any): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, dto);
  }
  
 // update project
  update(id: string, dto: any): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, dto);
  }

  // delete project
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


}