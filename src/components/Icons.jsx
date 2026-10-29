// Small inline icons (no extra libraries). Each accepts className.
const base = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
  "aria-hidden": true, focusable: "false",
};
const make = (d) => (p) => <svg {...base} {...p}>{d}</svg>;

export const Icon = {
  rent: make(<><circle cx="12" cy="12" r="9" /><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2-.4-2.5-1.2M12 6.5V8m0 8v1.5" /></>),
  lease: make(<><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9.5 12h5M9.5 16h5" /></>),
  key: make(<><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3M14 9l2 2" /></>),
  chevron: make(<path d="M9 6l6 6-6 6" />),
  down: make(<path d="M6 9l6 6 6-6" />),
  back: make(<path d="M15 6l-6 6 6 6" />),
  shield: make(<><path d="M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>),
  info: make(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  bulb: make(<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />),
  print: make(<><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><path d="M7 14h10v7H7z" /></>),
  restart: make(<path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4" />),
  external: make(<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />),
  phone: make(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />),
  help: make(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" /></>),
  house: make(<path d="M3 11l9-8 9 8M5 10v10h14V10" />),
};
