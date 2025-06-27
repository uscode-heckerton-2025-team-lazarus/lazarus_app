defmodule LazarusApp.Tourism do
  @moduledoc """
  The Tourism context.
  """

  import Ecto.Query, warn: false
  alias LazarusApp.Repo

  alias LazarusApp.Tourism.Attraction

  @doc """
  Returns the list of attractions.

  ## Examples

      iex> list_attractions()
      [%Attraction{}, ...]

  """
  def list_attractions do
    Repo.all(Attraction)
  end

  @doc """
  Gets a single attraction.

  Raises `Ecto.NoResultsError` if the Attraction does not exist.

  ## Examples

      iex> get_attraction!(123)
      %Attraction{}

      iex> get_attraction!(456)
      ** (Ecto.NoResultsError)

  """
  def get_attraction!(id), do: Repo.get!(Attraction, id)

  def search(query) do
    %{embedding: embedding} = Model.SearchAttractionModel.predict(query)

    Attraction
    |> order_by([a], fragment("l2_distance(?, ?)", a.embedding, ^embedding))
    |> Repo.all()
  end

  @doc """
  Creates a attraction.

  ## Examples

      iex> create_attraction(%{field: value})
      {:ok, %Attraction{}}

      iex> create_attraction(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_attraction(attrs \\ %{}) do
    attraction = %Attraction{}

    |> Attraction.changeset(attrs)
    |> Attraction.put_embedding()

    Repo.insert(attraction)
  end

  @doc """
  Updates a attraction.

  ## Examples

      iex> update_attraction(attraction, %{field: new_value})
      {:ok, %Attraction{}}

      iex> update_attraction(attraction, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_attraction(%Attraction{} = attraction, attrs) do
    attraction
    |> Attraction.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a attraction.

  ## Examples

      iex> delete_attraction(attraction)
      {:ok, %Attraction{}}

      iex> delete_attraction(attraction)
      {:error, %Ecto.Changeset{}}

  """
  def delete_attraction(%Attraction{} = attraction) do
    Repo.delete(attraction)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking attraction changes.

  ## Examples

      iex> change_attraction(attraction)
      %Ecto.Changeset{data: %Attraction{}}

  """
  def change_attraction(%Attraction{} = attraction, attrs \\ %{}) do
    Attraction.changeset(attraction, attrs)
  end
end
