import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";

import {
  MessageCircle,
  Send,
  Calendar,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message:
        "안녕하세요! 🌟 여행 계획 도우미입니다. 어떤 여행을 계획하고 계신가요?",
    },
  ]);
  const chatMessagesRef = useRef(null);

  // 슬라이드 데이터
  const slides = [
    {
      title: "AI 여행 계획",
      subtitle: "인공지능과 함께 완벽한 여행을 계획하세요",
      description: "ChatGPT처럼 대화하며 개인 맞춤형 여행 일정을 만들어보세요",
      backgroundImage: "/images/slide1.jpg",
    },
    {
      title: "스마트 여행 어시스턴트",
      subtitle: "똑똑한 여행 어시스턴트가 모든 것을 도와드립니다",
      description:
        "목적지, 예산, 취향을 알려주시면 최적의 여행 계획을 제안해드립니다",
      backgroundImage: "/images/slide2.jpg",
    },
    {
      title: "개인 맞춤 추천",
      subtitle: "나만을 위한 특별한 여행 추천",
      description:
        "AI가 분석한 데이터로 당신에게 딱 맞는 여행지와 일정을 추천합니다",
      backgroundImage: "/images/slide3.jpg",
    },
  ];

  // 여행 플래닝 기능 데이터
  const features = [
    {
      id: 1,
      title: "맞춤형 일정 제안",
      icon: <Calendar className="h-8 w-8" />,
      description:
        "여행 기간, 예산, 선호도를 입력하면 AI가 최적의 일정을 자동으로 생성해드립니다. 숙박, 교통, 관광지까지 모든 것을 포함합니다.",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "실시간 대화형 상담",
      icon: <MessageCircle className="h-8 w-8" />,
      description:
        "ChatGPT처럼 자연스럽게 대화하며 여행 계획을 세울 수 있습니다. 언제든지 질문하고 계획을 수정할 수 있어요.",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "글로벌 여행지 정보",
      icon: <Globe className="h-8 w-8" />,
      description:
        "전 세계 여행지의 최신 정보와 현지 팁을 제공합니다. 숨겨진 명소부터 현지인 추천 맛집까지 모든 정보를 확인하세요.",
      color: "bg-purple-500",
    },
  ];

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (userMessage.trim()) {
      const newUserMessage = {
        id: chatMessages.length + 1,
        type: "user",
        message: userMessage,
      };

      // 간단한 봇 응답 시뮬레이션
      const botResponse = {
        id: chatMessages.length + 2,
        type: "bot",
        message:
          "좋은 질문이네요! 더 자세한 정보를 원하시면 저희 서비스를 이용해보세요. 완전한 여행 계획을 생성하려면 아래 버튼을 클릭하여 개인 맞춤형 여행 일정을 만들어보세요.",
      };

      setChatMessages([...chatMessages, newUserMessage, botResponse]);
      setUserMessage("");

      // 메시지 추가 후 스크롤을 아래로 이동
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop =
            chatMessagesRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 히어로 섹션 */}
      <section className="relative h-screen bg-black text-white overflow-hidden">
        {/* 배경 이미지 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${slides[currentSlide].backgroundImage})`,
          }}
        />
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/80">
          <div className="h-full bg-gradient-to-r from-blue-900/10 to-purple-900/20" />
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-blue-400 text-sm font-light tracking-[0.3em] uppercase">
              Smart Travel Planning Assistant
            </div>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-8"></div>
            <p className="text-2xl mb-6 font-light max-w-3xl mx-auto leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
            <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              {slides[currentSlide].description}
            </p>
            <button className="group relative bg-transparent border border-white/30 text-white px-12 py-4 text-sm font-light tracking-[0.2em] uppercase hover:border-blue-400 transition-all duration-500 overflow-hidden">
              <span className="relative z-10">여행 계획 시작하기</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>

        {/* 슬라이드 컨트롤 */}
        <button
          onClick={prevSlide}
          className="absolute left-12 top-1/2 transform -translate-y-1/2 w-14 h-14 border border-white/20 flex items-center justify-center hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 w-14 h-14 border border-white/20 flex items-center justify-center hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* 슬라이드 인디케이터 */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative transition-all duration-300 ${
                index === currentSlide
                  ? "w-12 h-1 bg-blue-400"
                  : "w-6 h-1 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI 여행 플래너의 특별한 기능들
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ChatGPT처럼 자연스럽게 대화하며 나만의 완벽한 여행을 계획해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 챗봇 체험 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              지금 바로 여행 계획을 시작해보세요
            </h2>
            <p className="text-xl text-gray-600">
              AI 어시스턴트와 대화하며 맞춤형 여행 계획을 받아보세요
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* 채팅 헤더 */}
            <div className="bg-blue-500 text-white p-4 flex items-center">
              <MessageCircle className="h-6 w-6 mr-3" />
              <h3 className="text-lg font-semibold">
                여행 플래닝 AI 어시스턴트
              </h3>
              <div className="ml-auto flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm">온라인</span>
              </div>
            </div>

            {/* 채팅 메시지 */}
            <div
              ref={chatMessagesRef}
              className="h-96 overflow-y-auto p-6 space-y-4"
            >
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* 여행 계획 생성 버튼 */}
            <div className="border-t p-4">
              <div className="mb-4 text-center">
                <Link
                  href="/chatplan"
                  className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-decoration-none"
                >
                  🗺️ 여행 계획 생성하기
                </Link>
              </div>

              {/* 메시지 입력 */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="여행에 대해 무엇이든 물어보세요..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
                >
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
