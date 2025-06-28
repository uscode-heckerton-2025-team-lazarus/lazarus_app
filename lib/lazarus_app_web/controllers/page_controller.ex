defmodule LazarusAppWeb.PageController do
  use LazarusAppWeb, :controller

  def home(conn, _params) do
    conn
    |> assign(:page_title, "Virtual Atelier")
    |> assign_prop(:data, "Welcome to Virtual Atelier!")
    |> render_inertia("HomePage")
  end
end
