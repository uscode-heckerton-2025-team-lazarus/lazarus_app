import React, { ChangeEvent, FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { FieldError } from "../components/field_error";

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <h1 className="text-center text-3xl font-extrabold text-gray-900">
              로그인
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              버추얼 아뜰리에에 다시 오신 것을 환영합니다
            </p>
          </div>

          <form
            id="login-form"
            className="space-y-6"
            onSubmit={handleSubmit}
            noValidate={true}
          >
            {/* 이메일 */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.data.email}
                onChange={handleInput}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이메일을 입력해주세요"
                autoComplete="email"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.data.password}
                onChange={handleInput}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호를 입력해주세요"
                autoComplete="current-password"
              />
              {/* 일반 오류 메시지 */}
              <FieldError error={formData.errors.general} />
            </div>

            {/* 로그인 옵션 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.data.rememberMe}
                  onChange={handleInput}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 block text-sm text-gray-900">
                  로그인 상태 유지
                </span>
              </label>

              <a
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                비밀번호를 잊으셨나요?
              </a>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={formData.processing}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {formData.processing ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              아직 계정이 없으신가요?{" "}
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
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
