"use client";

import { useEffect } from "react";

export default function ExitWarning() {
  useEffect(() => {

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; 
    };


    const handlePopState = (e: PopStateEvent) => {

      const confirmation = window.confirm(
        "Masz niezapisane zmiany. Czy na pewno chcesz opuścić tę stronę?"
      );

      if (!confirmation) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}