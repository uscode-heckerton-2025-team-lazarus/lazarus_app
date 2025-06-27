defmodule LazarusApp.AiService do
  @moduledoc """
  AI API 호출을 위한 서비스 모듈
  """
  alias LangChain.Chains.LLMChain
  alias LangChain.ChatModels.ChatGoogleAI
  alias LangChain.Message

  def generate_travel_response(user_message, conversation_history \\ []) do
    {:ok, updated_chain} =
      %{llm: ChatGoogleAI.new!(%{model: "gemini-2.5-flash"})}
      |> LLMChain.new!()
      |> LLMChain.add_message(Message.new_user!(user_message))
      |> LLMChain.run()

      [%{content: content} | _] = updated_chain.last_message.content
      content
  end
end
