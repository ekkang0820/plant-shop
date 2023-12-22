import { useParams } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";
//import { API_URL } from "../config/constants";
import dayjs from "dayjs";
//import { Button, message } from "antd";

function JoinPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const validateEmail = (email) => {
    return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  };
  const handleSignup = async () => {
    try {
      // 서버로 회원가입 정보 전송
      if (!validateEmail(email)) {
        alert("유효하지 않은 이메일 형식입니다.");
        return;
      }
      const response = await axios.post("http://localhost:8080/signup", {
        usermail: email, // 데이터베이스 필드 이름과 일치
        userpw: password, // 데이터베이스 필드 이름과 일치
        username: name, // 데이터베이스 필드 이름과 일치
        address: address, // 데이터베이스 필드 이름과 일치
        birth: dayjs(birthdate).format("YYYY-MM-DD"), // 데이터베이스 포맷에 맞게 변환
        flag: 0,
      });

      // 회원가입 성공 시 처리
      alert("회원가입 성공:");
      setEmail("");
      setPassword("");
      setName("");
      setAddress("");
      setBirthdate("");

      //history.push("/login"); // 로그인 페이지로 이동
    } catch (error) {
      alert("에러 발생:", error);
      // 에러 처리 로직
    }
  };

  const handleCheckEmail = async () => {
    // 먼저 이메일 유효성 검사
    if (!validateEmail(email)) {
      alert("유효하지 않은 이메일 형식입니다.");
      return;
    }

    try {
      // 서버에 이메일 중복 체크 요청
      const response = await axios.post("http://localhost:8080/check-email", {
        email,
      });

      // 서버 응답에 따라 사용자에게 알림
      alert("이메일 중복 체크 결과: " + response.data.message);
    } catch (error) {
      // 오류 발생 시
      alert("에러 발생: " + error.response.data.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>회원가입</h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="check-email" onClick={handleCheckEmail}>
            Check Email
          </button>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="주소"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            placeholder="생년월일"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button onClick={handleSignup}>Signup</button>
          <a href="/login" className="login-link">
            이미 회원이신가요?
          </a>
        </div>
      </div>
    </div>
  );
}

export default JoinPage;
