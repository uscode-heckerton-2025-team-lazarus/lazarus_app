defmodule LazarusApp.Tourism.Attraction do
  use Ecto.Schema
  import Ecto.Changeset

  schema "attractions" do
    field :name, :string
    field :address, :string
    field :description, :string
    field :latitude, :decimal
    field :longitude, :decimal
    field :embedding, Pgvector.Ecto.Vector

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(attraction, attrs) do
    attraction
    |> cast(attrs, [:name, :description, :address, :latitude, :longitude])
    |> validate_required([:name, :description, :address, :latitude, :longitude])
  end

  def put_embedding(%{changes: %{description: desc}} = changeset) do
    %{embedding: embedding} =Model.SearchAttractionModel.predict(desc)
    put_change(changeset, :embedding, embedding)
  end
end
