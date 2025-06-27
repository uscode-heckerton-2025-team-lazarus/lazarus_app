defmodule LazarusApp.Repo.Migrations.CreateChats do
  use Ecto.Migration

  def up do
    create table(:chats) do
      add :conversation_id, references(:conversations, on_delete: :delete_all), null: false
      add :message, :text, null: false
      add :message_type, :string, null: false
      add :metadata, :map, default: %{}
      timestamps(type: :utc_datetime)
    end

    create index(:chats, [:conversation_id])
    create index(:chats, [:message_type])
    create index(:chats, [:inserted_at])
  end

  def down do
    drop_if_exists index(:chats, [:inserted_at])
    drop_if_exists index(:chats, [:message_type])
    drop_if_exists index(:chats, [:conversation_id])
    drop_if_exists table(:chats)
  end
end
