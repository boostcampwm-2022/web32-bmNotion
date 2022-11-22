import React from 'react';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import MainPage from '@/pages/MainPage';
import GlobalStyle from '@/styles/GlobalStyle';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signin" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="*" element={<div>404 Not Found Page</div>}></Route>
          <Route path="/mainpage" element={<MainPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
