import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveBoard, loadBoard } from '../utils/persistence';
import type { BoardState } from '../types';

const mockState: BoardState = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      cards: [{ id: '1', columnId: 'todo', title: 'Test card' }],
    },
    { id: 'in-progress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] },
  ],
};

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveBoard', () => {
    it('writes serialized board state to localStorage', () => {
      saveBoard(mockState);
      const raw = localStorage.getItem('kanban-board');
      expect(raw).toBe(JSON.stringify(mockState));
    });

    it('does not throw when localStorage is full', () => {
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveBoard(mockState)).not.toThrow();
      setItem.mockRestore();
    });
  });

  describe('loadBoard', () => {
    it('returns saved board state from localStorage', () => {
      localStorage.setItem('kanban-board', JSON.stringify(mockState));
      const loaded = loadBoard();
      expect(loaded).toEqual(mockState);
    });

    it('returns default state when localStorage is empty', () => {
      const loaded = loadBoard();
      expect(loaded).toEqual({
        columns: [
          { id: 'todo', title: 'To Do', cards: [] },
          { id: 'in-progress', title: 'In Progress', cards: [] },
          { id: 'done', title: 'Done', cards: [] },
        ],
      });
    });

    it('returns default state when data is corrupted', () => {
      localStorage.setItem('kanban-board', '{invalid json!!!');
      const loaded = loadBoard();
      expect(loaded).toEqual({
        columns: [
          { id: 'todo', title: 'To Do', cards: [] },
          { id: 'in-progress', title: 'In Progress', cards: [] },
          { id: 'done', title: 'Done', cards: [] },
        ],
      });
    });

    it('returns default state when getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      const loaded = loadBoard();
      expect(loaded).toEqual({
        columns: [
          { id: 'todo', title: 'To Do', cards: [] },
          { id: 'in-progress', title: 'In Progress', cards: [] },
          { id: 'done', title: 'Done', cards: [] },
        ],
      });
    });
  });
});
