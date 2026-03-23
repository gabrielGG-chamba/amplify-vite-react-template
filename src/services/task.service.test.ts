import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNextStatus, canTransitionTo, createVersion, isValidStatus } from './task.service';
import type { TaskStatus } from '../@types/task.types';

describe('getNextStatus', () => {
  it('returns HACIENDO for PENDIENTE', () => {
    expect(getNextStatus('PENDIENTE')).toBe('HACIENDO');
  });

  it('returns HECHO for HACIENDO', () => {
    expect(getNextStatus('HACIENDO')).toBe('HECHO');
  });

  it('returns HECHO for HECHO (last status stays)', () => {
    expect(getNextStatus('HECHO')).toBe('HECHO');
  });
});

describe('canTransitionTo', () => {
  it('allows PENDIENTE → HACIENDO', () => {
    expect(canTransitionTo('PENDIENTE', 'HACIENDO')).toBe(true);
  });

  it('allows HACIENDO → HECHO', () => {
    expect(canTransitionTo('HACIENDO', 'HECHO')).toBe(true);
  });

  it('disallows PENDIENTE → HECHO (skip)', () => {
    expect(canTransitionTo('PENDIENTE', 'HECHO')).toBe(false);
  });

  it('disallows same status transition', () => {
    expect(canTransitionTo('PENDIENTE', 'PENDIENTE')).toBe(false);
    expect(canTransitionTo('HACIENDO', 'HACIENDO')).toBe(false);
    expect(canTransitionTo('HECHO', 'HECHO')).toBe(false);
  });

  it('disallows backward transitions', () => {
    expect(canTransitionTo('HECHO', 'HACIENDO')).toBe(false);
    expect(canTransitionTo('HACIENDO', 'PENDIENTE')).toBe(false);
  });
});

describe('createVersion', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-uuid-1234' as ReturnType<typeof crypto.randomUUID>);
  });

  it('creates a version with correct structure', () => {
    const version = createVersion('PENDIENTE', 'HACIENDO', 'user-1');
    expect(version.id).toBe('test-uuid-1234');
    expect(version.previousStatus).toBe('PENDIENTE');
    expect(version.newStatus).toBe('HACIENDO');
    expect(version.changedBy).toBe('user-1');
    expect(typeof version.changedAt).toBe('string');
  });

  it('accepts null previousStatus for initial creation', () => {
    const version = createVersion(null, 'PENDIENTE', 'user-1');
    expect(version.previousStatus).toBeNull();
    expect(version.newStatus).toBe('PENDIENTE');
  });

  it('changedAt is a valid ISO date string', () => {
    const version = createVersion('HACIENDO', 'HECHO', 'user-2');
    expect(() => new Date(version.changedAt)).not.toThrow();
    expect(new Date(version.changedAt).toISOString()).toBe(version.changedAt);
  });
});

describe('isValidStatus', () => {
  it('returns true for valid statuses', () => {
    expect(isValidStatus('PENDIENTE')).toBe(true);
    expect(isValidStatus('HACIENDO')).toBe(true);
    expect(isValidStatus('HECHO')).toBe(true);
  });

  it('returns false for invalid strings', () => {
    expect(isValidStatus('INVALID')).toBe(false);
    expect(isValidStatus('')).toBe(false);
    expect(isValidStatus('pendiente')).toBe(false);
  });

  it('returns false for non-string types', () => {
    expect(isValidStatus(null)).toBe(false);
    expect(isValidStatus(undefined)).toBe(false);
    expect(isValidStatus(123)).toBe(false);
    expect(isValidStatus({})).toBe(false);
  });
});
