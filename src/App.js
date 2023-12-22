import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import "./App.css";
import MainPageComponent from "./main";
import ProductPage from "./product";
import UploadPage from "./upload";
import LoginPage from "./login";
import JoinPage from "./signup";
import CartPage from "./cart";
import PurchaseHistoryPage from "./purchaseHistory";
import ProductListPage from "./productList";
import ProductEditPage from "./productEdit";
import DashboardPage from "./dashboard";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userFlag, setUserFlag] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user", {
        withCredentials: true,
      });
      const data = response.data;
      if (data.usermail) {
        setIsLoggedIn(true);
        setUserFlag(data.flag);
      } else {
        setIsLoggedIn(false);
        setUserFlag(null);
      }
    } catch (error) {
      console.error("로그인 상태 확인에 실패: ", error);
      setIsLoggedIn(false);
      setUserFlag(null);
    }
  };

  const logout = async () => {
    try {
      // 사용자 정보 초기화
      setIsLoggedIn(false);
      setUserFlag(null);

      // 로그아웃 요청 보내기
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );

      // 홈 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("로그아웃에 실패: ", error);
      // 오류 처리 로직...
    }
  };

  return (
    <div>
      <div id="header">
        <div id="header-area">
          <Link to={isLoggedIn && userFlag === 1 ? "/upload" : "/"}>
            <img src="/images/icons/logo.png" alt="Logo" />
          </Link>
          {isLoggedIn && userFlag === 1 ? (
            <>
              <Button
                size="large"
                onClick={() => navigate("/upload")}
                icon={<DownloadOutlined />}
              >
                상품 업로드
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/productList")} // ProductListPage로 이동
              >
                상품 목록
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/dashboard")} // 대시보드 페이지로 이동
              >
                대시보드
              </Button>
            </>
          ) : null}
          {isLoggedIn && userFlag === 0 ? (
            <>
              <Button size="large" onClick={() => navigate("/cart")}>
                장바구니
              </Button>
              <Button size="large" onClick={() => navigate("/purchaseHistory")}>
                구매 내역
              </Button>
              <Button size="large" onClick={logout}>
                로그아웃
              </Button>
            </>
          ) : isLoggedIn ? (
            <Button size="large" onClick={logout}>
              로그아웃
            </Button>
          ) : (
            <Button size="large" onClick={() => navigate("/login")}>
              로그인
            </Button>
          )}
        </div>
      </div>
      <div id="body">
        <Routes>
          <Route path="/" element={<MainPageComponent />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<JoinPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/purchaseHistory" element={<PurchaseHistoryPage />} />
          <Route path="/productList" element={<ProductListPage />} />
          <Route path="/productEdit/:id" element={<ProductEditPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
      <div id="footer"></div>
    </div>
  );
}

export default App;
