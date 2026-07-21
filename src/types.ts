export type Card = {
  id: string;
  columnId: string;
  title: string;
};

export type Column = {
  id: string;
  title: string;
  cards: Card[];
};

export type BoardState = {
  columns: Column[];
};

export type Action =
  | { type: 'ADD_CARD'; payload: { columnId: string; title: string } }
  | { type: 'EDIT_CARD'; payload: { cardId: string; title: string } }
  | { type: 'DELETE_CARD'; payload: { cardId: string } }
  | { type: 'MOVE_CARD'; payload: { cardId: string; fromColumnId: string; toColumnId: string; toIndex: number } }
  | { type: 'REORDER_CARD'; payload: { columnId: string; fromIndex: number; toIndex: number } };
