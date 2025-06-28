import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { MapPin, Calendar, Clock, Navigation, ArrowLeft } from "lucide-react";

const TravelPlanResultPage = ({ travelPlan }) => {
  const handleBackToChat = () => {
    router.visit("/chatplan");
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
    <div className="min-h-[calc(100vh-180px)] bg-gray-50 p-4 space-y-4">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-green-500" />
              {travelPlan?.destination || "여행 계획"} 결과
            </h1>
            <p className="text-gray-600 mt-1">
              {travelPlan?.duration} | {travelPlan?.travelers} |{" "}
              {travelPlan?.budget}
            </p>
          </div>
          <button
            onClick={handleBackToChat}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
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
  );
};

export default TravelPlanResultPage;
