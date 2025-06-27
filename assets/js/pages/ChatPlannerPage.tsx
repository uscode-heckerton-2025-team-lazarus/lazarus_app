import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import {
  MapPin,
  Calendar,
  Send,
  Bot,
  User,
  Clock,
  Navigation,
} from "lucide-react";

const ChatPlannerPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "안녕하세요! 🌍 여행 계획을 도와드릴게요. 어떤 여행을 원하시나요?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUserMessage, setHasUserMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const travelSuggestions = [
    {
      id: 1,
      destination: "제주도",
      duration: "2박 3일",
      budget: "20만원",
      highlights: ["한라산", "성산일출봉", "우도", "흑돼지"],
      image: "/images/jeju.jpg",
      tags: ["자연", "힐링", "국내"],
    },
    {
      id: 2,
      destination: "부산",
      duration: "1박 2일",
      budget: "15만원",
      highlights: ["해운대", "감천마을", "자갈치시장", "태종대"],
      image: "/images/busan.jpg",
      tags: ["바다", "도시", "맛집"],
    },
    {
      id: 3,
      destination: "경주",
      duration: "1박 2일",
      budget: "12만원",
      highlights: ["불국사", "석굴암", "첨성대", "안압지"],
      image: "/images/gyeongju.jpg",
      tags: ["역사", "문화", "전통"],
    },
  ];

  const quickQuestions = [
    "가족 여행 추천해주세요",
    "혼자 여행하기 좋은 곳은?",
    "예산 10만원으로 갈 수 있는 곳",
    "주말에 다녀올 수 있는 곳",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        type: "user",
        content: inputMessage,
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage]);
      setInputMessage("");
      setIsTyping(true);

      // Set hasUserMessage to true after first user message
      if (!hasUserMessage) {
        setHasUserMessage(true);
      }

      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: "bot",
          content:
            "좋은 질문이네요! 조금 더 구체적으로 알려주시면 더 정확한 추천을 드릴 수 있어요. 여행 인원, 예산, 선호하는 활동 등을 말씀해주세요.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  // Map Component
  const MapComponent = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <div className="flex items-center mb-3">
        <Navigation className="h-5 w-5 mr-2 text-blue-500" />
        <h3 className="font-semibold text-gray-900">여행 지도</h3>
      </div>
      <div className="bg-gray-100 rounded-lg flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-2" />
          <p>지도가 여기에 표시됩니다</p>
        </div>
      </div>
    </div>
  );

  // Travel Schedule Component
  const TravelScheduleComponent = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full">
      <div className="flex items-center mb-3">
        <Calendar className="h-5 w-5 mr-2 text-green-500" />
        <h3 className="font-semibold text-gray-900">여행 일정</h3>
      </div>
      <div className="space-y-3">
        <div className="border-l-4 border-blue-500 pl-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Day 1 - 오전 9:00</span>
          </div>
          <p className="font-medium text-gray-900">여행지 도착</p>
        </div>
        <div className="border-l-4 border-green-500 pl-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Day 1 - 오후 2:00</span>
          </div>
          <p className="font-medium text-gray-900">주요 관광지 방문</p>
        </div>
        <div className="border-l-4 border-purple-500 pl-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Day 1 - 저녁 7:00</span>
          </div>
          <p className="font-medium text-gray-900">저녁 식사</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gray-50">
      {!hasUserMessage ? (
        // Initial chat-only layout
        <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* 헤더 */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center mb-2">
                <Bot className="h-8 w-8 mr-3 text-blue-500" />
                여행 플래너 AI
              </h1>
              <p className="text-lg text-gray-600">
                맞춤형 여행 계획을 세워드립니다
              </p>
            </div>

            {/* 채팅 영역 */}
            <div className="bg-white rounded-xl shadow-lg">
              {/* 메시지 영역 */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-md items-start space-x-3 ${
                        message.type === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          message.type === "user"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-xl ${
                          message.type === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="여행 계획에 대해 무엇이든 물어보세요..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Layout after first message: map + schedule + compact chat
        <div className="min-h-[calc(100vh-180px)] p-4 space-y-4">
          {/* Top row: Travel Schedule (left 1/3) and Map (right 2/3) */}
          <div className="grid grid-cols-3 gap-4 h-[500px]">
            <TravelScheduleComponent />
            <div className="col-span-2 h-full">
              <MapComponent />
            </div>
          </div>

          {/* Bottom row: Compact chat */}
          <div
            className="bg-white rounded-lg shadow-lg flex flex-col"
            style={{ height: "calc(100vh - 32rem)" }}
          >
            {/* Chat header */}
            <div className="border-b border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-500" />
                여행 플래너 AI
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-md items-start space-x-2 ${
                      message.type === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === "user" ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="여행 계획에 대해 무엇이든 물어보세요..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPlannerPage;
