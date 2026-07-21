import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubscriptionCard } from "./SubscriptionCard";

describe("SubscriptionCard", () => {
  it("shows Activa and the renewal date for an active subscription", () => {
    render(
      <SubscriptionCard
        subscription={{ status: "ACTIVE", renewsAt: "2026-08-01" }}
      />,
    );

    expect(screen.getByText("Activa")).toBeInTheDocument();
    expect(screen.getByText("1 de agosto de 2026")).toBeInTheDocument();
  });

  it("shows Inactiva for an inactive subscription", () => {
    render(
      <SubscriptionCard
        subscription={{ status: "INACTIVE", renewsAt: null }}
      />,
    );

    expect(screen.getByText("Inactiva")).toBeInTheDocument();
  });
});
