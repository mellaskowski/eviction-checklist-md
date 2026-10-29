import GlossaryText from "./GlossaryText.jsx";
import { Icon } from "./Icons.jsx";

export default function QuestionStep({ node, onAnswer }) {
  // If every option has an "icon" field, show big cards. Otherwise show a list.
  const withIcons = node.options.every((o) => o.icon && Icon[o.icon]);
  return (
    <section aria-labelledby="q-text">
      <h2 id="q-text" tabIndex={-1}>
        <GlossaryText text={node.text} />
      </h2>
      {node.help && (
        <p className="help">
          <GlossaryText text={node.help} />
        </p>
      )}
      <div className={withIcons ? "options cards" : "options"}>
        {node.options.map((o) => {
          const Ico = withIcons ? Icon[o.icon] : null;
          return (
            <button key={o.label} type="button" className="option" onClick={() => onAnswer(o)}>
              {Ico && <span className="option-icon"><Ico /></span>}
              <span className="option-label">{o.label}</span>
              <Icon.chevron className="option-chevron" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
