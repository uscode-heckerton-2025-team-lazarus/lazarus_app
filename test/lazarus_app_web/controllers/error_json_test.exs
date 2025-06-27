defmodule LazarusAppWeb.ErrorJSONTest do
  use LazarusAppWeb.ConnCase, async: true

  test "renders 404" do
    assert LazarusAppWeb.ErrorJSON.render("404.json", %{}) == %{errors: %{detail: "Not Found"}}
  end

  test "renders 500" do
    assert LazarusAppWeb.ErrorJSON.render("500.json", %{}) ==
             %{errors: %{detail: "Internal Server Error"}}
  end
end
