/* import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants.js";
import { useParams, Link } from "react-router-dom";

const ProductEditPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    seller: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error("상품 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`${API_URL}/products/${id}`, product);
      alert("상품 정보가 업데이트되었습니다.");
    } catch (error) {
      console.error("상품 정보 업데이트 중 오류 발생:", error);
    }
  };

  return (
    <div className="product-edit-page">
      <h1>상품 수정 페이지</h1>
      <form>
        <div className="form-group">
          <label>상품명:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>가격:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>판매자:</label>
          <input
            type="text"
            name="seller"
            value={product.seller}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>설명:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>이미지 URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleUpdateProduct}>
          수정 완료
        </button>
      </form>
      <Link to="/productList" className="back-link">
        상품 목록으로 돌아가기
      </Link>
    </div>
  );
};

export default ProductEditPage;
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants.js";
import { useParams, Link } from "react-router-dom";
import "./index.css";

const ProductEditPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    seller: "",
    description: "",
    imageUrl: "",
  });
  const [inventory, setInventory] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data.product);
        setInventory(response.data.product.soldout); // 재고 초기값 설정
      } catch (error) {
        console.error("상품 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        ...product,
        soldout: inventory, // 재고 업데이트
      };
      await axios.put(`${API_URL}/products/${id}`, updatedProduct);
      alert("상품 정보가 업데이트되었습니다.");
    } catch (error) {
      console.error("상품 정보 업데이트 중 오류 발생:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${API_URL}/uploadImage`, formData);
      const imageUrl = response.data.imageUrl;
      setProduct({
        ...product,
        imageUrl: imageUrl,
      });
      alert("이미지 업로드가 완료되었습니다.");
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
    }
  };

  return (
    <div className="product-edit-page">
      <h1>상품 수정 페이지</h1>
      <form>
        <div className="form-group">
          <label>상품명:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>가격:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>판매자:</label>
          <input
            type="text"
            name="seller"
            value={product.seller}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>설명:</label>
          <textarea
            style={{ height: "150px" }}
            name="description"
            value={product.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>이미지 업로드:</label>
          {product.imageUrl && (
            <img
              style={{ width: "200px", height: "200px" }}
              src={`${API_URL}/${product.imageUrl}`}
              alt="Product"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="form-group">
          <label>재고:</label>
          <input
            type="number"
            name="inventory"
            value={inventory}
            onChange={(e) => setInventory(parseInt(e.target.value))}
          />
        </div>
        <button type="button" onClick={handleUpdateProduct}>
          수정 완료
        </button>
      </form>
      <Link to="/productList" className="back-link">
        상품 목록으로 돌아가기
      </Link>
    </div>
  );
};

export default ProductEditPage;
