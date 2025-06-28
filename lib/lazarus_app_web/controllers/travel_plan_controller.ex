defmodule LazarusAppWeb.TravelPlanController do
  use LazarusAppWeb, :controller

  alias LazarusApp.Chat
  alias LazarusApp.Tourism
  alias LazarusApp.AiService

  def result(conn, %{"conversation_id" => conversation_id}) do
    user_chat_history =
      Chat.list_chats_by_message_type_of_user(conversation_id)
      |> Enum.map_join(" ", & &1.message)

    recommand_spots = Tourism.search(user_chat_history, 5)
    IO.inspect(recommand_spots)


    travel_plan = AiService.generate_travel_plan(recommand_spots, user_chat_history)
    IO.inspect(travel_plan)


    conn
    |> assign(:page_title, "여행 계획 결과")
    |> assign_prop(:travelPlan, travel_plan)
    |> render_inertia("TravelPlanResultPage")
  end
end
