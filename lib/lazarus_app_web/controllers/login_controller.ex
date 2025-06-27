defmodule LazarusAppWeb.LoginController do
  use LazarusAppWeb, :controller

  alias LazarusApp.Accounts
  alias LazarusAppWeb.UserAuth

  def index(conn, _params) do
    conn
    |> assign(:page_title, "로그인 화면")
    |> render_inertia("LoginPage")
  end

  def login(conn, params) do
    remember_me = Map.get(params, "rememberMe", false)

    case Accounts.validate_login(params) do
      {:ok, user} ->
        user_params = %{
          "remember_me" => remember_me
        }

        conn
        |> UserAuth.log_in_user(user, user_params)

      {:error, changeset} ->
        conn
        |> assign_errors(changeset)
        |> redirect(to: ~p"/login")
    end
  end
end
