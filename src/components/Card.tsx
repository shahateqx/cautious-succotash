import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../types';
import { useBoard } from '../context/BoardContext';
import styles from './Card.module.css';

type Props = {
  card: CardType;
};

export function Card({ card }: Props) {
  const { dispatch } = useBoard();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function handleSave() {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== card.title) {
      dispatch({ type: 'EDIT_CARD', payload: { cardId: card.id, title: trimmed } });
    }
    setEditing(false);
    setEditTitle(card.title);
  }

  function handleCancel() {
    setEditing(false);
    setEditTitle(card.title);
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.card}>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        ⠿
      </div>
      {editing ? (
        <input
          className={styles.editInput}
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
        />
      ) : (
        <span
          className={styles.title}
          onClick={() => { setEditing(true); setEditTitle(card.title); }}
          data-testid={`card-title-${card.id}`}
        >
          {card.title}
        </span>
      )}
      <button
        className={styles.deleteBtn}
        onClick={() => dispatch({ type: 'DELETE_CARD', payload: { cardId: card.id } })}
        data-testid={`delete-card-${card.id}`}
      >
        ×
      </button>
    </div>
  );
}
