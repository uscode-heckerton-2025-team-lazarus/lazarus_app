defmodule LazarusAppWeb.RegisterController do
  use LazarusAppWeb, :controller

  alias LazarusApp.Accounts
  alias LazarusAppWeb.UserAuth

  def index(conn, _params) do
    conn
    |> assign(:page_title, "회원 가입")
    |> render_inertia("RegisterPage")
  end

  def register(conn, user_params) do
    case Accounts.register_user(user_params) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "User created successfully.")
        |> UserAuth.log_in_user(user)

      {:error, errors} ->
        conn
        |> assign_errors(errors)
        |> redirect(to: ~p"/register")
    end
  end
end
