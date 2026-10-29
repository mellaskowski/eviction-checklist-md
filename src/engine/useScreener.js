import { useReducer, useMemo } from "react";
import { getNode } from "./screenerEngine.js";

// state.data holds saved answers like { notice_category: "FPR", cure_allowed: true }.
// Each history entry remembers the data from before that answer, so Back can undo it.
function reducer(state, action) {
  switch (action.type) {
    case "ANSWER":
      return {
        currentId: action.next,
        data: { ...state.data, ...(action.set || {}) },
        history: [...state.history, { nodeId: state.currentId, label: action.label, prevData: state.data }],
      };
    case "BACK": {
      if (!state.history.length) return state;
      const prev = state.history[state.history.length - 1];
      return { currentId: prev.nodeId, data: prev.prevData, history: state.history.slice(0, -1) };
    }
    case "RESET":
      return { currentId: action.start, data: {}, history: [] };
    default:
      return state;
  }
}

export function useScreener(tree) {
  const [state, dispatch] = useReducer(reducer, { currentId: tree.start, data: {}, history: [] });
  const node = useMemo(() => getNode(tree, state.currentId), [tree, state.currentId]);

  return {
    node,
    nodeId: state.currentId,
    data: state.data,
    history: state.history,
    canGoBack: state.history.length > 0,
    answer: (o) => dispatch({ type: "ANSWER", next: o.next, label: o.label, set: o.set }),
    back: () => dispatch({ type: "BACK" }),
    reset: () => dispatch({ type: "RESET", start: tree.start }),
  };
}
