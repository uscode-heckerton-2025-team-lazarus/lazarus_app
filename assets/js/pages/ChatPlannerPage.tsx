import React, { useState, useEffect, useRef } from "react";
import { Link, router } from "@inertiajs/react";
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
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState("chat"); // "chat" or "planner"
  const [travelPlan, setTravelPlan] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const createConversation = async () => {
    console.log("🚀 Creating conversation...");
    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      console.log("📝 CSRF Token:", csrfToken);

      const response = await fetch("/chatplan/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      });

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Conversation created:", data);
        setConversationId(data.conversation_id);

        const initialMessage = {
          id: 1,
          type: "bot",
          content:
            "안녕하세요! 🌍 여행 계획을 도와드릴게요. 어떤 여행을 원하시나요?",
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
        setIsInitialized(true);
      } else {
        const errorText = await response.text();
        console.error(
          "❌ Failed to create conversation:",
          response.status,
          errorText,
        );
      }
    } catch (error) {
      console.error("💥 Error creating conversation:", error);
    }
  };

  useEffect(() => {
    console.log("🔄 useEffect triggered - isInitialized:", isInitialized);
    if (!isInitialized) {
      createConversation();
    }
  }, [isInitialized]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveChat = async (content, type) => {
    if (!conversationId) {
      console.log("❌ No conversation ID, skipping save");
      return;
    }

    console.log("💬 Saving chat:", { content, type, conversationId });
    try {
      const response = await fetch(
        `/chatplan/conversations/${conversationId}/chats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content"),
          },
          body: JSON.stringify({
            content: content,
            type: type,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Chat saved:", data);
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to save chat:", response.status, errorText);
      }
    } catch (error) {
      console.error("💥 Error saving chat:", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && conversationId) {
      const userMessage = {
        id: messages.length + 1,
        type: "user",
        content: inputMessage,
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage]);
      const currentMessage = inputMessage;
      setInputMessage("");

      // 유저 메시지 저장
      await saveChat(currentMessage, "user");

      setIsTyping(true);

      setTimeout(async () => {
        const botResponse = {
          id: messages.length + 2,
          type: "bot",
          content:
            "좋은 질문이네요! 조금 더 구체적으로 알려주시면 더 정확한 추천을 드릴 수 있어요. 여행 인원, 예산, 선호하는 활동 등을 말씀해주세요.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);

        // 봇 응답 저장
        await saveChat(botResponse.content, "bot");
      }, 1500);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const handleGeneratePlan = () => {
    // 채팅 데이터를 기반으로 여행 계획 생성
    const planData = {
      destination: "제주도",
      duration: "2박 3일",
      budget: "30만원",
      travelers: "2명",
      schedule: [
        {
          day: 1,
          activities: [
            { time: "09:00", activity: "제주공항 도착", location: "제주공항" },
            { time: "11:00", activity: "렌터카 픽업", location: "제주공항" },
            { time: "13:00", activity: "점심식사", location: "흑돼지 맛집" },
            { time: "15:00", activity: "성산일출봉", location: "성산일출봉" },
            { time: "18:00", activity: "저녁식사", location: "성산포" },
            { time: "20:00", activity: "숙소 체크인", location: "호텔" },
          ],
        },
        {
          day: 2,
          activities: [
            { time: "08:00", activity: "조식", location: "호텔" },
            { time: "10:00", activity: "한라산 등반", location: "한라산" },
            { time: "15:00", activity: "점심식사", location: "한라산 주변" },
            { time: "17:00", activity: "우도 관광", location: "우도" },
            { time: "19:00", activity: "저녁식사", location: "우도" },
          ],
        },
      ],
    };

    setTravelPlan(planData);
    setCurrentView("planner");
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
    <div className="bg-white rounded-lg shadow-lg p-4 h-full overflow-y-auto">
      <div className="flex items-center mb-3">
        <Calendar className="h-5 w-5 mr-2 text-green-500" />
        <h3 className="font-semibold text-gray-900">여행 일정</h3>
      </div>
      <div className="space-y-4">
        {travelPlan?.schedule?.map((day, dayIndex) => (
          <div key={dayIndex} className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 bg-gray-50 px-3 py-2 rounded-lg">
              Day {day.day}
            </h4>
            <div className="space-y-3">
              {day.activities.map((activity, activityIndex) => (
                <div
                  key={activityIndex}
                  className="border-l-4 border-blue-500 pl-3"
                >
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{activity.time}</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {activity.activity}
                  </p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gray-50">
      {currentView === "chat" ? (
        // 채팅 화면
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
              <div
                ref={messagesContainerRef}
                className="h-96 overflow-y-auto p-6 space-y-4 scroll-smooth"
              >
                {!isInitialized ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-gray-500">대화를 시작하는 중...</div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* 입력 영역 */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex space-x-4 mb-4">
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

                {/* 여행 계획 생성 버튼 */}
                {messages.length > 2 && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleGeneratePlan}
                      className="bg-green-500 text-white rounded-lg px-8 py-3 hover:bg-green-600 transition-colors font-medium"
                    >
                      여행 계획 생성하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 여행 계획 화면
        <div className="min-h-[calc(100vh-180px)] p-4 space-y-4">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-green-500" />
                  {travelPlan?.destination} 여행 계획
                </h1>
                <p className="text-gray-600 mt-1">
                  {travelPlan?.duration} | {travelPlan?.travelers} |{" "}
                  {travelPlan?.budget}
                </p>
              </div>
              <button
                onClick={() => setCurrentView("chat")}
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
              >
                채팅으로 돌아가기
              </button>
            </div>
          </div>

          {/* 여행 계획 상세 */}
          <div className="grid grid-cols-3 gap-4 h-[500px]">
            <TravelScheduleComponent />
            <div className="col-span-2 h-full">
              <MapComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPlannerPage;
