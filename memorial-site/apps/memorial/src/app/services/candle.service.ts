import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'memorial-candle';

@Injectable()
export class CandleService {
  private readonly candleState = signal<{ lit: boolean; message: string }>({ lit: false, message: '' });

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.candleState.set(JSON.parse(stored));
      } catch {
        this.persist(false, '');
      }
    }
  }

  isLit(): boolean {
    return this.candleState().lit;
  }

  message(): string {
    return this.candleState().message;
  }

  light(message: string): void {
    const trimmed = message || 'With love and gratitude';
    this.persist(true, trimmed);
  }

  extinguish(): void {
    this.persist(false, '');
  }

  private persist(lit: boolean, message: string): void {
    const state = { lit, message };
    this.candleState.set(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
