import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AssistantList } from "./AssistantList";

describe("AssistantList", () => {
  it("shows each assistant's name, email, and Activa status", () => {
    render(
      <AssistantList
        assistants={[
          { id: "a1", name: "Carla Rojas", email: "carla@alivia.bo" },
          { id: "a2", name: "Beto Vargas", email: "beto@alivia.bo" },
        ]}
      />,
    );

    expect(screen.getByText("Carla Rojas")).toBeInTheDocument();
    expect(screen.getByText("carla@alivia.bo")).toBeInTheDocument();
    expect(screen.getByText("Beto Vargas")).toBeInTheDocument();
    expect(screen.getAllByText("Activa")).toHaveLength(2);
  });

  it("shows an empty state when there are no assistants", () => {
    render(<AssistantList assistants={[]} />);

    expect(
      screen.getByText("Todavía no tienes asistentes."),
    ).toBeInTheDocument();
  });
});
