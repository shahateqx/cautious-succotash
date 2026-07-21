import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BoardProvider } from '../context/BoardContext';
import { App } from '../App';

function renderApp() {
  return render(
    <BoardProvider>
      <App />
    </BoardProvider>
  );
}

describe('drag integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders all three columns', () => {
    renderApp();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('adds a card via the form and displays it', async () => {
    renderApp();
    const input = screen.getByTestId('add-card-input-todo');
    await userEvent.type(input, 'New task{Enter}');
    expect(screen.getByText('New task')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('adds and deletes a card', async () => {
    renderApp();
    const input = screen.getByTestId('add-card-input-todo');
    await userEvent.type(input, 'Delete me{Enter}');
    expect(screen.getByText('Delete me')).toBeInTheDocument();

    const deleteBtn = screen.getByText('×');
    await userEvent.click(deleteBtn);
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });

  it('edits a card title by clicking and typing', async () => {
    renderApp();
    const input = screen.getByTestId('add-card-input-todo');
    await userEvent.type(input, 'Original{Enter}');
    const title = screen.getByText('Original');
    await userEvent.click(title);

    const editInput = screen.getByDisplayValue('Original');
    await userEvent.clear(editInput);
    await userEvent.type(editInput, 'Edited');
    await userEvent.keyboard('{Enter}');

    expect(screen.getByText('Edited')).toBeInTheDocument();
    expect(screen.queryByText('Original')).not.toBeInTheDocument();
  });

  it('persists cards across rerender', async () => {
    const { unmount } = renderApp();
    const input = screen.getByTestId('add-card-input-todo');
    await userEvent.type(input, 'Persistent{Enter}');
    expect(screen.getByText('Persistent')).toBeInTheDocument();

    unmount();

    render(
      <BoardProvider>
        <App />
      </BoardProvider>
    );

    expect(screen.getByText('Persistent')).toBeInTheDocument();
  });
});
