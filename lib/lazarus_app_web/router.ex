defmodule LazarusAppWeb.Router do
  use LazarusAppWeb, :router

  import LazarusAppWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {LazarusAppWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
    plug Inertia.Plug
  end

  pipeline :authenticated do
    plug LazarusAppWeb.AuthPlug, :user_required
  end

  pipeline :unauthenticated do
    plug LazarusAppWeb.AuthPlug, :no_user
  end

  pipeline :auth_optional do
    plug LazarusAppWeb.AuthPlug, :user_optional
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", LazarusAppWeb do
    pipe_through [:browser, :auth_optional]

    get "/", PageController, :home
  end

  scope "/", LazarusAppWeb do
    # pipe_through [:browser, :authenticated]
    pipe_through [:browser]

    get "/chatplan", ChatPlannerController, :chat_plan
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:lazarus_app, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: LazarusAppWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/", LazarusAppWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    post "/users/log_in", UserSessionController, :create
  end

  scope "/", LazarusAppWeb do
    pipe_through [:browser, :require_authenticated_user]
  end

  scope "/", LazarusAppWeb do
    pipe_through [:browser]

    delete "/users/log_out", UserSessionController, :delete
  end
end
