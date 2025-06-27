defmodule LazarusApp.Repo.Migrations.CreateConversations do
  use Ecto.Migration

  def up do
    create table(:conversations) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :title, :string
      add :status, :string, default: "active"
      add :metadata, :map, default: %{}
      timestamps(type: :utc_datetime)
    end

    create index(:conversations, [:user_id])
    create index(:conversations, [:status])
  end

  def down do
    drop_if_exists index(:conversations, [:status])
    drop_if_exists index(:conversations, [:user_id])
    drop_if_exists table(:conversations)
  end
end
