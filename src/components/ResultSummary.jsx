import { useState } from "react";
import GlossaryText from "./GlossaryText.jsx";
import ProgressBar from "./ProgressBar.jsx";
import { Icon } from "./Icons.jsx";
import { matchesShowIf } from "../engine/screenerEngine.js";
import checklist from "../data/checklist.json";
import glossary from "../data/glossary.json";
import resources from "../data/resources.json";

const CATEGORY_ORDER = ["Legal Aid", "Financial Assistance", "Tenant Rights", "Student Support"];
const REGION_ORDER = ["Maryland", "Federal"];
const REGION_LABEL = { Maryland: "Maryland and Baltimore", Federal: "Federal" };
const rank = (order, v) => { const i = order.indexOf(v); return i === -1 ? 99 : i; };

function Resource({ r, note, phone }) {
  const text = note ?? r.description;
  const tel = phone ?? r.phone;
  return (
    <li className="resource">
      {r.subcategory && <span className="chip small">{r.subcategory}</span>}
      <h5>{r.name}</h5>
      {text && <p>{text}</p>}
      {r.restrictions && <p className="note"><strong>Eligibility notes:</strong> {r.restrictions}</p>}
      {r.source && <p className="source">Source: {r.source}</p>}
      <div className="resource-links">
        {r.url && (
          <a href={r.url} target="_blank" rel="noopener noreferrer">
            <Icon.external /> Visit website
          </a>
        )}
        {tel && (
          <a href={`tel:${tel.replace(/[^+\d]/g, "")}`}>
            <Icon.phone /> {tel}
          </a>
        )}
      </div>
    </li>
  );
}

