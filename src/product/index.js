import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Button, message, InputNumber } from "antd";
import { useParams, useNavigate } from "react-router-dom";

function ProductPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // 상품 개수를 지정하는 state 추가
  const [user, setUser] = useState(null); // 사용자 정보 상태 추가

  const getProduct = useCallback(() => {
    axios
      .get(`${API_URL}/products/${params.id}`)
      .then(function (result) {
        setProduct(result.data.product);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [params.id]);

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

  useEffect(
    function () {
      getProduct();
      fetchUserData();
    },
    [params.id, getProduct]
  );

  if (product === null) {
    return <h1>상품 정보를 받고 있습니다...</h1>;
  }
  const onClickAddToCart = () => {
    axios
      .post(
        `${API_URL}/api/cart/add`,
        {
          userMail: user?.usermail, // userId 대신 userMail 전송
          productId: params.id,
          quantity: quantity,
        },
        { withCredentials: true }
      )
      .then((result) => {
        message.info("장바구니에 추가되었습니다");
      })
      .catch((error) => {
        message.error(`장바구니 추가 중 에러가 발생했습니다. ${error.message}`);
      });
  };
  const onClickPurchase = () => {
    axios
      .post(`${API_URL}/purchase/${params.id}`, {
        userMail: user?.usermail, // 사용자 이메일
        quantity: quantity, // 구매 수량
      })
      .then((result) => {
        message.info("구매가 완료되었습니다");
        navigate("/");
      })
      .catch((error) => {
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };

  const onQuantityChange = (value) => {
    setQuantity(value);
  };

  return (
    <div>
      <div id="image-box">
        <img src={`${API_URL}/${product.imageUrl}`} alt="Product" />
      </div>
      <div id="profile-box">
        <img src="/images/icons/avatar.png" alt="Seller" />
        <span>{product.seller}</span>
      </div>
      <div id="contents-box">
        <div id="name">{product.name}</div>
        <div id="price">{product.price.toLocaleString()}원</div>
        <div id="createdAt">
          {dayjs(product.createdAt).format("YYYY년 MM월 DD일")}
        </div>
        <InputNumber
          id="quantity-input"
          min={1}
          max={product.soldout}
          defaultValue={quantity}
          onChange={onQuantityChange}
        />
        <Button
          id="purchase-button"
          size="large"
          type="primary"
          danger
          onClick={onClickPurchase}
          disabled={product.soldout === 0}
        >
          즉시 구매하기
        </Button>
        <Button
          id="add-to-cart-button"
          size="large"
          onClick={onClickAddToCart}
          disabled={product.soldout === 0}
        >
          장바구니에 추가하기
        </Button>
        <pre id="description">{product.description}</pre>
      </div>
    </div>
  );
}

export default ProductPage;
