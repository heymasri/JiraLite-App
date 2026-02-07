import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { ProjectsService } from '../../core/services/projects.service';
import { IssuesService } from '../../core/services/issues.service';
import { Issue, IssuesByStatus, Project } from '../../core/models/jiralite.models';

type Status = 'ToDo' | 'InProgress' | 'Done';

@Component({
  standalone: true,
  selector: 'app-issues',
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './issues.html',
  styleUrls: ['./issues.scss'],
  
})
export class Issues {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private projectsApi = inject(ProjectsService);
  private issuesApi = inject(IssuesService);
  private cdr = inject(ChangeDetectorRef);
  editingId: string | null = null;
  statuses: Status[] = ['ToDo', 'InProgress', 'Done'];

  projectId = '';
  project: Project | null = null;

  board: Record<Status, Issue[]> = { ToDo: [], InProgress: [], Done: [] };
  loading = false;
  error = '';

  // matches issues.html: [formGroup]="form"
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    priority: ['Medium', Validators.required],
  });
  
  editForm = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(2)]],
  priority: ['Medium', Validators.required],
  });

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    this.loadProjectHeader();
    this.loadBoard();
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  private loadProjectHeader() {
    if (!this.projectId) return;

    this.projectsApi.getAll().subscribe({
      next: (ps) => {
        this.project = ps.find(p => p.id === this.projectId) ?? null;
        this.cdr.detectChanges(); // ensure header renders without click
      },
      error: () => {
        this.project = null;
        this.cdr.detectChanges();
      }
    });
  }

  private loadBoard() {
    if (!this.projectId) return;

    this.loading = true;
    this.error = '';

    this.issuesApi.getByProject(this.projectId).subscribe({
      next: (res: IssuesByStatus) => {
        this.board = {
          ToDo: (res?.['ToDo'] ?? []) as Issue[],
          InProgress: (res?.['InProgress'] ?? []) as Issue[],
          Done: (res?.['Done'] ?? []) as Issue[],
        };
        this.loading = false;
        this.cdr.detectChanges(); // ensure issues render without click
      },
      error: () => {
        this.error = 'Failed to load issues';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  list(status: Status): Issue[] {
    return this.board[status] ?? [];
  }

  count(status: Status): number {
    return this.list(status).length;
  }

  createIssue() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    const dto = {
      title: v.title!,
      priority: v.priority as any,
      status: 'ToDo',
      projectId: this.projectId,
      assigneeId: null,
      description: null,
      dueDate: null,
    };

    this.issuesApi.create(dto as any).subscribe({
      next: () => {
        this.form.reset({ priority: 'Medium' });
        this.loadBoard();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Create issue failed';
        this.cdr.detectChanges();
      }
    });
  }

  onDrop(event: CdkDragDrop<Issue[]>, toStatus: Status) {
    if (event.previousContainer === event.container) return;

    const issue = event.previousContainer.data[event.previousIndex];
    if (!issue) return;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    
    // persist
    this.issuesApi.changeStatus(issue.id, toStatus).subscribe({
      next: () => this.loadBoard(),
      error: () => {
        this.error = 'Failed to move issue';
        this.loadBoard();
      }
    });
  }
  //  start editing a specific issue
  startEdit(issue: Issue) {
  this.editingId = issue.id;
  this.editForm.setValue({
    title: issue.title,
    priority: (issue.priority as any) ?? 'Medium',
  });
  }

  cancelEdit() {
  this.editingId = null;
  this.editForm.reset({ priority: 'Medium' });
  }

//save edited issue (requires IssuesService.update)
  saveEdit(issue: Issue) {
  
  if (this.editForm.invalid) return;

  const v = this.editForm.getRawValue();

  const dto = {
    title: v.title!,
    priority: v.priority!,
  };


   
  this.issuesApi.update(issue.id, dto).subscribe({
      next: () => {
      this.editingId = null;
      this.loadBoard();
    },
      error: () => {
      // ✅ POPUP only
      alert('Update issue failed');
    }
  });

  }

// delete issue (requires IssuesService.delete)
  //  delete issue (popup only, no inline error)
  deleteIssue(issue: Issue) {
  if (!confirm('Delete this issue?')) return;

    this.issuesApi.delete(issue.id).subscribe({
    next: () => {
      this.loadBoard();
    },
    error: () => {
      // ✅ POPUP only
      alert('Delete issue failed');
    }
  });
}

}