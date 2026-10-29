import { useState } from "react";
import { parseGlossaryText } from "../engine/screenerEngine.js";
import glossary from "../data/glossary.json";

// Renders text, turning {{term:key|shown text}} into tap-to-open definition buttons.
export default function GlossaryText({ text }) {
  const [openKey, setOpenKey] = useState(null);
  const parts = parseGlossaryText(text);
  const open = openKey && glossary[openKey];

  return (
    <>
      {parts.map((p, i) =>
        p.type === "text" ? (
          <span key={i}>{p.value}</span>
        ) : (
          <button
            key={i}
            type="button"
            className="term"
            aria-expanded={openKey === p.key}
            onClick={() => setOpenKey(openKey === p.key ? null : p.key)}
          >
            {p.label ?? glossary[p.key]?.term ?? p.key}
          </button>
        )
      )}
      {open && (
        <span className="definition" role="note">
          <strong>{open.term}:</strong> {open.definition}
        </span>
      )}
    </>
  );
}
