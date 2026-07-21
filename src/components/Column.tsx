import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType } from '../types';
import { Card } from './Card';
import { AddCardForm } from './AddCardForm';
import styles from './Column.module.css';

type Props = {
  column: ColumnType;
};

export function Column({ column }: Props) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className={styles.column}>
      <div className={styles.header}>{column.title}</div>
      <div ref={setNodeRef} className={styles.cardList}>
        <SortableContext
          items={column.cards.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
      <AddCardForm columnId={column.id} />
    </div>
  );
}
