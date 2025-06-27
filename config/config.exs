# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :langchain, google_ai_key: System.fetch_env!("GOOGLEAI_API_KEY")

config :inertia, endpoint: LazarusAppWeb.Endpoint

config :lazarus_app, LazarusApp.Repo, types: LazarusApp.PostgrexTypes

config :lazarus_app,
  ecto_repos: [LazarusApp.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :lazarus_app, LazarusAppWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: LazarusAppWeb.ErrorHTML, json: LazarusAppWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: LazarusApp.PubSub,
  live_view: [signing_salt: "qGyLPmqU"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :lazarus_app, LazarusApp.Mailer, adapter: Swoosh.Adapters.Local

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.21.5",
  lazarus_app: [
    args:
      ~w(js/app.jsx --bundle --chunk-names=chunks/[name]-[hash] --splitting --format=esm  --target=es2020 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.4.3",
  lazarus_app: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
