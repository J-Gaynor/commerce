import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './index.css';
import App from './App';
import listingsReducer from './slices/listingsSlice';
import loginReducer from './slices/loginSlice';
import itemListingSlice from './slices/itemListingSlice';

const rootReducer = combineReducers({
  listings: listingsReducer,
  login: loginReducer,
  item: itemListingSlice,
});

const store = configureStore({
  reducer: rootReducer,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="872310213387-mghgc83v82vfs3e1f82q4a9g52kqpu8u.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>
);