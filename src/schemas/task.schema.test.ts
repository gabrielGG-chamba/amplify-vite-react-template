import { describe, it, expect } from 'vitest';
import { safeParse } from 'valibot';
import { CreateTaskSchema, UpdateTaskSchema, TaskStatusEnum } from './task.schema';

describe('TaskStatusEnum', () => {
  it('accepts valid statuses', () => {
    expect(safeParse(TaskStatusEnum, 'PENDIENTE').success).toBe(true);
    expect(safeParse(TaskStatusEnum, 'HACIENDO').success).toBe(true);
    expect(safeParse(TaskStatusEnum, 'HECHO').success).toBe(true);
  });

  it('rejects invalid status', () => {
    expect(safeParse(TaskStatusEnum, 'INVALID').success).toBe(false);
    expect(safeParse(TaskStatusEnum, '').success).toBe(false);
  });
});

describe('CreateTaskSchema', () => {
  it('accepts valid input', () => {
    const result = safeParse(CreateTaskSchema, { content: 'My task', status: 'PENDIENTE' });
    expect(result.success).toBe(true);
  });

  it('rejects empty content', () => {
    const result = safeParse(CreateTaskSchema, { content: '', status: 'PENDIENTE' });
    expect(result.success).toBe(false);
  });

  it('rejects content exceeding 500 characters', () => {
    const result = safeParse(CreateTaskSchema, { content: 'a'.repeat(501), status: 'PENDIENTE' });
    expect(result.success).toBe(false);
  });

  it('accepts content of exactly 500 characters', () => {
    const result = safeParse(CreateTaskSchema, { content: 'a'.repeat(500), status: 'PENDIENTE' });
    expect(result.success).toBe(true);
  });

  it('rejects missing status', () => {
    const result = safeParse(CreateTaskSchema, { content: 'My task', status: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing content field', () => {
    const result = safeParse(CreateTaskSchema, { status: 'PENDIENTE' });
    expect(result.success).toBe(false);
  });
});

describe('UpdateTaskSchema', () => {
  it('accepts valid input', () => {
    const result = safeParse(UpdateTaskSchema, { id: 'abc123', content: 'Updated', status: 'HACIENDO' });
    expect(result.success).toBe(true);
  });

  it('rejects empty id', () => {
    const result = safeParse(UpdateTaskSchema, { id: '', content: 'Updated', status: 'HACIENDO' });
    expect(result.success).toBe(false);
  });

  it('rejects content exceeding 500 characters', () => {
    const result = safeParse(UpdateTaskSchema, { id: 'abc', content: 'a'.repeat(501), status: 'HACIENDO' });
    expect(result.success).toBe(false);
  });

  it('accepts content of exactly 500 characters', () => {
    const result = safeParse(UpdateTaskSchema, { id: 'abc', content: 'a'.repeat(500), status: 'HECHO' });
    expect(result.success).toBe(true);
  });

  it('accepts empty content (optional in update)', () => {
    const result = safeParse(UpdateTaskSchema, { id: 'abc', content: '', status: 'HECHO' });
    expect(result.success).toBe(true);
  });
});
