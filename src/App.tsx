import { Board } from './components/Board';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kanban</h1>
      </header>
      <main className={styles.main}>
        <Board />
      </main>
    </div>
  );
}
