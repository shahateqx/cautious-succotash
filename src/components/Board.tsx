import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoard } from '../context/BoardContext';
import { Column } from './Column';
import styles from './Board.module.css';

export function Board() {
  const { state, dispatch } = useBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = state.columns.find(col =>
      col.cards.some(c => c.id === activeId)
    );
    const overColumn = state.columns.find(col =>
      col.id === overId || col.cards.some(c => c.id === overId)
    );

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id === overColumn.id) {
      const fromIndex = activeColumn.cards.findIndex(c => c.id === activeId);
      const toIndex = activeColumn.cards.findIndex(c => c.id === overId);
      if (fromIndex === toIndex) return;
      dispatch({
        type: 'REORDER_CARD',
        payload: { columnId: activeColumn.id, fromIndex, toIndex },
      });
    } else {
      const overIndex = overColumn.cards.findIndex(c => c.id === overId);
      dispatch({
        type: 'MOVE_CARD',
        payload: {
          cardId: activeId,
          fromColumnId: activeColumn.id,
          toColumnId: overColumn.id,
          toIndex: overIndex >= 0 ? overIndex : overColumn.cards.length,
        },
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {state.columns.map(column => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </DndContext>
  );
}
