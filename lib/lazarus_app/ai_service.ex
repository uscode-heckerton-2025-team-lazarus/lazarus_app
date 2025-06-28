defmodule LazarusApp.AiService do
  @moduledoc """
  AI API 호출을 위한 서비스 모듈
  """
  alias LangChain.Chains.LLMChain
  alias LangChain.ChatModels.ChatGoogleAI
  alias LangChain.Message

  def generate_travel_plan(recommended_spots, user_chat_history) do
    system_prompt = """
    당신은 전문 여행 계획 AI 어시스턴트입니다. 다음 가이드라인을 엄격히 준수하세요:

    역할:
    - 추천된 관광지 정보와 사용자 대화 내역을 바탕으로 구체적인 여행 계획을 수립합니다.
    - 실용적이고 실현 가능한 여행 일정을 제공합니다.
    - 일반 텍스트만 작성하고 특수 기호를 사용하지 마세요.

    응답 형식 (JSON만 출력, 다른 텍스트 없이):
    {
      "destination": "주요 여행지명",
      "duration": "N박 N+1일",
      "budget": "예상 예산 (원 단위)",
      "travelers": "여행자 수",
      "schedule": [
        {
          "day": 1,
          "activities": [
            {"time": "HH:MM", "activity": "활동명", "location": "장소명", "latitude": 위도숫자, "longitude": 경도숫자}
          ]
        }
      ]
    }

    중요 요구사항:
    - latitude, longitude는 반드시 숫자 타입으로 제공 (문자열 불가)
    - 제공된 관광지 데이터의 좌표를 최대한 활용
    - 사용자 대화에서 예산, 기간, 인원 등 정보 추출
    - 시간대별로 논리적인 동선과 일정 구성
    - 식사, 이동, 숙박을 포함한 완전한 계획
    - JSON 형식만 출력하고 설명 텍스트는 제외
    """

    # 관광지 정보를 문자열로 변환
    spots_info = recommended_spots
    |> Enum.map(fn spot ->
      "- #{spot.name}: #{spot.address}, #{spot.description} (위도: #{spot.latitude}, 경도: #{spot.longitude})"
    end)
    |> Enum.join("\n")

    # 사용자 대화 내역을 문자열로 변환
    chat_context = case user_chat_history do
      [] -> "대화 내역 없음"
      history when is_list(history) -> Enum.join(history, "\n")
      history -> to_string(history)
    end

    user_prompt = """
    추천된 관광지 정보:
    #{spots_info}

    사용자 대화 내역:
    #{chat_context}

    위 정보를 바탕으로 여행 계획을 JSON 형식으로 생성해주세요.
    """

    {:ok, updated_chain} =
      %{llm: ChatGoogleAI.new!(%{
        model: "gemini-2.5-flash",
        temperature: 0.3,  # 일관성 있는 계획을 위해 낮은 온도
        max_tokens: 2000   # 상세한 계획을 위해 충분한 토큰
      })}
      |> LLMChain.new!()
      |> LLMChain.add_message(Message.new_system!(system_prompt))
      |> LLMChain.add_message(Message.new_user!(user_prompt))
      |> LLMChain.run()

    [%{content: content} | _] = updated_chain.last_message.content

    clean_content = content
    |> String.replace(~r/^```json\s*/, "")  # 시작 부분 ```json 제거
    |> String.replace(~r/```\s*$/, "")      # 끝 부분 ``` 제거
    |> String.trim()                        # 공백 제거

    json_string = Jason.decode!(clean_content)

    json_string
  end

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
