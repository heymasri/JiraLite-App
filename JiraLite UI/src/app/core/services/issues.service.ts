import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Issue,
  IssueCreateDto,
  IssuesByStatus
} from '../models/jiralite.models';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private http = inject(HttpClient);



  getByProject(projectId: string): Observable<IssuesByStatus> {
    return this.http.get<IssuesByStatus>(
      `${environment.apiUrl}/api/issues/by-project/${projectId}`
    );
  }

  create(dto: IssueCreateDto): Observable<Issue> {
    return this.http.post<Issue>(
      `${environment.apiUrl}/api/issues`,
      dto
    );
  }

  changeStatus(
    issueId: string,
    status: 'ToDo' | 'InProgress' | 'Done'
  ): Observable<Issue> {
    return this.http.patch<Issue>(
      `${environment.apiUrl}/api/issues/${issueId}/status/${status}`,
      {}
    );
  }

  //  Edit issue
  update(issueId: string, dto: any): Observable<Issue> {
    return this.http.put<Issue>(
      `${environment.apiUrl}/api/issues/${issueId}`,
      dto
    );
  }

  //  Delete issue
  delete(issueId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/api/issues/${issueId}`
    );
  }
}