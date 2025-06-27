defmodule LazarusApp.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      LazarusAppWeb.Telemetry,
      LazarusApp.Repo,
      {DNSCluster, query: Application.get_env(:lazarus_app, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: LazarusApp.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: LazarusApp.Finch},
      # Start a worker by calling: LazarusApp.Worker.start_link(arg)
      # {LazarusApp.Worker, arg},
      # Start to serve requests, typically the last entry
      LazarusAppWeb.Endpoint,
      {Nx.Serving,
      serving: Model.SearchAttractionModel.serving(defn_options: [compiler: EXLA]),
      batch_size: 16,
      batch_timeout: 100,
      name: SearchAttractionModel}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: LazarusApp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    LazarusAppWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
