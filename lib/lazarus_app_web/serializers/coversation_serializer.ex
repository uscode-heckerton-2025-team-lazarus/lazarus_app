defmodule LazarusAppWeb.ConversationSerializer do
  def to_map(conversation) do
    %{
      id: conversation.id,
      title: conversation.title,
      status: conversation.status,
      metadata: conversation.metadata,
      userId: conversation.user_id,
      insertedAt: conversation.inserted_at,
      updatedAt: conversation.updated_at
    }
  end

  def assign_prop(conn, name, conversation) do
    Inertia.Controller.assign_prop(conn, name, fn -> to_map(conversation) end)
  end
end
