import React, { ChangeEvent, FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { FieldError } from "../components/field_error";
import "../../css/login.css";

const LoginPage = () => {
  const formData = useForm({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    formData.setData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formData.post("/login", {
      onSuccess: () => {
        window.location.href = "/";
      },
      onError: (errors) => {
        console.error("로그인 오류:", errors);
      },
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">로그인</h1>
            <p className="login-subtitle">
              버추얼 아뜰리에에 다시 오신 것을 환영합니다
            </p>
          </div>

          {/* 일반 오류 메시지 */}
          <FieldError error={formData.errors.general} />

          <form
            id="login-form"
            className="login-form"
            onSubmit={handleSubmit}
            noValidate={true}
          >
            {/* 이메일 */}
            <fieldset className="form-group">
              <input
                type="email"
                name="email"
                value={formData.data.email}
                onChange={handleInput}
                className="form-control form-control-lg"
                placeholder="이메일을 입력해주세요"
                autoComplete="email"
              />
            </fieldset>

            {/* 비밀번호 */}
            <fieldset className="form-group">
              <input
                type="password"
                name="password"
                value={formData.data.password}
                onChange={handleInput}
                className="form-control form-control-lg"
                placeholder="비밀번호를 입력해주세요"
                autoComplete="current-password"
              />
              <FieldError error={formData.errors.password} />
            </fieldset>

            {/* 로그인 옵션 */}
            <fieldset className="login-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.data.rememberMe}
                  onChange={handleInput}
                />
                <span className="checkbox-text">로그인 상태 유지</span>
              </label>

              <a href="/forgot-password" className="forgot-password-link">
                비밀번호를 잊으셨나요?
              </a>
            </fieldset>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={formData.processing}
              className={`submit-btn ${formData.processing ? "loading" : ""}`}
            >
              {formData.processing ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              아직 계정이 없으신가요?{" "}
              <a href="/register" className="register-link">
                회원가입
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;