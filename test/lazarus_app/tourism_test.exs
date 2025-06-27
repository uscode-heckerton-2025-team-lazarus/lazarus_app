defmodule LazarusApp.TourismTest do
  use LazarusApp.DataCase

  alias LazarusApp.Tourism

  describe "attractions" do
    alias LazarusApp.Tourism.Attraction

    import LazarusApp.TourismFixtures

    @invalid_attrs %{name: nil, address: nil, description: nil, latitude: nil, longitude: nil}

    test "list_attractions/0 returns all attractions" do
      attraction = attraction_fixture()
      assert Tourism.list_attractions() == [attraction]
    end

    test "get_attraction!/1 returns the attraction with given id" do
      attraction = attraction_fixture()
      assert Tourism.get_attraction!(attraction.id) == attraction
    end

    test "create_attraction/1 with valid data creates a attraction" do
      valid_attrs = %{name: "some name", address: "some address", description: "some description", latitude: "120.5", longitude: "120.5"}

      assert {:ok, %Attraction{} = attraction} = Tourism.create_attraction(valid_attrs)
      assert attraction.name == "some name"
      assert attraction.address == "some address"
      assert attraction.description == "some description"
      assert attraction.latitude == Decimal.new("120.5")
      assert attraction.longitude == Decimal.new("120.5")
    end

    test "create_attraction/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Tourism.create_attraction(@invalid_attrs)
    end

    test "update_attraction/2 with valid data updates the attraction" do
      attraction = attraction_fixture()
      update_attrs = %{name: "some updated name", address: "some updated address", description: "some updated description", latitude: "456.7", longitude: "456.7"}

      assert {:ok, %Attraction{} = attraction} = Tourism.update_attraction(attraction, update_attrs)
      assert attraction.name == "some updated name"
      assert attraction.address == "some updated address"
      assert attraction.description == "some updated description"
      assert attraction.latitude == Decimal.new("456.7")
      assert attraction.longitude == Decimal.new("456.7")
    end

    test "update_attraction/2 with invalid data returns error changeset" do
      attraction = attraction_fixture()
      assert {:error, %Ecto.Changeset{}} = Tourism.update_attraction(attraction, @invalid_attrs)
      assert attraction == Tourism.get_attraction!(attraction.id)
    end

    test "delete_attraction/1 deletes the attraction" do
      attraction = attraction_fixture()
      assert {:ok, %Attraction{}} = Tourism.delete_attraction(attraction)
      assert_raise Ecto.NoResultsError, fn -> Tourism.get_attraction!(attraction.id) end
    end

    test "change_attraction/1 returns a attraction changeset" do
      attraction = attraction_fixture()
      assert %Ecto.Changeset{} = Tourism.change_attraction(attraction)
    end
  end
end
