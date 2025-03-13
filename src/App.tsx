import { HashRouter} from 'react-router-dom';
import { MainLayout } from './pages/main';

function App() {
  return (
    <HashRouter>
      <MainLayout />
    </HashRouter>
  );
}

export default App;
