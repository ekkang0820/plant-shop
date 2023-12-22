import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants.js";
import { Link } from "react-router-dom";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  // 서버로부터 제품 목록을 가져오는 함수
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.error("제품 목록을 가져오는 중 오류 발생:", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 제품 목록을 불러옵니다.
  useEffect(() => {
    fetchProducts();
  }, []);

  // 제품 삭제 함수
  const deleteProduct = async (productId) => {
    try {
      // 서버로 제품 삭제 요청을 보냅니다.
      await axios.delete(`${API_URL}/products/${productId}`);
      // 삭제된 제품을 상태에서 제거합니다.
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("제품 삭제 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <h1>제품 목록</h1>
      <table>
        <thead>
          <tr>
            <th>사진</th>
            <th>상품명</th>
            <th>가격</th>
            <th>재고</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={`${API_URL}/${product.imageUrl} `}
                  alt={product.name}
                  width="100"
                />
              </td>
              <td>
                <Link to={`/productEdit/${product.id}`}>{product.name}</Link>
                {/* 제품 수정 페이지로 이동하는 Link를 추가합니다. */}
              </td>

              <td>{product.price}원</td>
              <td>{product.soldout}</td>
              <td>
                <button onClick={() => deleteProduct(product.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListPage;
