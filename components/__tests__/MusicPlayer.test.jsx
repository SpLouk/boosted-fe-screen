/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import MusicPlayer from "../MusicPlayer";
const songList = require("../../pages/songlist.json");

describe("MusicPlayer", () => {
  it("user clicks next button on shuffle mode, then clicks back", () => {
    render(<MusicPlayer songList={songList.songs} />);

    const nextButton = screen.getByRole("button", { name: "Next Song" });
    const prevButton = screen.getByRole("button", { name: "Previous Song" });
    expect(screen.getByText("The Tallest Man on Earth")).toBeInTheDocument();

    fireEvent.click(nextButton);
    expect(
      screen.queryByText("The Tallest Man on Earth")
    ).not.toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(screen.getByText("The Tallest Man on Earth")).toBeInTheDocument();
  });

  it("user clicks next on repeat mode", () => {
    render(<MusicPlayer songList={songList.songs} />);

    const repeatButton = screen.getByRole("button", { name: "Repeat Song" });
    const nextButton = screen.getByRole("button", { name: "Next Song" });
    const prevButton = screen.getByRole("button", { name: "Previous Song" });
    expect(screen.getByText("The Tallest Man on Earth")).toBeInTheDocument();

    fireEvent.click(repeatButton);
    fireEvent.click(nextButton);
    expect(screen.getByText("The Tallest Man on Earth")).toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(screen.getByText("The Tallest Man on Earth")).toBeInTheDocument();
  });

  it("user can hit play, the song scrub position increases", async () => {
    render(<MusicPlayer songList={songList.songs} />);

    const playButton = screen.getByRole("button", { name: "Play Song" });

    const scrubber = screen.getByRole("slider");

    expect(scrubber.value).toBe("0");
    // Start playing
    fireEvent.click(playButton);

    await act(async () => {
      // Wait for a second to let the scrub position increase
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    expect(scrubber.value).toBe("1");
  });
});
