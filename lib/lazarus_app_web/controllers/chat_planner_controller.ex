defmodule LazarusAppWeb.ChatPlannerController do
  use LazarusAppWeb, :controller

  def chat_plan(conn, _params) do
    conn
    |> assign(:page_title, "의성 트립봇 - 여행 계획")
    |> render_inertia("ChatPlannerPage")
  end
end
