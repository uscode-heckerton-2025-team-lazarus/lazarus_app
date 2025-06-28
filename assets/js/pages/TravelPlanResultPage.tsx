import React, { useState, useEffect, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import { MapPin, Calendar, Clock, Navigation, ArrowLeft } from "lucide-react";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const TravelPlanResultPage = ({ travelPlan }) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const handleBackToChat = () => {
    router.visit("/chatplan");
  };
  
  const handleActivityClick = (dayIndex: number, activityIndex: number, activity: any) => {
    const activityId = `${dayIndex}-${activityIndex}`;
    setSelectedActivity(activityId);
    
    // Find and trigger click on corresponding marker
    if (activity.latitude && activity.longitude && mapInstanceRef.current) {
      let markerIndex = 0;
      for (let i = 0; i < dayIndex; i++) {
        markerIndex += travelPlan.schedule[i].activities.filter(a => a.latitude && a.longitude).length;
      }
      const activitiesWithCoords = travelPlan.schedule[dayIndex].activities.filter(a => a.latitude && a.longitude);
      const activityPosition = activitiesWithCoords.findIndex(a => a === activity);
      if (activityPosition !== -1) {
        markerIndex += activityPosition;
        const marker = markersRef.current[markerIndex];
        if (marker) {
          google.maps.event.trigger(marker, 'click');
          mapInstanceRef.current.panTo(marker.getPosition());
          mapInstanceRef.current.setZoom(15);
        }
      }
    }
  };

  // Map Component
  const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
      // Load Google Maps script
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBAXirttMdfGtmE0QW8KEeDkMr-j2UoR_I&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        window.initMap = () => {
          setMapLoaded(true);
        };
        
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
      }
    }, []);

    useEffect(() => {
      if (mapLoaded && mapRef.current && travelPlan?.schedule) {
        // Collect all coordinates from activities
        const locations = [];
        travelPlan.schedule.forEach(day => {
          day.activities.forEach(activity => {
            if (activity.latitude && activity.longitude) {
              locations.push({
                lat: activity.latitude,
                lng: activity.longitude,
                title: activity.activity,
                location: activity.location,
                time: activity.time,
                day: day.day
              });
            }
          });
        });

        if (locations.length > 0) {
          // Initialize map centered on first location
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: locations[0].lat, lng: locations[0].lng },
            zoom: 11,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          });

          // Store map instance
          mapInstanceRef.current = map;
          
          // Add markers for each location
          const bounds = new google.maps.LatLngBounds();
          const markers = [];
          
          locations.forEach((loc, index) => {
            const marker = new google.maps.Marker({
              position: { lat: loc.lat, lng: loc.lng },
              map: map,
              title: loc.title,
              label: {
                text: `${index + 1}`,
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              },
              animation: google.maps.Animation.DROP,
            });

            // Info window for each marker
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h4 style="font-weight: bold; margin: 0 0 4px 0;">Day ${loc.day} - ${loc.time}</h4>
                  <p style="margin: 0 0 4px 0; font-weight: 500;">${loc.title}</p>
                  <p style="margin: 0; color: #666; font-size: 14px;">${loc.location}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });

            bounds.extend(marker.getPosition());
            markers.push(marker);
          });
          
          // Store markers reference
          markersRef.current = markers;

          // Draw polyline connecting locations in order
          const path = locations.map(loc => ({ lat: loc.lat, lng: loc.lng }));
          const polyline = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#3B82F6',
            strokeOpacity: 0.8,
            strokeWeight: 3,
          });
          polyline.setMap(map);

          // Fit map to show all markers
          map.fitBounds(bounds);
        }
      }
    }, [mapLoaded, travelPlan]);

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
        <div className="flex items-center mb-3">
          <Navigation className="h-5 w-5 mr-2 text-blue-500" />
          <h3 className="font-semibold text-gray-900">여행 지도</h3>
        </div>
        <div ref={mapRef} className="rounded-lg flex-1" style={{ minHeight: '400px' }}>
          {!mapLoaded && (
            <div className="bg-gray-100 rounded-lg h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                <p>지도를 불러오는 중...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
                  className={`border-l-4 pl-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 p-2 -ml-2 rounded ${
                    selectedActivity === `${dayIndex}-${activityIndex}` 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-blue-500'
                  }`}
                  onClick={() => handleActivityClick(dayIndex, activityIndex, activity)}
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
