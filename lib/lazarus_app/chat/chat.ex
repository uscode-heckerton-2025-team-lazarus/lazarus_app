defmodule LazarusApp.Chat.Chat do
  use Ecto.Schema
  import Ecto.Changeset

  schema "chats" do
    field :message, :string
    field :message_type, :string
    field :metadata, :map, default: %{}
    
    belongs_to :conversation, LazarusApp.Chat.Conversation

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(chat, attrs) do
    chat
    |> cast(attrs, [:message, :message_type, :metadata, :conversation_id])
    |> validate_required([:message, :message_type, :conversation_id])
    |> validate_inclusion(:message_type, ["user", "bot"])
    |> foreign_key_constraint(:conversation_id)
  end
end