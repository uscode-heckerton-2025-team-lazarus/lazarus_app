defmodule LazarusApp.Repo do
  use Ecto.Repo,
    otp_app: :lazarus_app,
    adapter: Ecto.Adapters.Postgres
end
