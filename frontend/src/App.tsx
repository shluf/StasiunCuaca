import { AppProviders } from './app/AppProviders';
import { Dashboard } from './features/dashboard';
import { Onboarding } from './components/onboarding';
import './index.css';

function App() {
  return (
    <AppProviders>
      <Onboarding />
      <Dashboard />
    </AppProviders>
  );
}

export default App;
