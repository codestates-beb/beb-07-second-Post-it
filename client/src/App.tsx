import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import Mint from "./pages/Mint";
import Login from './pages/Login';
import Market from "./pages/Market";
import SignUp from "./pages/SignUp";
import Post from "./pages/Post";

import Header from "./components/Header";

function App() {

  const [isLogin, setIsLogin] = useState(false)
  
  useEffect(() => {
    if(sessionStorage.getItem('user_id') === null){
      // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 없다면
    } else {
      // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 있다면
      // 로그인 상태 변경
      setIsLogin(true)
    }
  })

  return (
    <div>
      <Header isLogin={isLogin} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage /> } />
          <Route path="/mypage" element={<MyPage /> } />
          <Route path='/market' element={<Market />} />
          <Route path="/mint" element={<Mint /> } />
          <Route path="/login" element={<Login /> } />
          <Route path="/signup" element={<SignUp /> } />
          <Route path='/post' element={<Post />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
