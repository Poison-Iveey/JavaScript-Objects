import { useState } from "react";
import { RatingControl, ShelvedProvider } from "shelved";

// "Your rating" field in BookDetailSheet: a 1-10 scale in two rows of five.
const field = { maxWidth: 400, padding: 16 } as const;

export const Unrated = () => {
  const [rating, setRating] = useState<number | null>(null);
  return (
    <div style={field}>
      <RatingControl value={rating} onChange={setRating} />
    </div>
  );
};

export const RatedEight = () => {
  const [rating, setRating] = useState<number | null>(8);
  return (
    <div style={field}>
      <RatingControl value={rating} onChange={setRating} />
    </div>
  );
};

export const RatedThree = () => {
  const [rating, setRating] = useState<number | null>(3);
  return (
    <div style={field}>
      <RatingControl value={rating} onChange={setRating} />
    </div>
  );
};

export const Perfect = () => {
  const [rating, setRating] = useState<number | null>(10);
  return (
    <div style={field}>
      <RatingControl value={rating} onChange={setRating} />
    </div>
  );
};

// Night mode: gold-filled steps on violet.
export const RatedSevenDark = () => {
  const [rating, setRating] = useState<number | null>(7);
  return (
    <ShelvedProvider animations={false} theme="dark">
      {/* data-theme on the wrapper: the provider only sets it on <html>, where the outer light provider wins. */}
    <div data-theme="dark" style={{ maxWidth: 432, background: "var(--bg-app)", color: "var(--text-primary)", padding: 8 }}>
        <div style={field}>
          <RatingControl value={rating} onChange={setRating} />
        </div>
      </div>
    </ShelvedProvider>
  );
};
