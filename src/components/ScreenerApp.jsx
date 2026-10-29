import { useEffect, useRef } from "react";
import tree from "../data/decisionTree.json";
import { useScreener } from "../engine/useScreener.js";
import { remainingQuestions } from "../engine/screenerEngine.js";
import QuestionStep from "./QuestionStep.jsx";
import ResultSummary from "./ResultSummary.jsx";
import Disclaimer from "./Disclaimer.jsx";
import ProgressBar from "./ProgressBar.jsx";
import Logo from "./Logo.jsx";
import { Icon } from "./Icons.jsx";

export default function ScreenerApp() {
  const { node, nodeId, data, history, canGoBack, answer, back, reset } = useScreener(tree);
  const mainRef = useRef(null);
  const isQuestion = node.type === "question";
  const current = history.length + 1;
  const total = history.length + remainingQuestions(tree, nodeId);

  // Move keyboard/screen-reader focus to the new heading on every step.
  useEffect(() => {
    mainRef.current?.querySelector("h2")?.focus();
  }, [nodeId]);

  return (
    <div className="app">
      <header className="hero">
        <div className="wrap">
          <Logo />
          <h1>Maryland Eviction Notice Screener</h1>
          <p className="hero-sub">
            Got a notice and not sure what it means? Answer a few questions and we’ll walk you through it in plain language.
          </p>
          <p className="privacy">
            <Icon.shield /> Your answers stay in this browser tab and are never sent anywhere.
          </p>
        </div>
      </header>

      <main ref={mainRef} className="wrap grow">
        <div className="card">
          {isQuestion && (
            <div className="step-meta">
              {canGoBack ? (
                <button type="button" className="link-button back" onClick={back}>
                  <Icon.back /> Back
                </button>
              ) : (
                <span />
              )}
              <span aria-live="polite">Question {current}</span>
            </div>
          )}
          {isQuestion && <ProgressBar value={current - 1} max={total} label="Screener progress" />}

          <div className="step" key={nodeId}>
            {isQuestion ? (
              <QuestionStep node={node} onAnswer={answer} />
            ) : (
              <ResultSummary node={node} data={data} onReset={reset} />
            )}
          </div>
        </div>
      </main>

      <footer className="brand-foot wrap">
        <img src={`${import.meta.env.BASE_URL}wordmark-teal.png`} alt="Houstory" height="26" />
        <span>Rent with Confidence</span>
      </footer>

      <Disclaimer />
    </div>
  );
}
