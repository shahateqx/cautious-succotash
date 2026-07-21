import { useState, type FormEvent } from 'react';
import { useBoard } from '../context/BoardContext';
import styles from './Column.module.css';

type Props = {
  columnId: string;
};

export function AddCardForm({ columnId }: Props) {
  const [title, setTitle] = useState('');
  const { dispatch } = useBoard();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_CARD', payload: { columnId, title: trimmed } });
    setTitle('');
  }

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <input
        className={styles.addInput}
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="+ Add card"
        data-testid={`add-card-input-${columnId}`}
      />
    </form>
  );
}
