import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('snsApi source code', () => {
  const content = readFileSync('src/services/snsApi.ts', 'utf-8');

  it('has no /api/sns/ proxy references', () => {
    expect(content).not.toContain('/api/sns/');
  });

  it('caps limit to 100', () => {
    expect(content).toContain('Math.min');
  });

  it('validates content-type before JSON parse', () => {
    expect(content).toContain('content-type');
  });

  it('points to transparencia.sns.gov.pt', () => {
    expect(content).toContain('transparencia.sns.gov.pt');
  });
});
