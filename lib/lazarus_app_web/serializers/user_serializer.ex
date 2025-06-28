defmodule LazarusAppWeb.UserSerializer do
  def to_map(user = %LazarusApp.Accounts.User{}) do
    %{
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      email: user.email
    }
  end

  def assign_prop(conn, name, user) do
    Inertia.Controller.assign_prop(conn, name, fn -> user && to_map(user) end)
  end
end
