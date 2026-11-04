"use client";

/**
 * Substituto estático do `motion/react`.
 *
 * As duas landing pages pediram para remover TODAS as animações (efeitos de
 * entrada, revelações no scroll, pulsos, gráficos animando) e para ficar mais
 * leves no mobile. Em vez de reescrever o JSX de ~20 componentes, trocamos o
 * import de "motion/react" por este módulo: cada `motion.x` renderiza direto no
 * estado final (sem transição), e os hooks viram versões inertes. Resultado:
 * markup estático, nenhum trabalho de animação na main thread e o pacote do
 * framer-motion sai do bundle das landing pages.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { forwardRef, createElement, useRef, Fragment, type ReactNode } from "react";

/* ---------- MotionValue mínimo e reativo ---------- */

class MV<T = any> {
  _v: T;
  _subs = new Set<(v: T) => void>();
  __isMV = true;
  constructor(v: T) {
    this._v = v;
  }
  get() {
    return this._v;
  }
  set(v: T) {
    this._v = v;
    this._subs.forEach((cb) => {
      try {
        cb(v);
      } catch {}
    });
  }
  on(_event: string, cb: (v: T) => void) {
    this._subs.add(cb);
    return () => {
      this._subs.delete(cb);
    };
  }
  get current() {
    return this._v;
  }
  stop() {}
  destroy() {}
  isAnimating() {
    return false;
  }
  getVelocity() {
    return 0;
  }
  setWithVelocity(_prev: T, v: T) {
    this.set(v);
  }
}

export type MotionValue<T = any> = MV<T>;

const isMV = (v: any): v is MV => v != null && typeof v === "object" && v.__isMV === true;
const resolve = (v: any) => (isMV(v) ? v.get() : v);
const last = (v: any) => (Array.isArray(v) ? v[v.length - 1] : v);

/* ---------- Conversão do alvo da animação em estilo final ---------- */

const TRANSFORM_KEYS = new Set([
  "x", "y", "z", "translateX", "translateY", "translateZ",
  "scale", "scaleX", "scaleY", "scaleZ",
  "rotate", "rotateX", "rotateY", "rotateZ",
  "skew", "skewX", "skewY", "perspective",
]);
const UNIT: Record<string, string> = {
  x: "px", y: "px", z: "px", translateX: "px", translateY: "px", translateZ: "px", perspective: "px",
  rotate: "deg", rotateX: "deg", rotateY: "deg", rotateZ: "deg", skew: "deg", skewX: "deg", skewY: "deg",
};
// Props de animação que nunca devem chegar ao DOM.
const DROP_IN_TARGET = new Set(["pathLength", "pathOffset", "pathSpacing", "transition"]);

function fmtTransform(key: string, raw: any) {
  const name = key === "x" ? "translateX" : key === "y" ? "translateY" : key === "z" ? "translateZ" : key;
  const unit = typeof raw === "number" && UNIT[key] ? UNIT[key] : "";
  return `${name}(${raw}${unit})`;
}

function buildStyle(style: any, target: any) {
  const out: Record<string, any> = {};
  const transforms: string[] = [];

  if (style) {
    for (const k in style) {
      const val = resolve(style[k]);
      if (TRANSFORM_KEYS.has(k)) transforms.push(fmtTransform(k, val));
      else out[k] = val;
    }
  }
  if (target && typeof target === "object" && !Array.isArray(target)) {
    for (const k in target) {
      if (DROP_IN_TARGET.has(k)) continue;
      const val = last(target[k]);
      if (val == null) continue;
      if (TRANSFORM_KEYS.has(k)) transforms.push(fmtTransform(k, val));
      else out[k] = val;
    }
  }
  if (transforms.length) {
    out.transform = out.transform ? `${out.transform} ${transforms.join(" ")}` : transforms.join(" ");
  }
  return out;
}

/* ---------- Proxy do `motion` ---------- */

// Props exclusivas do motion que devem ser removidas antes de ir ao DOM.
const MOTION_PROPS = [
  "initial", "animate", "exit", "whileInView", "whileHover", "whileTap", "whileFocus",
  "whileDrag", "transition", "variants", "viewport", "custom", "inherit",
  "layout", "layoutId", "layoutDependency", "layoutScroll", "layoutRoot",
  "drag", "dragConstraints", "dragElastic", "dragMomentum", "dragListener",
  "dragControls", "dragSnapToOrigin", "dragTransition", "dragPropagation",
  "onDrag", "onDragStart", "onDragEnd", "onDirectionLock",
  "onViewportEnter", "onViewportLeave", "onUpdate",
  "onAnimationStart", "onAnimationComplete",
  "onHoverStart", "onHoverEnd", "onTap", "onTapStart", "onTapCancel",
  "onPan", "onPanStart", "onPanEnd",
] as const;

