import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  Calendar,
  Globe,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";

// Leaflet 지도 컴포넌트 (제공된 예시 기반)
const MapComponent = ({ locations, itinerary }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markersLayer, setMarkersLayer] = useState(null);
  const [routeMarkersLayer, setRouteMarkersLayer] = useState(null);
  const [routeLayer, setRouteLayer] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // 의성군 중심 좌표 (제공된 예시와 동일)
  const UISEONG_CENTER = [36.3526576, 128.6970053];

  // Leaflet 라이브러리 로드 및 지도 초기화
  useEffect(() => {
    const loadLeaflet = async () => {
      // Leaflet CSS 로드 (제공된 예시와 동일)
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Leaflet JS 로드 (제공된 예시와 동일)
      if (!window.L) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => resolve(window.L);
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      return window.L;
    };

    const initializeMap = async () => {
      try {
        const L = await loadLeaflet();

        if (mapRef.current && !map) {
          // 지도 생성 (제공된 예시와 동일)
          const mapInstance = L.map(mapRef.current).setView(UISEONG_CENTER, 12);

          // 타일 레이어 추가 (제공된 예시와 동일)
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 18,
          }).addTo(mapInstance);

          // 레이어 그룹 생성 (제공된 예시와 동일)
          const markers = L.layerGroup().addTo(mapInstance);
          const routeMarkers = L.layerGroup().addTo(mapInstance);

          setMap(mapInstance);
          setMarkersLayer(markers);
          setRouteMarkersLayer(routeMarkers);
          setIsMapReady(true);

          console.log("Leaflet 지도 초기화 완료");
        }
      } catch (error) {
        console.error("Leaflet 로드 실패:", error);
      }
    };

    initializeMap();

    // 컴포넌트 언마운트 시 지도 정리
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // 마커 생성 함수 (제공된 예시 기반)
  const createMarker = (attraction, number, isRoute = false) => {
    if (!window.L) return null;

    const markerClass = isRoute ? "route-marker" : "custom-marker";
    const icon = window.L.divIcon({
      className: markerClass,
      html: `<div style="
        background-color: #e53e3e;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${number}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const marker = window.L.marker([attraction.lat, attraction.lng], {
      icon,
    }).bindPopup(createPopupContent(attraction));

    // 마커 클릭 이벤트 (제공된 예시와 동일)
    marker.on("click", () => {
      highlightAttraction(attraction);
    });

    // 마우스 오버 이벤트 (제공된 예시와 동일)
    marker.on("mouseover", () => {
      marker.openPopup();
    });

    return marker;
  };

  // 팝업 내용 생성 (제공된 예시 기반)
  const createPopupContent = (attraction) => {
    return `
      <div class="popup-content" style="padding: 10px; min-width: 200px;">
        <div class="popup-title" style="font-weight: bold; color: #e53e3e; margin-bottom: 5px;">
          ${attraction.time || "시간 미정"}
        </div>
        <div class="popup-type" style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">
          ${attraction.location || attraction.name}
        </div>
        <div class="popup-description" style="color: #666; font-size: 14px;">
          ${attraction.description || "관광지 방문"}
        </div>
      </div>
    `;
  };

  // 관광지 하이라이트 (제공된 예시와 동일)
  const highlightAttraction = (attraction) => {
    if (map) {
      map.setView([attraction.lat, attraction.lng], 15);
      console.log(
        `${attraction.location || attraction.name}을(를) 선택했습니다.`,
      );
    }
  };

  // 추천 경로 표시 (제공된 예시 기반)
  const displayRecommendedRoute = (route) => {
    if (!map || !routeMarkersLayer || !window.L) return;

    // 기존 경로 제거
    if (routeLayer) {
      map.removeLayer(routeLayer);
      setRouteLayer(null);
    }
    routeMarkersLayer.clearLayers();

    if (route.length === 0) return;

    // 경로 마커 표시 (제공된 예시와 동일)
    route.forEach((attraction, index) => {
      const marker = createMarker(attraction, index + 1, true);
      if (marker) {
        routeMarkersLayer.addLayer(marker);
      }
    });

    // 경로 선 그리기 (제공된 예시와 동일)
    if (route.length > 1) {
      const routeCoords = route.map((attraction) => [
        attraction.lat,
        attraction.lng,
      ]);

      const polyline = window.L.polyline(routeCoords, {
        color: "#e53e3e",
        weight: 4,
        opacity: 0.8,
        dashArray: "10, 10",
      }).addTo(map);

      setRouteLayer(polyline);

      // 경로에 애니메이션 효과 추가 (제공된 예시와 동일)
      animateRoute(polyline);
    }

    // 지도 뷰를 경로에 맞게 조정 (제공된 예시와 동일)
    if (route.length > 0) {
      const group = new window.L.featureGroup(routeMarkersLayer.getLayers());
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  // 경로 애니메이션 (제공된 예시와 동일)
  const animateRoute = (polyline) => {
    let offset = 0;
    const animate = () => {
      offset += 2;
      if (offset > 20) offset = 0;

      polyline.setStyle({
        dashOffset: offset,
      });

      requestAnimationFrame(animate);
    };
    animate();
  };

  // 일정이 변경될 때 지도 업데이트
  useEffect(() => {
    if (
      !isMapReady ||
      !map ||
      !routeMarkersLayer ||
      !itinerary ||
      itinerary.length === 0
    ) {
      return;
    }

    console.log("지도 업데이트 시작:", itinerary);

    // 일정을 경로 형태로 변환
    const allPoints = [];
    itinerary.forEach((day) => {
      if (day.activities) {
        day.activities.forEach((activity) => {
          if (activity.lat && activity.lng) {
            allPoints.push({
              lat: parseFloat(activity.lat),
              lng: parseFloat(activity.lng),
              location: activity.location,
              time: activity.time,
              description: activity.description,
              name: activity.location,
            });
          }
        });
      }
    });

    // 추천 경로 표시
    displayRecommendedRoute(allPoints);

    console.log("지도 업데이트 완료");
  }, [isMapReady, map, routeMarkersLayer, itinerary]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
      }}
    />
  );
};

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [conversationText, setConversationText] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message:
        "안녕하세요! 🌟 여행 계획 도우미입니다. 몇 가지 질문을 통해 맞춤형 여행 계획을 만들어드릴게요!",
    },
  ]);
  const [itinerary, setItinerary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tripDays, setTripDays] = useState(2);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [breakfastTime, setBreakfastTime] = useState("08:00");
  const [lunchTime, setLunchTime] = useState("12:00");
  const [dinnerTime, setDinnerTime] = useState("18:00");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(false);
  const chatMessagesRef = useRef(null);

  // 하드코딩된 질문들
  const predefinedQuestions = [
    "어느 지역으로 여행을 가고 싶으신가요? (예: 경상북도 의성군)",
    "방문하고 싶은 테마가 있나요? (사찰, 박물관, 자연, 문화재, 테마파크, 관광명소,카페,식당)",
    "어떤 활동을 선호하시나요? (관광, 휴식, 체험활동, 사진촬영 등)",
    "여행 중 특별히 피하고 싶은 장소나 활동이 있나요?",
  ];

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

  // API 호출 함수
  const callExtractInfoAPI = async (text, size) => {
    try {
      console.log("Extract Info API 호출:", { text, size });
      //const response = await fetch('http://localhost:8000/recommand/extract-info', {
      const response = await fetch(
        "https://9c44-35-206-126-116.ngrok-free.app/recommand/extract-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            size: size,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const result = await response.json();
      console.log("Extract Info API 응답:", result);
      return result;
    } catch (error) {
      console.error("Extract info API 오류:", error);
      return null;
    }
  };

  const callTourPathAPI = async (text, locations, size) => {
    try {
      console.log("Tour Path API 호출:", { text, locations, size });
      const response = await fetch(
        "https://9c44-35-206-126-116.ngrok-free.app/recommand/tour-path",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            locations: locations,
            size: size,
            wake_time: wakeTime,
            breakfast_time: breakfastTime,
            lunch_time: lunchTime,
            dinner_time: dinnerTime,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const result = await response.json();
      console.log("Tour Path API 응답:", result);
      return result;
    } catch (error) {
      console.error("Tour path API 오류:", error);
      return null;
    }
  };

  var tempConversationText = "";

  // 자동 여행 계획 생성 함수
  //const autoGenerateTravelPlan = async () => {
  const autoGenerateTravelPlan = async (overrideMessages = null) => {
    setIsLoading(true);

    try {
      // 전체 대화 내용 합치기
      //tempConversationText = chatMessages
      const base = overrideMessages ?? chatMessages;
      tempConversationText = base
        .map((msg) => `${msg.type}: ${msg.message}`)
        .join("\n");

      setConversationText(tempConversationText);
      // 1단계: 정보 추출
      const extractedInfo = await callExtractInfoAPI(tempConversationText, 5);

      if (!extractedInfo) {
        throw new Error("정보 추출 실패");
      }

      // 2단계: 여행 경로 생성

      const tourPlan = await callTourPathAPI(
        tempConversationText,
        extractedInfo,
        tripDays,
      );

      if (!tourPlan) {
        throw new Error("여행 계획 생성 실패");
      }

      console.log("생성된 여행 계획:", tourPlan);
      setItinerary(tourPlan);

      // 봇 응답 추가
      const botResponse = {
        id: chatMessages.length + 1,
        type: "bot",
        message: `${tripDays}일간의 맞춤형 여행 계획이 생성되었습니다! 🗺️ 지도에서 경로를 확인해보세요. 다른 관광지를 원하시거나 시간을 조정하고 싶으시면 말씀해주세요!`,
      };

      setChatMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("여행 계획 생성 오류:", error);

      const errorResponse = {
        id: chatMessages.length + 1,
        type: "bot",
        message: `죄송합니다. 여행 계획 생성 중 오류가 발생했습니다: ${error.message}. 백엔드 서버가 실행 중인지 확인해주세요.`,
      };

      setChatMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // 메시지 전송 함수
  // const handleSendMessage = () => {
  //   if (userMessage.trim()) {
  //     const newUserMessage = {
  //       id: chatMessages.length + 1,
  //       type: "user",
  //       message: userMessage,
  //     };

  //     //setChatMessages(prev => [...prev, newUserMessage]);
  //     setChatMessages(prev => [...prev, newUserMessage]);
  //     autoGenerateTravelPlan([...chatMessages, newUserMessage]);
  //     setUserMessage("");

  //     // 하드코딩된 질문이 아직 남아있는 경우
  //     if (currentQuestionIndex < predefinedQuestions.length - 1) {
  //       setTimeout(() => {
  //         const nextQuestionIndex = currentQuestionIndex + 1;
  //         const botResponse = {
  //           id: chatMessages.length + 2,
  //           type: "bot",
  //           message: predefinedQuestions[nextQuestionIndex],
  //         };

  //         setChatMessages(prev => [...prev, botResponse]);
  //         setCurrentQuestionIndex(nextQuestionIndex);
  //       }, 1000);
  //     } else if (!questionsCompleted) {
  //       // 모든 질문이 완료된 경우
  //       setQuestionsCompleted(true);
  //       setTimeout(() => {
  //         const completionMessage = {
  //           id: chatMessages.length + 2,
  //           type: "bot",
  //           message: "감사합니다! 입력해주신 정보를 바탕으로 맞춤형 여행 계획을 생성하고 있습니다... ✨",
  //         };

  //         setChatMessages(prev => [...prev, completionMessage]);

  //         // 자동으로 여행 계획 생성
  //         setTimeout(() => {
  //           autoGenerateTravelPlan();
  //         }, 2000);
  //       }, 1000);
  //     } else {
  //       // 질문 완료 후 추가 대화 - 시간 조정 등 요청 처리
  //       setTimeout(() => {
  //         const botResponse = {
  //           id: chatMessages.length + 2,
  //           type: "bot",
  //           message: "요청사항을 반영하여 새로운 여행 계획을 생성하고 있습니다... 🔄",
  //         };

  //         setChatMessages(prev => [...prev, botResponse]);

  //         // 새로운 요청이 있으면 다시 여행 계획 생성
  //         setTimeout(() => {
  //           autoGenerateTravelPlan();
  //         }, 1000);
  //       }, 1000);
  //     }

  //     // 메시지 추가 후 스크롤을 아래로 이동
  //     setTimeout(() => {
  //       if (chatMessagesRef.current) {
  //         chatMessagesRef.current.scrollTop =
  //           chatMessagesRef.current.scrollHeight;
  //       }
  //     }, 100);
  //   }
  // };
  // --- 기존 handleSendMessage 대신 이 함수 전체를 통째로 붙여넣으세요 ---
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    // ❶ 유저 메시지 객체 생성
    const newUserMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: userMessage,
    };

    // ❷ 채팅 리스트에 추가
    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserMessage("");

    // ❸ 아직 1~3번째 질문(인덱스 0~2) 답변 중이면 → 질문만 던지고 API 호출은 안 함
    if (currentQuestionIndex < predefinedQuestions.length - 1) {
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        setChatMessages((prev) => [
          ...prev,
          {
            id: newUserMessage.id + 1,
            type: "bot",
            message: predefinedQuestions[nextIndex],
          },
        ]);
        setCurrentQuestionIndex(nextIndex);
      }, 1000);

      // ❹ 4번째 질문(인덱스 3) 답변 직후 → 질문 완료 표시 + 2초 뒤 첫 API 호출
    } else if (!questionsCompleted) {
      setQuestionsCompleted(true);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: newUserMessage.id + 1,
            type: "bot",
            message:
              "감사합니다! 입력해주신 정보를 바탕으로 맞춤형 여행 계획을 생성하고 있습니다... ✨",
          },
        ]);
      }, 1000);
      setTimeout(() => {
        autoGenerateTravelPlan([...chatMessages, newUserMessage]);
      }, 2000);

      // ❺ 그 이후(추가 요청) → 매 엔터마다 API 호출
    } else {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: newUserMessage.id + 1,
            type: "bot",
            message:
              "요청사항을 반영하여 새로운 여행 계획을 생성하고 있습니다... 🔄",
          },
        ]);
      }, 1000);
      setTimeout(() => {
        autoGenerateTravelPlan([...chatMessages, newUserMessage]);
      }, 1000);
    }

    // ❻ 스크롤 자동 이동
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop =
          chatMessagesRef.current.scrollHeight;
      }
    }, 100);
  };

  // 수동 여행 계획 생성 함수 (버튼 클릭용)
  const manualGenerateTravelPlan = () => {
    if (questionsCompleted) {
      autoGenerateTravelPlan();
    } else {
      const warningMessage = {
        id: chatMessages.length + 1,
        type: "bot",
        message:
          "먼저 위의 질문들에 답변해주세요! 더 정확한 여행 계획을 위해 필요합니다. 😊",
      };
      setChatMessages((prev) => [...prev, warningMessage]);
    }
  };

  // 컴포넌트 마운트 시 첫 번째 질문 표시
  useEffect(() => {
    if (currentQuestionIndex === 0 && chatMessages.length === 1) {
      setTimeout(() => {
        const firstQuestion = {
          id: 2,
          type: "bot",
          message: predefinedQuestions[0],
        };
        setChatMessages((prev) => [...prev, firstQuestion]);
      }, 1500);
    }
  }, []);

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
            <button
              onClick={() =>
                document
                  .getElementById("chat-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="group relative bg-transparent border border-white/30 text-white px-12 py-4 text-sm font-light tracking-[0.2em] uppercase hover:border-blue-400 transition-all duration-500 overflow-hidden"
            >
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
      <section id="chat-section" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              지금 바로 여행 계획을 시작해보세요
            </h2>
            <p className="text-xl text-gray-600">
              AI 어시스턴트와 대화하며 맞춤형 여행 계획을 받아보세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 채팅 섹션 */}
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

              {/* 여행 설정 */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      여행 일수
                    </label>
                    <select
                      value={tripDays}
                      onChange={(e) => setTripDays(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value={1}>당일치기</option>
                      <option value={2}>1박 2일</option>
                      <option value={3}>2박 3일</option>
                      <option value={4}>3박 4일</option>
                      <option value={5}>4박 5일</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      기상 시간
                    </label>
                    <input
                      type="time"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      아침식사
                    </label>
                    <input
                      type="time"
                      value={breakfastTime}
                      onChange={(e) => setBreakfastTime(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      점심식사
                    </label>
                    <input
                      type="time"
                      value={lunchTime}
                      onChange={(e) => setLunchTime(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      저녁식사
                    </label>
                    <input
                      type="time"
                      value={dinnerTime}
                      onChange={(e) => setDinnerTime(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 진행 상황 표시 */}
              {!questionsCompleted && (
                <div className="p-4 bg-blue-50 border-b">
                  <div className="flex items-center justify-between text-sm text-blue-700">
                    <span>질문 진행률</span>
                    <span>
                      {currentQuestionIndex + 1} / {predefinedQuestions.length}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / predefinedQuestions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

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
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span>여행 계획을 생성하고 있습니다...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 여행 계획 생성 버튼 */}
              <div className="border-t p-4">
                <div className="mb-4 text-center">
                  <button
                    onClick={manualGenerateTravelPlan}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      questionsCompleted
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading
                      ? "생성 중..."
                      : questionsCompleted
                        ? "🗺️ 새 여행 계획 생성하기"
                        : "🗺️ 질문 완료 후 이용 가능"}
                  </button>
                </div>

                {/* 메시지 입력 */}
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={
                      questionsCompleted
                        ? "시간 조정이나 추가 요청사항을 입력하세요... (예: 모든 스케줄을 2시 이후로 배치해줘)"
                        : "위 질문에 답변해주세요..."
                    }
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

            {/* 지도 및 일정 섹션 */}
            <div className="space-y-6">
              {/* 지도 */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold">여행 경로</h3>
                </div>
                {itinerary.length > 0 ? (
                  <MapComponent locations={[]} itinerary={itinerary} />
                ) : (
                  <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        여행 계획이 생성되면
                        <br />
                        지도에 경로가 표시됩니다
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 일정 표시 */}
              {itinerary.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 text-green-500 mr-2" />
                    <h3 className="text-lg font-semibold">여행 일정</h3>
                  </div>
                  <div className="space-y-4">
                    {itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {day.day}일차
                        </h4>
                        <div className="space-y-2">
                          {day.activities &&
                            day.activities.map((activity, index) => (
                              <div
                                key={`${day.day}-${index}`}
                                className="flex items-start space-x-3"
                              >
                                <span className="text-sm font-medium text-blue-600 min-w-[50px]">
                                  {activity.time}
                                </span>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {activity.location}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {activity.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
