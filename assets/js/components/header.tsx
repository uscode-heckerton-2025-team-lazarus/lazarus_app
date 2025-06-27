import React from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import { Plane, LogIn, UserPlus, LogOut } from "lucide-react";

const Header = () => {
  const { props } = usePage();
  const user = props.user;
  const { post } = useForm();

  const handleLogout = () => {
    post("users/logout");
  };

  return (
    <header className="bg-white px-8 py-6">
      <div className="max-w-full flex justify-between items-center relative">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-4xl font-bold text-gray-900 font-gugi">
            의성 트립봇
          </Link>
        </div>

        <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-12">
          <Link
            href="/chatplan"
            className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
          >
            여행 계획
          </Link>
          <a
            href="#destinations"
            className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
          >
            인기 여행지
          </a>
          <a
            href="#guide"
            className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
          >
            여행 가이드
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">안녕하세요, {user.email}님</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/register"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <UserPlus size={16} />
                <span>회원가입</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn size={16} />
                <span>로그인</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