function Item({ id, item, checked, toggle }) {
  return (
    <li className="check-item">
      <label>
        <input type="checkbox" checked={!!checked[id]} onChange={() => toggle(id)} />
        <span>
          {item.label && <strong className="lead">{item.label}</strong>}{" "}
          <GlossaryText text={item.text} />
        </span>
      </label>
      {item.subitems && (
        <ul className="check-list sub">
          {item.subitems.map((s, j) => (
            <li key={j} className="check-item">
              <label>
                <input type="checkbox" checked={!!checked[`${id}.${j}`]} onChange={() => toggle(`${id}.${j}`)} />
                <span>{s}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Tip({ lines }) {
  return (
    <div className="tip">
      <Icon.bulb />
      <div>
        <p><strong className="tip-label">Houstory Pro-Tip:</strong> <GlossaryText text={lines[0]} /></p>
        {lines.slice(1).map((l, i) => (
          <p key={i}><GlossaryText text={l} /></p>
        ))}
      </div>
    </div>
  );
}

export default function ResultSummary({ node, data = {}, onReset }) {
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const items = (node.summaryItems || []).filter((it) => matchesShowIf(it, data));
  const actions = node.actionChecklist || [];
  const done = actions.filter((_, i) => checked[`a.${i}`]).length;
  const terms = (node.glossaryIds || []).map((id) => glossary[id]);
  const sections = (node.sectionIds || []).map((id) => [id, checklist.sections[id]]);

  const refs = node.resources || [];
  const groups = [];
  refs.forEach((ref) => {
    const g = ref.group || "";
    const last = groups[groups.length - 1];
    if (last && last.g === g) last.refs.push(ref);
    else groups.push({ g, refs: [ref] });
  });

  const recIds = new Set(refs.map((r) => r.id));
  const moreIds = Object.keys(resources).filter((id) => !recIds.has(id));
  const moreCats = [...new Set(moreIds.map((id) => resources[id].category))]
    .sort((a, b) => rank(CATEGORY_ORDER, a) - rank(CATEGORY_ORDER, b));

  return (
    <section aria-labelledby="r-title" className="result">
      <h2 id="r-title" tabIndex={-1}>{node.title}</h2>

      {items.length > 0 && (
        <>
          <h3>What this means</h3>
          <ul className="summary-list">
            {items.map((it, i) => (
              <li key={i}>
                <strong className="lead">{it.label}</strong> <GlossaryText text={it.text} />
              </li>
            ))}
          </ul>
        </>
      )}

      {terms.length > 0 && (
        <>
          <h3>Terms to know</h3>
          <dl className="gloss">
            {terms.map((t) => (
              <div key={t.term}>
                <dt>{t.term}</dt>
                <dd>{t.definition}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      {actions.length > 0 && (
        <>
          <h3>Your action checklist</h3>
          <div className="sticky-progress">
            <ProgressBar value={done} max={actions.length} label="Action checklist progress" />
            <span aria-live="polite">{done} of {actions.length} done</span>
          </div>
          <ul className="check-list">
            {actions.map((a, i) => (
              <li key={i} className="check-item">
                <label>
                  <input type="checkbox" checked={!!checked[`a.${i}`]} onChange={() => toggle(`a.${i}`)} />
                  <span><GlossaryText text={a} /></span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}

      {refs.length > 0 && (
        <div className="resources-block">
          <h3>{node.resourceHeading ?? "Recommended resources"}</h3>
          {groups.map((grp, gi) => (
            <div key={gi}>
              {grp.g && <h4 className="grp">{grp.g}</h4>}
              <ul className="resource-grid">
                {grp.refs.map((ref) => (
                  <Resource key={ref.id} r={resources[ref.id]} note={ref.note} phone={ref.phone} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {moreIds.length > 0 && (
        <details className="cl-section full">
          <summary>
            <span className="sec-title">More help: all Maryland and federal resources</span>
            <span className="count">{moreIds.length}</span>
            <Icon.down className="sum-chevron" />
          </summary>
          <div className="sec-body">
            {moreCats.map((cat) => {
              const inCat = moreIds.filter((id) => resources[id].category === cat);
              const regions = [...new Set(inCat.map((id) => resources[id].region))]
                .sort((a, b) => rank(REGION_ORDER, a) - rank(REGION_ORDER, b));
              return (
                <details key={cat} className="cl-section">
                  <summary>
                    <span className="sec-title">{cat}</span>
                    <span className="count">{inCat.length}</span>
                    <Icon.down className="sum-chevron" />
                  </summary>
                  <div className="sec-body">
                    {regions.map((rg) => (
                      <div key={rg}>
                        <h4>{REGION_LABEL[rg] ?? rg}</h4>
                        <ul className="resource-grid">
                          {inCat.filter((id) => resources[id].region === rg).map((id) => (
                            <Resource key={id} r={resources[id]} />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </details>
      )}

      {sections.length > 0 && (
        <details className="cl-section full">
          <summary>
            <span className="sec-title">The full Eviction &amp; Housing Court Checklist</span>
            <Icon.down className="sum-chevron" />
          </summary>
          <div className="sec-body">
            <p className="sec-intro">{checklist.intro}</p>
            <div className="tip rights">
              <Icon.shield />
              <div>
                <p><strong className="tip-label">Houstory Pro-Tip:</strong> {checklist.rights.lead}</p>
                <ul className="plain">
                  {checklist.rights.items.map((r, i) => (
                    <li key={i}><strong className="lead">{r.label}</strong> {r.text}</li>
                  ))}
                </ul>
              </div>
            </div>
            {sections.map(([sid, sec]) => (
              <details key={sid} className="cl-section">
                <summary>
                  <span className="num">{sec.number}</span>
                  <span className="sec-title">{sec.title}</span>
                  <Icon.down className="sum-chevron" />
                </summary>
                <div className="sec-body">
                  <p className="sec-intro">{sec.intro}</p>
                  {sec.groups.map((g, gi) => (
                    <div key={gi}>
                      {g.heading && <h4>{g.heading}</h4>}
                      <ul className="check-list">
                        {g.items.map((it, ii) => (
                          <Item key={ii} id={`${sid}.${gi}.${ii}`} item={it} checked={checked} toggle={toggle} />
                        ))}
                      </ul>
                    </div>
                  ))}
                  {sec.tips.map((t, ti) => <Tip key={ti} lines={t.lines} />)}
                </div>
              </details>
            ))}
          </div>
        </details>
      )}

      <div className="actions">
        <button type="button" className="btn primary" onClick={() => window.print()}><Icon.print /> Print this page</button>
        <button type="button" className="btn" onClick={onReset}><Icon.restart /> Start over</button>
      </div>
    </section>
  );
}
