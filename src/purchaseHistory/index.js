import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import "./index.css"; // CSS 파일 추가

function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [userMail, setUserMail] = useState(null);

  useEffect(() => {
    // 사용자 정보를 가져오는 함수
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user`, {
          withCredentials: true,
        });
        setUserMail(response.data.usermail); // 사용자 이메일을 설정
        await fetchPurchaseHistory(response.data.usermail); // 구매 내역 조회
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 사용자의 구매 내역을 가져오는 함수
  const fetchPurchaseHistory = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/api/purchases/${email}`, {
        withCredentials: true,
      });
      console.log("구매 내역 데이터:", response.data); // 데이터 확인
      setPurchases(response.data.reverse()); // 역순으로 변경
      setLoading(false); // 데이터 로딩이 완료되었음을 표시
    } catch (error) {
      console.error("구매 내역 조회 실패:", error);
    }
  };

  return (
    <div className="container">
      <h1>구매 내역</h1>
      {loading ? (
        <div className="loading-spinner">
          <p className="loading">로딩 중...</p>
        </div>
      ) : (
        purchases.map((purchase) => (
          <div className="purchase" key={purchase.id}>
            <p className="product-name">상품 이름: {purchase.product.name}</p>
            <p className="product-id">상품 ID: {purchase.productId}</p>
            <img
              className="product-image"
              src={`${API_URL}/${purchase.product.imageUrl}`}
              alt={purchase.product.name}
            />
            <p className="quantity">수량: {purchase.quantity}</p>
            <p className="total-price">총 가격: {purchase.totalPrice}</p>
            <p className="purchase-date">
              구매 날짜: {new Date(purchase.purchasedAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default PurchaseHistoryPage;
