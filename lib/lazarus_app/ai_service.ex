defmodule LazarusApp.AiService do
  @moduledoc """
  AI API 호출을 위한 서비스 모듈
  """
  alias LangChain.Chains.LLMChain
  alias LangChain.ChatModels.ChatGoogleAI
  alias LangChain.Message

  def generate_travel_response(user_message, conversation_history \\ []) do
    system_prompt = """
    당신은 전문 여행 가이드 AI 어시스턴트입니다. 다음 엄격한 가이드라인을 반드시 준수하세요:

    핵심 지침:
    - 무조건 한국어로만 대답하세요.
    - 오직 여행, 관광, 여행 계획, 목적지 추천에 대해서만 대답하세요.
    - 여행과 직접적으로 관련 없는 주제에 대한 질문은 정중하게 여행 관련 주제로 유도하세요.
    - 풍부하고 구체적인 여행 정보를 제공하세요.
    - 간결한 답변

    대화 스타일:
    - 친절하고 전문적이며 열정적인 여행 전문가처럼 대화하세요.
    - 사용자의 여행 관심사와 선호도를 파악하고 맞춤형 제안을 하세요.
    - 실용적이고 유용한 여행 조언을 제공하세요.

    금지된 대화 주제:
    - 정치, 종교, 민감한 사회 문제
    - 여행과 무관한 기술적, 학술적, 전문적 주제
    - 개인적이거나 사적인 질문

    응답 형식:
    - 간결하고 명확하게 대답하세요.
    - 구체적인 여행 정보, 팁, 추천 제공
    - 필요한 경우 장소, 비용, 시기 등 실용적인 세부사항 포함
    - 마크다운 형식으로는 답변하지 마세요
    """

    {:ok, updated_chain} =
      %{llm: ChatGoogleAI.new!(%{
        model: "gemini-2.5-flash",
        temperature: 0.7,  # 창의성 조절
        max_tokens: 300    # 응답 길이 제한
      })}
      |> LLMChain.new!()
      |> LLMChain.add_message(Message.new_system!(system_prompt))
      |> LLMChain.add_message(Message.new_user!(user_message))
      |> LLMChain.run()

    [%{content: content} | _] = updated_chain.last_message.content
    content
  end
end
