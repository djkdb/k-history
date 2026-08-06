"use client";

import type { Infographic } from "@/lib/types";
import { TimelineGraphic } from "./timeline-graphic";
import { PyramidGraphic } from "./pyramid-graphic";
import { OrgChartGraphic } from "./orgchart-graphic";
import { CompareGraphic } from "./compare-graphic";
import { FlowGraphic } from "./flow-graphic";
import { StatGraphic } from "./stat-graphic";

/** spec 종류에 맞는 애니메이션 컴포넌트로 분기 */
export function InfographicView({
  spec,
  color,
}: {
  spec: Infographic;
  color: string;
}) {
  switch (spec.kind) {
    case "timeline":
      return <TimelineGraphic spec={spec} color={color} />;
    case "pyramid":
      return <PyramidGraphic spec={spec} color={color} />;
    case "orgchart":
      return <OrgChartGraphic spec={spec} color={color} />;
    case "compare":
      return <CompareGraphic spec={spec} color={color} />;
    case "flow":
      return <FlowGraphic spec={spec} color={color} />;
    case "stat":
      return <StatGraphic spec={spec} color={color} />;
  }
}

export * from "./derive";
