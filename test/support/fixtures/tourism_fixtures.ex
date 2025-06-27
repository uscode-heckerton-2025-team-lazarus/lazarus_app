defmodule LazarusApp.TourismFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `LazarusApp.Tourism` context.
  """

  @doc """
  Generate a attraction.
  """
  def attraction_fixture(attrs \\ %{}) do
    {:ok, attraction} =
      attrs
      |> Enum.into(%{
        address: "some address",
        description: "some description",
        latitude: "120.5",
        longitude: "120.5",
        name: "some name"
      })
      |> LazarusApp.Tourism.create_attraction()

    attraction
  end
end
