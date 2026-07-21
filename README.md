# Kanban Board

A lightweight, drag-and-drop Kanban board built as a technical showcase — tests state management, DnD library integration, and persistence patterns.

## Features

- **Three-column layout** — To Do, In Progress, Done
- **Drag-and-drop** — cards move between columns **and** reorder within a column
- **Add / edit / delete cards** — inline editing with Enter to save, Escape to cancel
- **localStorage persistence** — board state saved on every mutation, restored on reload
- **Keyboard reordering** — Tab to a card, Space to pick up, arrow keys to move
- **Mobile-friendly** — touch drag via PointerSensor with activation distance to prevent accidental drags

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| State management | useReducer + React Context |
| Styling | CSS Modules |
| Testing | Vitest + React Testing Library |

## Project Structure

```
src/
├── types.ts                          # Card, Column, BoardState, Action types
├── context/
│   ├── boardReducer.ts               # Pure reducer handling all state transitions
│   └── BoardContext.tsx              # Provider + useBoard hook, auto-persists
├── utils/persistence.ts              # localStorage save/load with error handling
├── components/
│   ├── Board.tsx                     # DndContext, collision detection, drag handler
│   ├── Column.tsx                    # useDroppable container + SortableContext
│   ├── Card.tsx                      # useSortable item with inline edit/delete
│   └── AddCardForm.tsx              # Controlled form
├── App.tsx                           # Layout shell
├── main.tsx                          # Entry point
└── __tests__/
    ├── setup.ts                      # jsdom localStorage mock + auto-cleanup
    ├── boardReducer.test.ts          # 12 unit tests — all action types + edge cases
    ├── persistence.test.ts           # 6 tests — save, load, corruption, quota
    └── dragIntegration.test.tsx      # 5 tests — add, edit, delete, persistence round-trip
```

## Getting Started

```bash
npm install
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`).

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |

## Testing Approach

- **Unit tests** cover every reducer action (ADD, EDIT, DELETE, MOVE, REORDER) plus edge cases like unknown actions, non-existent card IDs, and same-index reorders.
- **Persistence tests** verify full round-trip: serialize → localStorage → deserialize, plus graceful fallback when storage is full or data is corrupted.
- **Integration tests** mount the full provider tree and simulate user interactions (typing, clicking, form submission) to verify the board adds, edits, deletes, and persists cards correctly.
