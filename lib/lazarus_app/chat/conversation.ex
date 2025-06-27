defmodule LazarusApp.Chat.Conversation do
  use Ecto.Schema
  import Ecto.Changeset

  schema "conversations" do
    field :title, :string
    field :status, :string, default: "active"
    field :metadata, :map, default: %{}
    
    belongs_to :user, LazarusApp.Accounts.User
    has_many :chats, LazarusApp.Chat.Chat

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(conversation, attrs) do
    conversation
    |> cast(attrs, [:title, :status, :metadata, :user_id])
    |> validate_required([:user_id])
    |> validate_inclusion(:status, ["active", "archived", "deleted"])
    |> foreign_key_constraint(:user_id)
  end
end