import React from "react";
import { MapPin, Instagram, MessageCircle, Plane } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-full px-8">
        <div className="grid grid-cols-4 gap-16 mb-12">
          {/* 브랜드 정보 */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <h5 className="text-4xl font-bold font-gugi">의성 트립봇</h5>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm">
              ChatGPT처럼 대화하며 맞춤형 여행 계획을 만들어주는 AI 여행
              플래너입니다. 어디든 가고 싶은 곳을 말씀해주시면 완벽한 일정을
              제안해드립니다.
            </p>
            <div className="flex space-x-6">
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <MessageCircle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* 전시 메뉴 */}
          <div>
            <h6 className="text-lg font-semibold mb-8">여행 서비스</h6>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  맞춤형 일정 제안
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  AI 여행 상담
                </a>
              </li>
            </ul>
          </div>

          {/* 작가 메뉴 */}
          <div>
            <h6 className="text-lg font-semibold mb-8">여행 계획</h6>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  새 여행 계획
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  내 여행 목록
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  여행 일정 수정
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  여행 팁 & 가이드
                </a>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h6 className="text-lg font-semibold mb-8">고객지원</h6>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  문의하기
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  이용 안내
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  공지사항
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 트래블 AI. All rights reserved.
            </p>
            <div className="flex space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                이용약관
              </a>
              <a href="#" className="hover:text-white transition-colors">
                개인정보처리방침
              </a>
              <a href="#" className="hover:text-white transition-colors">
                쿠키정책
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
