import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import "./index.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cart`, { withCredentials: true })
      .then(async (response) => {
        const cartData = response.data;
        console.log(cartData);
        const cartItemsWithProductInfo = await Promise.all(
          cartData.map(async (item) => {
            const productResponse = await axios.get(
              `${API_URL}/products/${item.productId}`
            );
            const productData = productResponse.data.product;

            // productName이 존재하는 항목만 포함
            if (productData.name) {
              return {
                ...item,
                productName: productData.name,
                productImage: productData.imageUrl,
              };
            }
            return item; // productName이 존재하지 않는 경우, 원래 항목 반환
          })
        );

        // productName이 존재하는 항목만 필터링하여 설정
        setCartItems(
          cartItemsWithProductInfo.filter((item) => item.productName)
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("장바구니 정보를 가져오는데 실패했습니다.", error);
        setIsLoading(false);
      });
  }, []);

  const handleRemoveFromCart = (itemId) => {
    axios
      .delete(`${API_URL}/api/cart/${itemId}`, {
        withCredentials: true,
      })
      .then((response) => {
        // 성공적으로 제거된 경우, 장바구니 목록에서 해당 항목을 필터링하여 제거합니다.
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
      })
      .catch((error) => {
        console.error("장바구니에서 상품을 제거하는데 실패했습니다.", error);
      });
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user`, {
        withCredentials: true,
      });
      const userData = response.data;
      setUser(userData); // 'user' 변수 설정
      console.log(userData.usermail);
    } catch (error) {
      console.error("사용자 정보를 가져오는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // user 상태가 변경될 때 한 번만 실행
  }, []); // 빈 의존성 배열로 설정

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((item) => item !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handlePurchase = () => {
    const selectedCartItems = cartItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.totalPrice, // 각 항목의 총 가격 추가
        userMail: user?.usermail,
      }));

    console.log("Selected cart items for purchase:", selectedCartItems);

    axios
      .post(`${API_URL}/api/cart/purchase`, selectedCartItems)
      .then((response) => {
        alert(response.data.message);
        setCartItems(
          cartItems.filter((item) => !selectedItems.includes(item.id))
        );
        setSelectedItems([]);
      })
      .catch((error) => {
        console.error("구매 중 오류 발생:", error);
        alert(
          "구매 중 오류가 발생했습니다: " +
            error.response.data.message +
            user.userMail
        );
      });
  };

  // 선택된 상품의 총 가격 계산
  const totalSelectedCartPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.totalPrice, 0);

  return (
    <div className="cart-page">
      <h1>장바구니</h1>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <div>
          {cartItems.length > 0 ? (
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="product-image-container">
                    <img
                      src={`${API_URL}/${item.productImage}`}
                      alt={item.productName}
                      className="product-image"
                    />
                  </div>
                  <div className="product-name">{item.productName}</div>
                  <div className="product-quantity">{item.quantity}</div>
                  <div className="product-price">
                    {item.totalPrice.toLocaleString()}원
                  </div>
                  <div className="product-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </div>
                  <div className="product-remove">
                    <button onClick={() => handleRemoveFromCart(item.id)}>
                      제거
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>장바구니가 비어 있습니다.</p>
          )}
          <div className="cart-summary">
            <p>
              선택된 상품 총 가격: {totalSelectedCartPrice.toLocaleString()}원
            </p>
            <button onClick={handlePurchase} className="purchase-button">
              구매하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
