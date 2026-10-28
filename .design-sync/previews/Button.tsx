import { Button } from "shelved";

// Button is full-width by design (it fills its container, as in the app's
// forms and sheets) - so previews size it with the surrounding layout.
const stack = { display: "flex", flexDirection: "column", gap: 12, padding: 16, maxWidth: 340 } as const;

export const Variants = () => (
  <div style={stack}>
    <Button variant="primary">Save changes</Button>
    <Button variant="secondary">Add a book</Button>
    <Button variant="ghost">Cancel</Button>
    <Button variant="danger">Remove book</Button>
  </div>
);

export const Disabled = () => (
  <div style={stack}>
    <Button variant="primary" disabled>
      Please wait…
    </Button>
    <Button variant="secondary" disabled>
      Add a book
    </Button>
  </div>
);

export const FormActions = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 16, maxWidth: 400 }}>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary" type="submit">
      Add to shelf
    </Button>
  </div>
);
