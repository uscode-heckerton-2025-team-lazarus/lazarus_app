defmodule LazarusAppWeb.ChatSerializer do
  def to_map(chat) do
    %{
      id: chat.id,
      message: chat.message,
      messageType: chat.message_type,
      metadata: chat.metadata,
      conversationId: chat.conversation_id,
      insertedAt: chat.inserted_at,
      updatedAt: chat.updated_at
    }
  end

  def assign_prop(conn, name, chat) do
    Inertia.Controller.assign_prop(conn, name, fn -> to_map(chat) end)
  end
end
