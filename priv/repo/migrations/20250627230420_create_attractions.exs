defmodule LazarusApp.Repo.Migrations.CreateAttractions do
  use Ecto.Migration

  def up do
    create table(:attractions) do
      add :name, :string, null: false
      add :description, :text, null: false
      add :address, :string, null: false
      add :latitude, :decimal, null: false, precision: 10, scale: 8
      add :longitude, :decimal, null: false, precision: 11, scale: 8

      add :embedding, :vector, size: 384

      timestamps(type: :utc_datetime)
    end

    create index(:attractions, [:name])
    create index(:attractions, [:latitude, :longitude])

  end

  def down do
    drop table(:attractions)
  end
end
