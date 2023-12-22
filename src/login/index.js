import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

function LoginPage() {
  const [usermail, setUsermail] = useState("");
  const [userpw, setUserpw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    axios
      .post(
        "http://localhost:8080/login", // API_URL에 맞는 주소로 변경
        {
          usermail,
          userpw,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.flag === 1) {
          console.log(response.data.flag);
          navigate("/productList"); // flag가 1인 경우에만 업로드 페이지로 이동
        } else {
          console.log(response.data.flag);
          navigate("/"); // 그 외에는 메인 페이지로 이동
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error("로그인 에러: ", error);
        setErrorMessage(
          error.response?.data?.message ||
            "로그인에 실패했습니다. 아이디 또는 비밀번호를 확인하세요."
        );
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>로그인</h1>
        <div className="form-group">
          <label htmlFor="usermail">이메일:</label>
          <input
            type="text"
            id="usermail"
            name="usermail"
            value={usermail}
            onChange={(e) => setUsermail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="userpw">비밀번호:</label>
          <input
            type="password"
            id="userpw"
            value={userpw}
            onChange={(e) => setUserpw(e.target.value)}
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          로그인
        </button>
        <p className="signup-link">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
