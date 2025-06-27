defmodule LazarusAppWeb.PageController do
  use LazarusAppWeb, :controller

  def home(conn, _params) do
    conn
    |> assign(:page_title, "의성 트립봇")
    |> render_inertia("HomePage")
  end
end
