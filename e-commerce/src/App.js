import { BrowserRouter } from 'react-router-dom'; // Imports BrowserRouter for enabling routing
import { Provider } from 'react-redux';     //for Redux Store
import AppContent from './Components/AppContent'
//redux import
import { store } from "./Redux/store";

function App() {
  return (
    <div> {/* Main container for the entire application */}
      <Provider store={store}>        {/*wrapping the entire app with Redux Provider */}
          <BrowserRouter>
                <AppContent/>
          </BrowserRouter>
      </Provider>
    </div>
  );
}
export default App; // Exports the App component as the default export of this module