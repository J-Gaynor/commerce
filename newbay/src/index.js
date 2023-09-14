import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import './index.css';
import App from './App';
import listingsReducer from './slices/listingsSlice';

const rootReducer = combineReducers({
  listings: listingsReducer
});

const store = configureStore({
  reducer: rootReducer,
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);



