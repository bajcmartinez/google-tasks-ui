import { Moment } from 'moment'

export type TaskList = {
  id: string,
  title: string,
  updatedAt: Moment,
  status: string
}

export type Task = {
  id: string,
  title: string,
  notes?: string,
  completed: boolean,
  completedAt?: Moment,
  dueAt?: Moment,
  parent: string,
  updatedAt: Moment,
  status: string,
  listId: string,
  subtasks: Task[],
  isDirty: boolean
}