import React, { useState, useEffect } from "react";
import axios from "axios";

function DashboardPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [purchases, setPurchases] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // fetchSales 함수를 정의
  async function fetchSales() {
    try {
      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = new Date(endDate).toISOString();

      const response = await axios.get(
        `http://localhost:8080/api/purchases?startDate=${isoStartDate}&endDate=${isoEndDate}`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      const total = data.reduce(
        (total, purchase) => total + purchase.totalPrice,
        0
      );

      setPurchases(data);
      setTotalSales(total);
    } catch (error) {
      console.error("매출 조회 에러:", error);
    }
  }

  useEffect(() => {
    fetchSales();
  }, [startDate, endDate]);

  return (
    <div>
      <h1>매출 확인 페이지</h1>
      <div>
        <label htmlFor="startDate">시작 날짜:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label htmlFor="endDate">종료 날짜:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={() => fetchSales()}>조회</button>
      </div>
      <h2>총 매출: {totalSales.toLocaleString()} 원</h2>
      <table>
        <thead>
          <tr>
            <th>구매 ID</th>
            <th>사용자 이메일</th>
            <th>상품 ID</th>
            <th>수량</th>
            <th>총 가격</th>
            <th>구매 날짜</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id}>
              <td>{purchase.id}</td>
              <td>{purchase.userMail}</td>
              <td>{purchase.productId}</td>
              <td>{purchase.quantity}</td>
              <td>{purchase.totalPrice.toLocaleString()} 원</td>
              <td>{purchase.purchasedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardPage;
