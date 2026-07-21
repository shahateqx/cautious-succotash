import { describe, it, expect } from 'vitest';
import { boardReducer } from '../context/boardReducer';
import type { BoardState } from '../types';

function createInitialState(): BoardState {
  return {
    columns: [
      { id: 'todo', title: 'To Do', cards: [] },
      { id: 'in-progress', title: 'In Progress', cards: [] },
      { id: 'done', title: 'Done', cards: [] },
    ],
  };
}

describe('boardReducer', () => {
  describe('ADD_CARD', () => {
    it('adds a card to the specified column', () => {
      const state = createInitialState();
      const next = boardReducer(state, {
        type: 'ADD_CARD',
        payload: { columnId: 'todo', title: 'Test card' },
      });
      expect(next.columns[0].cards).toHaveLength(1);
      expect(next.columns[0].cards[0].title).toBe('Test card');
      expect(next.columns[0].cards[0].columnId).toBe('todo');
    });

    it('does not affect other columns', () => {
      const state = createInitialState();
      const next = boardReducer(state, {
        type: 'ADD_CARD',
        payload: { columnId: 'todo', title: 'Test' },
      });
      expect(next.columns[1].cards).toHaveLength(0);
      expect(next.columns[2].cards).toHaveLength(0);
    });

    it('generates a unique id for the new card', () => {
      const state = createInitialState();
      const next = boardReducer(state, {
        type: 'ADD_CARD',
        payload: { columnId: 'todo', title: 'A' },
      });
      expect(next.columns[0].cards[0].id).toBeDefined();
      expect(typeof next.columns[0].cards[0].id).toBe('string');
    });
  });

  describe('EDIT_CARD', () => {
    it('updates the card title', () => {
      const state = createInitialState();
      const withCard = boardReducer(state, {
        type: 'ADD_CARD',
        payload: { columnId: 'todo', title: 'Old' },
      });
      const cardId = withCard.columns[0].cards[0].id;
      const next = boardReducer(withCard, {
        type: 'EDIT_CARD',
        payload: { cardId, title: 'Updated' },
      });
      expect(next.columns[0].cards[0].title).toBe('Updated');
    });
  });

  describe('DELETE_CARD', () => {
    it('removes the card from its column', () => {
      const state = createInitialState();
      const withCard = boardReducer(state, {
        type: 'ADD_CARD',
        payload: { columnId: 'todo', title: 'Delete me' },
      });
      const cardId = withCard.columns[0].cards[0].id;
      const next = boardReducer(withCard, {
        type: 'DELETE_CARD',
        payload: { cardId },
      });
      expect(next.columns[0].cards).toHaveLength(0);
    });

    it('does nothing for a non-existent card id', () => {
      const state = createInitialState();
      const next = boardReducer(state, {
        type: 'DELETE_CARD',
        payload: { cardId: 'nonexistent' },
      });
      expect(next).toEqual(state);
    });
  });

  describe('MOVE_CARD', () => {
    it('moves a card from one column to another', () => {
      const state = createInitialState();
      const withCard = boardReducer(state, {
        type: 'ADD_CARD',
        payload: { columnId: 'todo', title: 'Moving card' },
      });
      const cardId = withCard.columns[0].cards[0].id;

      const next = boardReducer(withCard, {
        type: 'MOVE_CARD',
        payload: { cardId, fromColumnId: 'todo', toColumnId: 'done', toIndex: 0 },
      });

      expect(next.columns[0].cards).toHaveLength(0);
      expect(next.columns[2].cards).toHaveLength(1);
      expect(next.columns[2].cards[0].id).toBe(cardId);
      expect(next.columns[2].cards[0].columnId).toBe('done');
    });

    it('inserts the card at the correct index in the target column', () => {
      const state = createInitialState();
      const withCards = boardReducer(state, { type: 'ADD_CARD', payload: { columnId: 'done', title: 'Existing' } });
      const existingId = withCards.columns[2].cards[0].id;
      const withTwo = boardReducer(withCards, { type: 'ADD_CARD', payload: { columnId: 'todo', title: 'Mobile' } });
      const movingId = withTwo.columns[0].cards[0].id;

      const next = boardReducer(withTwo, {
        type: 'MOVE_CARD',
        payload: { cardId: movingId, fromColumnId: 'todo', toColumnId: 'done', toIndex: 0 },
      });

      expect(next.columns[2].cards).toHaveLength(2);
      expect(next.columns[2].cards[0].id).toBe(movingId);
      expect(next.columns[2].cards[1].id).toBe(existingId);
    });

    it('returns state unchanged if card does not exist', () => {
      const state = createInitialState();
      const next = boardReducer(state, {
        type: 'MOVE_CARD',
        payload: { cardId: 'ghost', fromColumnId: 'todo', toColumnId: 'done', toIndex: 0 },
      });
      expect(next).toEqual(state);
    });
  });

  describe('REORDER_CARD', () => {
    it('reorders cards within the same column', () => {
      const state = createInitialState();
      const withA = boardReducer(state, { type: 'ADD_CARD', payload: { columnId: 'todo', title: 'A' } });
      const withAB = boardReducer(withA, { type: 'ADD_CARD', payload: { columnId: 'todo', title: 'B' } });
      const cards = withAB.columns[0].cards;
      const idA = cards[0].id;
      const idB = cards[1].id;

      const next = boardReducer(withAB, {
        type: 'REORDER_CARD',
        payload: { columnId: 'todo', fromIndex: 0, toIndex: 1 },
      });

      expect(next.columns[0].cards[0].id).toBe(idB);
      expect(next.columns[0].cards[1].id).toBe(idA);
    });

    it('returns state unchanged for fromIndex === toIndex', () => {
      const state = createInitialState();
      const withCard = boardReducer(state, { type: 'ADD_CARD', payload: { columnId: 'todo', title: 'X' } });

      const next = boardReducer(withCard, {
        type: 'REORDER_CARD',
        payload: { columnId: 'todo', fromIndex: 0, toIndex: 0 },
      });

      expect(next).toEqual(withCard);
    });
  });

  it('returns state unchanged for unknown action types', () => {
    const state = createInitialState();
    const next = boardReducer(state, { type: 'UNKNOWN' } as never);
    expect(next).toEqual(state);
  });
});
