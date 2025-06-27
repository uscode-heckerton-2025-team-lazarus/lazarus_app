import React, { ChangeEvent, FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { FieldError } from "../components/field_error";
import "../../css/login.css";

const RegisterPage = () => {
  const formData = useForm({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    formData.setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formData.post("/register", {
      onSuccess: () => {
        window.location.href = "/";
      },
      onError: (errors) => {
        console.error("회원가입 오류:", errors);
      },
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">회원가입</h1>
            <p className="login-subtitle">
              버추얼 아뜰리에에 가입하여 서비스를 시작하세요
            </p>
          </div>

          {/* 일반 오류 메시지 */}
          <FieldError error={formData.errors.general} />

          <form
            id="register-form"
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
              <FieldError error={formData.errors.email} />
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
                autoComplete="new-password"
              />
              <FieldError error={formData.errors.password} />
            </fieldset>

            {/* 비밀번호 확인 */}
            <fieldset className="form-group">
              <input
                type="password"
                name="password_confirmation"
                value={formData.data.password_confirmation}
                onChange={handleInput}
                className="form-control form-control-lg"
                placeholder="비밀번호를 다시 입력해주세요"
                autoComplete="new-password"
              />
              <FieldError error={formData.errors.password_confirmation} />
            </fieldset>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={formData.processing}
              className={`submit-btn ${formData.processing ? "loading" : ""}`}
            >
              {formData.processing ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              이미 계정이 있으신가요?{" "}
              <a href="/login" className="register-link">
                로그인
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;