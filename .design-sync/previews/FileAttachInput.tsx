import { useState } from "react";
import { FileAttachInput } from "shelved";

// Sits in the Add / Book detail sheets, whose body is ~400px wide.
const sheet = { width: 400, padding: 16 } as const;

type Attached = { name: string; size: number; type?: string } | null;

export const NoFile = () => {
  const [file, setFile] = useState<Attached>(null);
  return (
    <div style={sheet}>
      <FileAttachInput file={file} onFileSelected={setFile} onClear={() => setFile(null)} />
    </div>
  );
};

export const AttachedEpub = () => {
  const [file, setFile] = useState<Attached>({
    name: "remains-of-the-day.epub",
    size: 1843200,
    type: "application/epub+zip",
  });
  return (
    <div style={sheet}>
      <FileAttachInput file={file} onFileSelected={setFile} onClear={() => setFile(null)} />
    </div>
  );
};

export const AttachedPdf = () => {
  const [file, setFile] = useState<Attached>({
    name: "braiding-sweetgrass-indigenous-wisdom-scientific-knowledge.pdf",
    size: 12582912,
    type: "application/pdf",
  });
  return (
    <div style={sheet}>
      <FileAttachInput file={file} onFileSelected={setFile} onClear={() => setFile(null)} />
    </div>
  );
};
