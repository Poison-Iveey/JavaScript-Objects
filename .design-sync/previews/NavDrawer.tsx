import { NavDrawer } from "shelved";

const noop = () => {};

export const Open = () => <NavDrawer isOpen={true} onClose={noop} />;
