import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { presenters, stores } from './main';
import { HomePage } from './pages/home/homePage';
import { RegisterPage } from './pages/join/registerPage';
import { PostPage } from './pages/post/postPage';
import { ErrorBoundary } from './shared/error/errorBoundary';
import { NavigationProvider } from './shared/navigation/navigationProvider';
import { PresenterProvider } from './shared/presenters/presentersContext';
import { SpinnerProvider } from './shared/spinner/spinnerContext';
import { StoreProvider } from './shared/store/storesContext';

const App = () => {
  return (
    <ErrorBoundary>
      <StoreProvider stores={stores}>
        <SpinnerProvider>
          <PresenterProvider presenters={presenters}>
            <BrowserRouter>
              <NavigationProvider>
                <ToastContainer />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/join" element={<RegisterPage />} />
                  <Route path="/posts/:slug" element={<PostPage />} />
                </Routes>
              </NavigationProvider>
            </BrowserRouter>
          </PresenterProvider>
        </SpinnerProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;
