import { ConfirmDialog } from "shelved";

const noop = () => {};

export const RemoveBook = () => (
  <ConfirmDialog
    isOpen={true}
    onClose={noop}
    onConfirm={noop}
    title="Remove this book?"
    message={`"Piranesi" will be removed from your library.`}
    confirmLabel="Remove"
  />
);
