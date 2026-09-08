"use client";

import { useEffect, useState } from "react";

/**
 * True once the image at `src` has actually loaded.
 *
 * An <img> rendered on the server can fail before React hydrates, so its
 * onError never fires. Preloading in an effect is what reliably tells us
 * whether a file exists, which is how the placeholders stay in place.
 */
export function useImageOk(src?: string | null) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!src) return;
    let alive = true;
    const img = new window.Image();
    img.onload = () => alive && setOk(true);
    img.onerror = () => alive && setOk(false);
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);

  // A src that was cleared can never be "ok", regardless of a past load.
  if (!src) return false;

  return ok;
}
