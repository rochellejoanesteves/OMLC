import './app.scss';
import { BrowserRouter } from "react-router-dom";
import Router from './routes';

function App() {
  return (
    <div className="app">
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </div>
  );
}

export default App;
