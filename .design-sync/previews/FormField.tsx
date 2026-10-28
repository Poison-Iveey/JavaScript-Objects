import { useState } from "react";
import { FormField, Input, ShelvedProvider } from "shelved";

const stack = { display: "flex", flexDirection: "column", gap: 16, padding: 16, maxWidth: 340 } as const;

export const ProfileFields = () => {
  const [name, setName] = useState("Maya Okafor");
  const [email, setEmail] = useState("maya.reads@example.com");
  return (
    <div style={stack}>
      <FormField label="Display name" id="profile-name">
        <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>
      <FormField label="Email" id="profile-email">
        <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormField>
    </div>
  );
};

export const WithError = () => {
  const [password, setPassword] = useState("shelf");
  return (
    <div style={stack}>
      <FormField label="Password" id="signup-password" error="Password must be at least 6 characters.">
        <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormField>
    </div>
  );
};

export const BookDetails = () => {
  const [title, setTitle] = useState("Braiding Sweetgrass");
  const [author, setAuthor] = useState("Robin Wall Kimmerer");
  const [pages, setPages] = useState("408");
  return (
    <div style={stack}>
      <FormField label="Title" id="book-title">
        <Input id="book-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>
      <FormField label="Author" id="book-author">
        <Input id="book-author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      </FormField>
      <FormField label="Pages" id="book-pages">
        <Input id="book-pages" type="number" value={pages} onChange={(e) => setPages(e.target.value)} />
      </FormField>
    </div>
  );
};

export const DarkTheme = () => {
  const [title, setTitle] = useState("Piranesi");
  return (
    <ShelvedProvider theme="dark" animations={false}>
      <div data-theme="dark" style={{ background: "var(--bg-app)", padding: 16, maxWidth: 372 }}>
        <div style={{ ...stack, padding: 16, background: "var(--bg-surface)", borderRadius: 16 }}>
          <FormField label="Title" id="dark-book-title">
            <Input id="dark-book-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>
          <FormField label="Pages" id="dark-book-pages" error="Enter a number of pages.">
            <Input id="dark-book-pages" type="number" placeholder="e.g. 272" />
          </FormField>
        </div>
      </div>
    </ShelvedProvider>
  );
};
