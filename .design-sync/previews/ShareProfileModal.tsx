import { ShareProfileModal, ShelvedProvider, SAMPLE_USER } from "shelved";

const noop = () => {};

export const PublicProfile = () => <ShareProfileModal isOpen={true} onClose={noop} />;

export const PrivateProfile = () => (
  <ShelvedProvider user={{ ...SAMPLE_USER, isProfilePublic: false }} animations={false}>
    <ShareProfileModal isOpen={true} onClose={noop} />
  </ShelvedProvider>
);
