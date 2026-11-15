import { Fragment } from "react";

// Renders a bold statement or subtitle with every full stop in brand red.
// Pass plain text only: <Stops>Blanked is a marketplace.</Stops>
export function Stops({ children }: { children: string }) {
  const parts = children.split(".");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-accent">.</span>}
        </Fragment>
      ))}
    </>
  );
}
