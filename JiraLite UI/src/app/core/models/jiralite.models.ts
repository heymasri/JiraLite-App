export interface Project {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  ownerId?: string;
  createdAt?: string;
}

export interface ProjectCreateDto {
  key: string;
  name: string;
  description?: string | null;
}

export interface Issue {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: 'ToDo' | 'InProgress' | 'Done' | string;
  priority: 'Low' | 'Medium' | 'High' | string;
  assigneeId?: string | null;
  reporterId?: string;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IssueCreateDto {
  title: string;
  description?: string | null;
  status: 'ToDo' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId?: string | null;
  projectId: string;
  dueDate?: string | null;
}

export type IssuesByStatus = Record<string, Issue[]>;

// ensures TypeScript always treats this file as a module even if someone removes exports later
export {};