// Pure functions. No React, no DOM. Easy to test and reuse.

// Follows "alias" pointers so two result ids can share one set of content.
export function getNode(tree, id, depth = 0) {
  const node = tree.nodes[id];
  if (!node) throw new Error(`Decision tree has no node "${id}"`);
  if (node.alias && depth < 5) return getNode(tree, node.alias, depth + 1);
  return node;
}

// Split text containing {{term:key}} or {{term:key|shown text}} markers.
export function parseGlossaryText(text) {
  const parts = [];
  const re = /\{\{term:([a-z0-9_]+)(?:\|([^}]*))?\}\}/gi;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: "term", key: m[1], label: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}

// An item with showIf {key: value} only appears when the saved answers match.
export const matchesShowIf = (item, data) =>
  !item.showIf || Object.entries(item.showIf).every(([k, v]) => data[k] === v);

// Questions left on the longest path, counting the current one (for the progress bar).
export function remainingQuestions(tree, id, seen = new Set()) {
  const n = tree.nodes[id];
  if (!n || n.type !== "question" || seen.has(id)) return 0;
  const next = new Set(seen).add(id);
  return 1 + Math.max(0, ...n.options.map((o) => remainingQuestions(tree, o.next, next)));
}

// Returns a list of problems. Empty list = structurally sound.
export function validateTree(tree, { glossary = {}, checklist = {}, resources = {} } = {}) {
  const errors = [];
  const nodes = tree.nodes || {};
  if (!nodes[tree.start]) errors.push(`start node "${tree.start}" does not exist`);

  const checkText = (id, text) => {
    for (const p of parseGlossaryText(text || "")) {
      if (p.type === "term" && !glossary[p.key]) errors.push(`${id}: glossary term "${p.key}" is not defined`);
    }
  };

  for (const [id, n] of Object.entries(nodes)) {
    if (n.alias) {
      if (!nodes[n.alias]) errors.push(`${id}: alias points to missing node "${n.alias}"`);
      continue;
    }
    if (n.type === "question") {
      if (!n.text) errors.push(`${id}: question has no text`);
      if (!n.options?.length) errors.push(`${id}: question has no options (dead end)`);
      checkText(id, n.text);
      checkText(id, n.help);
      for (const o of n.options || []) {
        if (!o.label) errors.push(`${id}: option missing label`);
        if (!nodes[o.next]) errors.push(`${id}: option "${o.label}" points to missing node "${o.next}"`);
      }
    } else if (n.type === "result") {
      if (!n.title) errors.push(`${id}: result has no title`);
      (n.summaryItems || []).forEach((s) => { if (!s.text) errors.push(`${id}: summary item has no text`); checkText(id, s.text); });
      (n.actionChecklist || []).forEach((t) => checkText(id, t));
      (n.glossaryIds || []).forEach((g) => !glossary[g] && errors.push(`${id}: unknown glossary id "${g}"`));
      (n.resources || []).forEach((r) => !resources[r.id] && errors.push(`${id}: unknown resource id "${r.id}"`));
      (n.sectionIds || []).forEach((c) => !checklist.sections?.[c] && errors.push(`${id}: unknown checklist section "${c}"`));
    } else {
      errors.push(`${id}: unknown node type "${n.type}"`);
    }
  }

  for (const [rid, r] of Object.entries(resources)) {
    if (!r.name) errors.push(`resource ${rid}: missing name`);
    if (!r.category) errors.push(`resource ${rid}: missing category`);
    if (!r.region) errors.push(`resource ${rid}: missing region`);
    if (r.url && !/^https?:\/\/\S+$/.test(r.url)) errors.push(`resource ${rid}: url looks wrong "${r.url}"`);
  }

  const strings = [];
  const walk = (v) => {
    if (typeof v === "string") strings.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(checklist);
  strings.forEach((t) => checkText("checklist", t));

  // Orphans: nodes unreachable from the start
  const seen = new Set();
  const stack = [tree.start];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id) || !nodes[id]) continue;
    seen.add(id);
    if (nodes[id].alias) stack.push(nodes[id].alias);
    (nodes[id].options || []).forEach((o) => stack.push(o.next));
  }
  for (const id of Object.keys(nodes)) if (!seen.has(id)) errors.push(`${id}: unreachable from start (orphan node)`);

  return errors;
}
