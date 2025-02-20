import { lazy } from 'react';
import { BaseLoader } from './components/loader';
const AppRouter = lazy(() => import('./AppRouter'));
const AppProvider = lazy(() => import('./AppProvider'));

function App() {
  return (
    <BaseLoader>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </BaseLoader>
  );
}

export default App;
