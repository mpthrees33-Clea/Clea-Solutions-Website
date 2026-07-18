import { Fragment } from "react";

export type FlowNode = { title: string; detail?: string };
export type FlowStep = FlowNode | { parallel: FlowNode[] };

function Node({ node }: { node: FlowNode }) {
  return (
    <div className="mflow-node">
      <div className="mflow-title mono">{node.title}</div>
      {node.detail && <div className="mflow-detail">{node.detail}</div>}
    </div>
  );
}

/**
 * Phone-width rendering of the case-study architecture diagrams. The ASCII
 * <pre> boards need ~400px+ of line width and can only sideways-scroll on
 * phones, so ≤720px swaps them for this vertical flow (see .diagram-desktop /
 * .diagram-mobile in globals.css). Content must mirror the ASCII version 1:1.
 */
export default function MobileFlow({
  steps,
  footers = [],
}: {
  steps: FlowStep[];
  footers?: string[];
}) {
  return (
    <div className="mflow panel">
      {steps.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <div className="mflow-arrow mono" aria-hidden>
              ↓
            </div>
          )}
          {"parallel" in s ? (
            <div className="mflow-parallel">
              {s.parallel.map((n) => (
                <Node key={n.title} node={n} />
              ))}
            </div>
          ) : (
            <Node node={s} />
          )}
        </Fragment>
      ))}
      {footers.length > 0 && (
        <div className="mflow-footers">
          {footers.map((f) => (
            <div key={f} className="mflow-footer mono">
              {f}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
