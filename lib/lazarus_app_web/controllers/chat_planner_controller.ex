defmodule LazarusAppWeb.ChatPlannerController do
  use LazarusAppWeb, :controller
  alias LazarusApp.Chat
  alias LazarusAppWeb.ConversationSerializer
  alias LazarusAppWeb.ChatSerializer

  def chat_plan(conn, _params) do
    conn
    |> assign(:page_title, "의성 트립봇 - 여행 계획")
    |> render_inertia("ChatPlannerPage")
  end

  def create_conversation(conn, _params) do
    user = conn.assigns.current_user

    case Chat.create_conversation(user.id) do
      {:ok, conversation} ->
        # 초기 봇 메시지 추가
        {:ok, _} =
          Chat.create_chat(
            conversation.id,
            "안녕하세요! 🌍 여행 계획을 도와드릴게요. 어떤 여행을 원하시나요?",
            "bot"
          )

        conn
        |> put_status(200)
        |> json(%{conversation_id: conversation.id})

      {:error, errors} ->
        conn
        |> assign_errors(errors)
        |> render_inertia("ChatPlannerPage")
    end
  end

  def create_chat(conn, %{
        "conversation_id" => conversation_id,
        "content" => content,
        "type" => type
      }) do
    case Chat.create_chat(conversation_id, content, type) do
      {:ok, chat} ->
        conn
        |> put_status(200)
        |> json(%{message: "Chat created successfully", chat: ChatSerializer.to_map(chat)})

      {:error, errors} ->
        conn
        |> assign_errors(errors)
        |> render_inertia("ChatPlannerPage")
    end
  end
end
