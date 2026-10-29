import { useState } from "react";
import { DISCLAIMER, DISCLAIMER_TITLE } from "../data/disclaimer.js";
import { Icon } from "./Icons.jsx";

// Pinned to the bottom of the screen on every page. On phones the text is
// shortened to two lines with a "Read full disclaimer" toggle; the full text is always in the page.
export default function Disclaimer() {
  const [open, setOpen] = useState(false);
  return (
    <aside className="disclaimer" aria-label="Educational self-help disclaimer">
      <Icon.info />
      <div className={open ? "disc-text open" : "disc-text"}>
        <p><strong>{DISCLAIMER_TITLE}</strong> {DISCLAIMER}</p>
        <button type="button" className="link-button disc-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "Show less" : "Read full disclaimer"}
        </button>
      </div>
    </aside>
  );
}
