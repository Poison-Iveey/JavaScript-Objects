import { Modal, Button, FormField, Input } from "shelved";

const noop = () => {};

export const RenameShelf = () => (
  <Modal isOpen={true} onClose={noop} title="Rename shelf">
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormField label="Shelf name" id="shelf-name">
        <Input id="shelf-name" defaultValue="Summer 2026 reads" />
      </FormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </div>
  </Modal>
);
