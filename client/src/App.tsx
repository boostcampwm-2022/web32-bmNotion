import React from 'react';
import { Provider } from 'jotai';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import MainPage from '@/pages/MainPage';
import GlobalStyle from '@/styles/GlobalStyle';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from './pages/Test';

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/test" element={<Test />}></Route>
            <Route path="/" element={<Login />}></Route>
            <Route path="/signin" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="*" element={<div>404 Not Found Page</div>}></Route>
            <Route path="/page/:pageid" element={<MainPage />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}
