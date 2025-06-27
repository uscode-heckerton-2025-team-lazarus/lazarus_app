defmodule LazarusApp.Chat do
  @moduledoc """
  The Chat context.
  """

  import Ecto.Query, warn: false
  alias LazarusApp.Repo

  alias LazarusApp.Chat.{Conversation, Chat}

  @doc """
  Creates a conversation.

  ## Examples

      iex> create_conversation(user_id)
      {:ok, %Conversation{}}

      iex> create_conversation(bad_user_id)
      {:error, %Ecto.Changeset{}}

  """
  def create_conversation(user_id, attrs \\ %{}) do
    %Conversation{}
    |> Conversation.changeset(Map.put(attrs, :user_id, user_id))
    |> Repo.insert()
  end

  @doc """
  Gets a single conversation.

  Raises `Ecto.NoResultsError` if the Conversation does not exist.

  ## Examples

      iex> get_conversation!(123)
      %Conversation{}

      iex> get_conversation!(456)
      ** (Ecto.NoResultsError)

  """
  def get_conversation!(id), do: Repo.get!(Conversation, id)

  @doc """
  Gets a conversation belonging to a user.

  Returns nil if the conversation doesn't exist or doesn't belong to the user.

  ## Examples

      iex> get_user_conversation(user_id, conversation_id)
      %Conversation{}

      iex> get_user_conversation(user_id, other_user_conversation_id)
      nil

  """
  def get_user_conversation(user_id, conversation_id) do
    Conversation
    |> where([c], c.user_id == ^user_id and c.id == ^conversation_id)
    |> Repo.one()
  end

  @doc """
  Gets all conversations for a user.

  ## Examples

      iex> list_user_conversations(user_id)
      [%Conversation{}, ...]

  """
  def list_user_conversations(user_id) do
    Conversation
    |> where([c], c.user_id == ^user_id)
    |> order_by([c], desc: c.updated_at)
    |> Repo.all()
  end

  @doc """
  Updates a conversation.

  ## Examples

      iex> update_conversation(conversation, %{field: new_value})
      {:ok, %Conversation{}}

      iex> update_conversation(conversation, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_conversation(%Conversation{} = conversation, attrs) do
    conversation
    |> Conversation.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a conversation.

  ## Examples

      iex> delete_conversation(conversation)
      {:ok, %Conversation{}}

      iex> delete_conversation(conversation)
      {:error, %Ecto.Changeset{}}

  """
  def delete_conversation(%Conversation{} = conversation) do
    Repo.delete(conversation)
  end

  @doc """
  Creates a chat message.

  ## Examples

      iex> create_chat(conversation_id, message, message_type)
      {:ok, %Chat{}}

      iex> create_chat(conversation_id, message, bad_type)
      {:error, %Ecto.Changeset{}}

  """
  def create_chat(conversation_id, message, message_type, metadata \\ %{}) do
    %Chat{}
    |> Chat.changeset(%{
      conversation_id: conversation_id,
      message: message,
      message_type: message_type,
      metadata: metadata
    })
    |> Repo.insert()
  end

  @doc """
  Gets all chats for a conversation.

  ## Examples

      iex> list_chats(conversation_id)
      [%Chat{}, ...]

  """
  def list_chats(conversation_id) do
    Chat
    |> where([c], c.conversation_id == ^conversation_id)
    |> order_by([c], asc: c.inserted_at)
    |> Repo.all()
  end

  @doc """
  Gets a single chat.

  Raises `Ecto.NoResultsError` if the Chat does not exist.

  ## Examples

      iex> get_chat!(123)
      %Chat{}

      iex> get_chat!(456)
      ** (Ecto.NoResultsError)

  """
  def get_chat!(id), do: Repo.get!(Chat, id)

  @doc """
  Updates a chat.

  ## Examples

      iex> update_chat(chat, %{field: new_value})
      {:ok, %Chat{}}

      iex> update_chat(chat, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_chat(%Chat{} = chat, attrs) do
    chat
    |> Chat.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a chat.

  ## Examples

      iex> delete_chat(chat)
      {:ok, %Chat{}}

      iex> delete_chat(chat)
      {:error, %Ecto.Changeset{}}

  """
  def delete_chat(%Chat{} = chat) do
    Repo.delete(chat)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking conversation changes.

  ## Examples

      iex> change_conversation(conversation)
      %Ecto.Changeset{data: %Conversation{}}

  """
  def change_conversation(%Conversation{} = conversation, attrs \\ %{}) do
    Conversation.changeset(conversation, attrs)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking chat changes.

  ## Examples

      iex> change_chat(chat)
      %Ecto.Changeset{data: %Chat{}}

  """
  def change_chat(%Chat{} = chat, attrs \\ %{}) do
    Chat.changeset(chat, attrs)
  end
end