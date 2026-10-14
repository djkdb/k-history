"use client";

import { useCallback, useEffect, useState } from "react";
import { COURSE } from "./course";
import { KEY } from "./course-id";
import type { Question } from "./types";

/**
 * 문제 모음 — 강의 PDF의 Quiz 슬라이드 원문(pdf) / 강의 내용으로 만든 추가 문제(extra) / 전부.
 * PDF 퀴즈가 있는 과목에서만 고를 수 있고, 기본은 PDF 퀴즈다.
 */
export type QSet = "pdf" | "extra" | "all";

export const HAS_PDF = COURSE.questions.some((q) => q.src === "pdf");

export const QSET_LABEL: Record<QSet, string> = {
  pdf: "강의 PDF 퀴즈",
  extra: "추가 문제",
  all: "전부",
};

export function inSet(q: Question, set: QSet): boolean {
  if (!HAS_PDF || set === "all") return true;
  return set === "pdf" ? q.src === "pdf" : q.src !== "pdf";
}

const K = `${KEY}:qset`;

/** 고른 모음을 이 기기에 기억한다 (퀴즈와 모의고사가 같이 쓴다) */
export function useQSet() {
  const [set, setSet] = useState<QSet>(HAS_PDF ? "pdf" : "all");
  useEffect(() => {
    if (!HAS_PDF) return;
    try {
      const v = localStorage.getItem(K);
      if (v === "pdf" || v === "extra" || v === "all") setSet(v);
    } catch {
      /* 기본값으로 */
    }
  }, []);
  const choose = useCallback((v: QSet) => {
    setSet(v);
    try {
      localStorage.setItem(K, v);
    } catch {
      /* 무시 */
    }
  }, []);
  return [set, choose] as const;
}
