defmodule LazarusAppWeb.TravelPlanController do
  use LazarusAppWeb, :controller

  def result(conn, %{"conversation_id" => conversation_id}) do
    # 임시 여행 계획 데이터 (실제로는 conversation_id를 통해 데이터베이스에서 가져옴)
    travel_plan = %{
      destination: "제주도",
      duration: "2박 3일",
      budget: "30만원",
      travelers: "2명",
      schedule: [
        %{
          day: 1,
          activities: [
            %{time: "09:00", activity: "제주공항 도착", location: "제주공항", latitude: 33.5067, longitude: 126.4929},
            %{time: "11:00", activity: "렌터카 픽업", location: "제주공항", latitude: 33.5067, longitude: 126.4929},
            %{time: "13:00", activity: "점심식사", location: "흑돼지 맛집", latitude: 33.5158, longitude: 126.5219},
            %{time: "15:00", activity: "성산일출봉", location: "성산일출봉", latitude: 33.4586, longitude: 126.9426},
            %{time: "18:00", activity: "저녁식사", location: "성산포", latitude: 33.4550, longitude: 126.9273},
            %{time: "20:00", activity: "숙소 체크인", location: "호텔", latitude: 33.5102, longitude: 126.5311}
          ]
        },
        %{
          day: 2,
          activities: [
            %{time: "08:00", activity: "조식", location: "호텔", latitude: 33.5102, longitude: 126.5311},
            %{time: "10:00", activity: "한라산 등반", location: "한라산", latitude: 33.3617, longitude: 126.5292},
            %{time: "15:00", activity: "점심식사", location: "한라산 주변", latitude: 33.3800, longitude: 126.5400},
            %{time: "17:00", activity: "우도 관광", location: "우도", latitude: 33.5010, longitude: 126.9507},
            %{time: "19:00", activity: "저녁식사", location: "우도", latitude: 33.5010, longitude: 126.9507}
          ]
        }
      ]
    }

    conn
    |> assign(:page_title, "여행 계획 결과")
    |> assign_prop(:travelPlan, travel_plan)
    |> render_inertia("TravelPlanResultPage")
  end
end
