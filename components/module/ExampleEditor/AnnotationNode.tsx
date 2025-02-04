import { memo } from "react";

interface AnnotationNodeProps {
  data: {
    level: number;
    label: string;
    arrowStyle?: React.CSSProperties;
  };
}

function AnnotationNode({ data }: AnnotationNodeProps) {
  return (
    <>
      <div className="annotation-content">
        <div className="annotation-level">{data.level}.</div>
        <div>{data.label}</div>
      </div>
      {data.arrowStyle && (
        <div className="annotation-arrow" style={data.arrowStyle}>
          ⤹
        </div>
      )}
    </>
  );
}

export default memo(AnnotationNode);