const cache = new Map<string, any>();

function getComponent(tag: string) {
  if (!cache.has(tag)) {
    const Comp = forwardRef(function MotionStatic(props: any, ref: any) {
      const clean: Record<string, any> = {};
      for (const key in props) {
        if ((MOTION_PROPS as readonly string[]).includes(key)) continue;
        if (key === "style") continue;
        clean[key] = props[key];
      }
      const target =
        props.animate && typeof props.animate === "object" && !Array.isArray(props.animate)
          ? props.animate
          : props.whileInView && typeof props.whileInView === "object"
            ? props.whileInView
            : undefined;
      clean.style = buildStyle(props.style, target);
      clean.ref = ref;
      return createElement(tag, clean);
    });
    Comp.displayName = `motion.${tag}`;
    cache.set(tag, Comp);
  }
  return cache.get(tag);
}

export const motion: any = new Proxy(
  {},
  {
    get: (_t, tag: string) => getComponent(tag),
  },
);

/* ---------- AnimatePresence ---------- */

export function AnimatePresence({ children }: { children?: ReactNode; [key: string]: any }) {
  return createElement(Fragment, null, children);
}

/* ---------- Hooks inertes ---------- */

export function useMotionValue<T = any>(init: T): MV<T> {
  const ref = useRef<MV<T> | null>(null);
  if (!ref.current) ref.current = new MV<T>(init);
  return ref.current;
}

export function useTransform(value: any, transformer: (v: any) => any): MV;
export function useTransform(value: any, inputRange: readonly any[], outputRange: readonly any[], options?: any): MV;
export function useTransform(transformer: () => any): MV;
export function useTransform(a: any, b?: any, c?: any, _d?: any): MV {
  const ref = useRef<MV | null>(null);
  if (!ref.current) {
    let mv: MV;
    if (typeof a === "function") {
      let initial: any;
      try {
        initial = a();
      } catch {
        initial = 0;
      }
      mv = new MV(initial);
    } else if (typeof b === "function") {
      const src = a;
      const map = b;
      mv = new MV(map(src && src.get ? src.get() : 0));
      if (src && typeof src.on === "function") src.on("change", (v: any) => mv.set(map(v)));
    } else {
      // useTransform(source, inputRange, outputRange): estado final = 1º de saída.
      mv = new MV(Array.isArray(c) ? c[0] : 0);
    }
    ref.current = mv;
  }
  return ref.current;
}

export function useSpring(source?: any, _config?: any): MV {
  const ref = useRef<MV | null>(null);
  if (!ref.current) {
    ref.current = isMV(source) ? source : new MV(typeof source === "number" ? source : 0);
  }
  return ref.current;
}

export function useMotionTemplate(strings: TemplateStringsArray, ...values: any[]): MV<string> {
  const ref = useRef<MV<string> | null>(null);
  if (!ref.current) {
    const str = strings.reduce(
      (acc, s, i) => acc + s + (i < values.length ? String(resolve(values[i])) : ""),
      "",
    );
    ref.current = new MV(str);
  }
  return ref.current;
}

export function useScroll(_options?: any): {
  scrollX: MV;
  scrollY: MV;
  scrollXProgress: MV;
  scrollYProgress: MV;
} {
  const ref = useRef<any>(null);
  if (!ref.current) {
    ref.current = {
      scrollX: new MV(0),
      scrollY: new MV(0),
      scrollXProgress: new MV(0),
      scrollYProgress: new MV(0),
    };
  }
  return ref.current;
}

export function useMotionValueEvent(_value?: any, _name?: any, _callback?: (v: any) => void): void {}

export function useReducedMotion(): boolean {
  return true;
}

export function useInView(_ref?: any, _options?: any): boolean {
  return true;
}

/* ---------- animate() imperativo ---------- */

export function animate(target: any, to: any, options?: any): any {
  try {
    if (target && typeof target.set === "function") {
      target.set(to);
    } else if (options && typeof options.onUpdate === "function") {
      options.onUpdate(to);
    } else if (to && typeof to.onUpdate === "function") {
      to.onUpdate(target);
    }
  } catch {}
  return {
    stop() {},
    cancel() {},
    pause() {},
    play() {},
    then: (res: any) => {
      if (res) res();
      return Promise.resolve();
    },
    finished: Promise.resolve(),
  };
}
