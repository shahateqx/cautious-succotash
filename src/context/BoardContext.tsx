import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { BoardState, Action } from '../types';
import { boardReducer } from './boardReducer';
import { saveBoard, loadBoard } from '../utils/persistence';

type BoardContextValue = {
  state: BoardState;
  dispatch: React.Dispatch<Action>;
};

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, undefined, loadBoard);

  useEffect(() => {
    saveBoard(state);
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within BoardProvider');
  return context;
}
