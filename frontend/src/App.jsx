import { ToastProvider } from './context/ToastContext';
import { Dashboard } from './components/Dashboard';

export default function App() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}
