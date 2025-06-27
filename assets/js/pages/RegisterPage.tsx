import React, { ChangeEvent, FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { FieldError } from "../components/field_error";

const RegisterPage = () => {
  const formData = useForm({
    name: "",
    nickname: "",
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <h1 className="text-center text-3xl font-extrabold text-gray-900">회원가입</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              버추얼 아뜰리에에 가입하여 서비스를 시작하세요
            </p>
          </div>

          {/* 일반 오류 메시지 */}
          <FieldError error={formData.errors.general} />

          <form
            id="register-form"
            className="space-y-6"
            onSubmit={handleSubmit}
            noValidate={true}
          >
            {/* 이름 */}
            <fieldset className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.data.name}
                onChange={handleInput}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이름을 입력해주세요"
                autoComplete="name"
              />
              <FieldError error={formData.errors.name} />
            </fieldset>

            {/* 닉네임 */}
            <fieldset className="space-y-1">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                name="nickname"
                value={formData.data.nickname}
                onChange={handleInput}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="닉네임을 입력해주세요"
                autoComplete="nickname"
              />
              <FieldError error={formData.errors.nickname} />
            </fieldset>

            {/* 이메일 */}
            <fieldset className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.data.email}
                onChange={handleInput}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이메일을 입력해주세요"
                autoComplete="email"
              />
              <FieldError error={formData.errors.email} />
            </fieldset>

            {/* 비밀번호 */}
            <fieldset className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.data.password}
                onChange={handleInput}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호를 입력해주세요"
                autoComplete="new-password"
              />
              <FieldError error={formData.errors.password} />
            </fieldset>

            {/* 비밀번호 확인 */}
            <fieldset className="space-y-1">
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                value={formData.data.password_confirmation}
                onChange={handleInput}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호를 다시 입력해주세요"
                autoComplete="new-password"
              />
              <FieldError error={formData.errors.password_confirmation} />
            </fieldset>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={formData.processing}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {formData.processing ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
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
