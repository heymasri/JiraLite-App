import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectsService } from '../../core/services/projects.service';
import { Project } from '../../core/models/jiralite.models';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class Projects {
  private api = inject(ProjectsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  error = '';
  projects: Project[] = [];

  // track edit mode
  editingProjectId: string | null = null;

  form = this.fb.group({
    key: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  // edit form
  editProjectForm = this.fb.group({
    key: [''],
    name: [''],
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.api.getAll().subscribe({
      next: (res: any) => {
        this.projects = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges(); //force render
      },
      error: () => {
        this.loading = false;
        alert('Failed to load projects');
      }
    });
  }

  create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.create(this.form.getRawValue() as any).subscribe({
      next: (p) => {
        this.projects = [p, ...this.projects];
        this.form.reset();
      },
      error: () => alert('Create project failed'),
    });
  }

  //  start editing
  startEdit(project: Project) {
    this.editingProjectId = project.id;
    this.editProjectForm.setValue({
      key: project.key,
      name: project.name,
    });
  }

  // cancel editing
  cancelEdit() {
    this.editingProjectId = null;
  }

  //  save edited project
  saveEdit(project: Project) {
  const v = this.editProjectForm.getRawValue();

  this.api.update(project.id, {
    key: v.key!,
    name: v.name!,
    description: project.description,
  }).subscribe({
    next: () => {
      this.editingProjectId = null;
      this.load();
    },
      error: (err: any) => {
        if (err?.status === 403) {
         alert('Only the project owner can edit this project.');
        } else {
          alert('Update project failed.');
        }
      }
    });
  }

  // delete project
    deleteProject(project: Project) {
  if (!confirm('Delete this project?')) return;

  // Optimistically remove from UI immediately
  const originalProjects = [...this.projects];
  this.projects = this.projects.filter(p => p.id !== project.id);

  this.api.delete(project.id).subscribe({
      next: () => {
      // nothing else needed, UI already updated
      },
      error: (err: any) => {
      // revert UI if delete fails
        this.projects = originalProjects;

        if (err?.status === 403) {
          alert('Only the project owner can delete this project.');
        } else {
          alert('Delete project failed.');
        }
      }
    });
  }

  openBoard(projectId: string) {
    this.router.navigate(['/projects', projectId, 'board']);
  }
}