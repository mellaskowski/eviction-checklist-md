# Maryland Eviction Notice Screener (Houstory prototype)

Client-side React app (Vite). No backend, database, accounts, analytics, or storage. Answers live in React state only.

## Run
```
npm install
npm run dev        # local preview
npm run validate   # checks the decision tree, glossary, checklist and resources for broken references
npm run smoke      # renders every screen to catch runtime errors
npm run links      # checks every resource link (some government sites block bots; verify those by hand)
npm run build      # static files in dist/
```

## Where content lives (supplied by Houstory; no legal text is in components)
| File | Contents |
|---|---|
| `src/data/decisionTree.json` | Questions, routing, saved answers, and the outcome screens (from "Decision Tree Logic & Implementation Map") |
| `src/data/glossary.json` | Glossary (from "Legalese to Human"; a few checklist-only terms are provisional) |
| `src/data/checklist.json` | The full Eviction & Housing Court Checklist |
| `src/data/resources.json` | Resources (Federal and Maryland/Baltimore sheets plus those named in the decision-tree document) |
| `src/data/disclaimer.js` | Required disclaimer, verbatim |
| `src/styles/tokens.css` | Brand tokens from the Houstory Brand Guide |
| `public/` | Logo, wordmark, favicon (from Houstory) |

## Decision tree schema
```
Question: { "type": "question", "text", "help", "options": [ { "label", "next", "set": { "key": value }, "icon" } ] }
Result:   { "type": "result", "title", "summaryItems": [ { "label", "text", "showIf": { "key": value } } ],
            "glossaryIds": [], "actionChecklist": [], "resources": [ { "id", "note", "phone", "group" } ],
            "sectionIds": [] }
Alias:    { "type": "result", "alias": "<other result id>" }   (shares that result's content)
```
`set` saves an answer (for example `has_habitability_claim`). `showIf` shows a summary item only when the saved answers match.
Glossary terms: `{{term:escrow}}` or `{{term:escrow|Shown text}}` in any text field.

## Embedding
Render `<ScreenerApp />` (`src/components/ScreenerApp.jsx`) inside any React page and import `src/styles/tokens.css` once.
