import React from "react";
import { Link } from "@inertiajs/react";
import { Plane } from "lucide-react";

const Header = () => {
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
      </div>
    </header>
  );
};

export default Header;
