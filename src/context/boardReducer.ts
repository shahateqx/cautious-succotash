import type { BoardState, Action } from '../types';

export function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'ADD_CARD': {
      const newCard = {
        id: crypto.randomUUID(),
        columnId: action.payload.columnId,
        title: action.payload.title,
      };
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === action.payload.columnId
            ? { ...col, cards: [...col.cards, newCard] }
            : col
        ),
      };
    }

    case 'EDIT_CARD': {
      return {
        ...state,
        columns: state.columns.map(col => ({
          ...col,
          cards: col.cards.map(card =>
            card.id === action.payload.cardId
              ? { ...card, title: action.payload.title }
              : card
          ),
        })),
      };
    }

    case 'DELETE_CARD': {
      return {
        ...state,
        columns: state.columns.map(col => ({
          ...col,
          cards: col.cards.filter(card => card.id !== action.payload.cardId),
        })),
      };
    }

    case 'MOVE_CARD': {
      const fromColumn = state.columns.find(c => c.id === action.payload.fromColumnId);
      const card = fromColumn?.cards.find(c => c.id === action.payload.cardId);
      if (!card) return state;

      const updatedCard = { ...card, columnId: action.payload.toColumnId };

      return {
        ...state,
        columns: state.columns.map(col => {
          if (col.id === action.payload.fromColumnId) {
            return { ...col, cards: col.cards.filter(c => c.id !== action.payload.cardId) };
          }
          if (col.id === action.payload.toColumnId) {
            const newCards = [...col.cards];
            newCards.splice(action.payload.toIndex, 0, updatedCard);
            return { ...col, cards: newCards };
          }
          return col;
        }),
      };
    }

    case 'REORDER_CARD': {
      const column = state.columns.find(c => c.id === action.payload.columnId);
      if (!column) return state;

      const newCards = [...column.cards];
      const [moved] = newCards.splice(action.payload.fromIndex, 1);
      newCards.splice(action.payload.toIndex, 0, moved);

      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === action.payload.columnId
            ? { ...col, cards: newCards }
            : col
        ),
      };
    }

    default:
      return state;
  }
}
