"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * 움직임을 줄여 달라는 설정을 실제로 따르게 한다.
 *
 * ⚠️ globals.css 에 prefers-reduced-motion 블록을 두어 "움직임을 껐다" 고
 *    여겨 왔다. 그런데 이 앱의 움직임은 대부분 CSS 가 아니라 Framer Motion 이
 *    자바스크립트로 인라인 style 을 고쳐 만든다. CSS 규칙은 거기에 닿지
 *    않는다 — 어지럼증 때문에 움직임을 꺼 둔 사람에게 화면이 그대로 밀려
 *    들어오고 있었다.
 *
 * MotionConfig 의 reducedMotion="user" 는 그 설정을 Framer 에게도 알려 준다.
 * 위치나 크기가 움직이는 애니메이션은 즉시 끝나고, 색과 투명도처럼 어지럽지
 * 않은 것만 남는다.
 */
export function MotionGuard({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
