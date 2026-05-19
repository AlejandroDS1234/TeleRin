(function () {
  const STORAGE_KEY = "telerin-live-theme-seed";
  const root = document.documentElement;
  const defaultValues = new Map();
  let panelMounted = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function wrapHue(hue) {
    return ((hue % 360) + 360) % 360;
  }

  function hexToRgb(hex) {
    const normalized = hex.replace("#", "").trim();
    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
      return null;
    }

    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    };
  }

  function rgbToHex(r, g, b) {
    const toHex = (channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function rgbToHsl(r, g, b) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));

      switch (max) {
        case red:
          h = 60 * (((green - blue) / delta) % 6);
          break;
        case green:
          h = 60 * ((blue - red) / delta + 2);
          break;
        default:
          h = 60 * ((red - green) / delta + 4);
          break;
      }
    }

    return {
      h: wrapHue(h),
      s: clamp(s * 100, 0, 100),
      l: clamp(l * 100, 0, 100),
    };
  }

  function hslToRgb(h, s, l) {
    const hue = wrapHue(h);
    const sat = clamp(s, 0, 100) / 100;
    const light = clamp(l, 0, 100) / 100;
    const chroma = (1 - Math.abs(2 * light - 1)) * sat;
    const segment = hue / 60;
    const x = chroma * (1 - Math.abs((segment % 2) - 1));
    const match = light - chroma / 2;

    let red = 0;
    let green = 0;
    let blue = 0;

    if (segment >= 0 && segment < 1) {
      red = chroma;
      green = x;
    } else if (segment < 2) {
      red = x;
      green = chroma;
    } else if (segment < 3) {
      green = chroma;
      blue = x;
    } else if (segment < 4) {
      green = x;
      blue = chroma;
    } else if (segment < 5) {
      red = x;
      blue = chroma;
    } else {
      red = chroma;
      blue = x;
    }

    return {
      r: (red + match) * 255,
      g: (green + match) * 255,
      b: (blue + match) * 255,
    };
  }

  function hslToCss(h, s, l, alpha) {
    const hue = Math.round(wrapHue(h));
    const sat = Math.round(clamp(s, 0, 100));
    const light = Math.round(clamp(l, 0, 100));

    if (typeof alpha === "number") {
      return `hsla(${hue} ${sat}% ${light}% / ${clamp(alpha, 0, 1).toFixed(2)})`;
    }

    return `hsl(${hue} ${sat}% ${light}%)`;
  }

  function getContrastText(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
      return "#ffffff";
    }

    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.62 ? "#000000" : "#ffffff";
  }

  function tintHex(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  function buildThemeFromSeed(seedHex) {
    const rgb = hexToRgb(seedHex);
    if (!rgb) {
      return null;
    }

    const base = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const supportHue = wrapHue(base.h + 28);
    const pageHue = wrapHue((base.h * 0.7) + (supportHue * 0.3));
    const surfaceHue = wrapHue((base.h * 0.82) + (supportHue * 0.18));
    const accentHue = wrapHue(base.h - 2);

    const neutral50 = hslToCss(pageHue, clamp(base.s * 0.5, 24, 52), 92);
    const neutral75 = hslToCss(pageHue, clamp(base.s * 0.56, 28, 58), 87);
    const neutral100 = hslToCss(surfaceHue, clamp(base.s * 0.48, 22, 50), 82);
    const neutral150 = hslToCss(surfaceHue, clamp(base.s * 0.52, 26, 56), 76);
    const neutral200 = hslToCss(surfaceHue, clamp(base.s * 0.64, 32, 66), 70);
    const neutral300 = hslToCss(surfaceHue, clamp(base.s * 0.42, 20, 44), 62, 0.78);

    const accent500 = hslToCss(base.h, Math.max(base.s, 60), clamp(base.l, 44, 58));
    const accent600 = hslToCss(accentHue, Math.max(base.s - 4, 56), clamp(base.l - 8, 36, 48));
    const accentText = getContrastText(tintHex(base.h, Math.max(base.s, 60), clamp(base.l, 44, 58)));

    const glass = hslToCss(pageHue, clamp(base.s * 0.42, 18, 40), 96, 0.58);
    const borderDefault = hslToCss(base.h + 6, clamp(base.s * 0.32, 16, 38), 30);
    const borderMuted = hslToCss(base.h + 6, clamp(base.s * 0.24, 12, 30), 48, 0.45);
    const overlay = hslToCss(base.h, clamp(base.s * 0.24, 12, 28), 10, 0.72);
    const overlaySoft = hslToCss(base.h, clamp(base.s * 0.18, 10, 22), 8, 0.44);
    const cardTint1 = hslToCss(pageHue - 12, clamp(base.s * 0.42, 18, 40), 68, 0.75);
    const cardTint2 = hslToCss(supportHue + 84, clamp(base.s * 0.34, 18, 38), 54, 0.75);
    const cardTint3 = hslToCss(supportHue + 140, clamp(base.s * 0.28, 16, 34), 74, 0.75);
    const cardTint4 = hslToCss(supportHue + 110, clamp(base.s * 0.26, 14, 30), 80, 0.75);
    const selected = hslToCss(base.h, Math.max(base.s, 62), clamp(base.l - 10, 32, 46));
    const textPrimary = tintHex(base.h + 8, clamp(base.s * 0.18, 6, 18), 12);
    const textInverse = "#ffffff";

    return {
      "--neutral-50": neutral50,
      "--neutral-75": neutral75,
      "--neutral-100": neutral100,
      "--neutral-150": neutral150,
      "--neutral-200": neutral200,
      "--neutral-300": neutral300,
      "--accent-500": accent500,
      "--accent-600": accent600,
      "--border-alpha-45": borderMuted,
      "--overlay-500": overlay,
      "--overlay-700": overlaySoft,
      "--white-alpha-30": glass,
      "--card-tint-1": cardTint1,
      "--card-tint-2": cardTint2,
      "--card-tint-3": cardTint3,
      "--card-tint-4": cardTint4,
      "--bg-page": neutral50,
      "--bg-surface": neutral100,
      "--bg-surface-soft": neutral75,
      "--bg-surface-hover": neutral150,
      "--bg-surface-strong": neutral200,
      "--bg-surface-muted": neutral300,
      "--bg-overlay": overlay,
      "--bg-overlay-soft": overlaySoft,
      "--bg-glass": glass,
      "--text-primary": textPrimary,
      "--text-inverse": textInverse,
      "--border-default": borderDefault,
      "--border-muted": borderMuted,
      "--action-primary": accent500,
      "--action-primary-hover": accent600,
      "--action-primary-text": accentText,
      "--success-500": "#01af02",
      "--warning-500": "#ff8000",
      "--danger-500": "#ff0000",
      "--info-300": "#4dffff",
      "--status-success": "#01af02",
      "--status-warning": "#ff8000",
      "--status-danger": "#ff0000",
      "--status-info": "#4dffff",
      "--interactive-selected": selected,
      "--color_texto_claro": textInverse,
      "--color_texto_oscuro": textPrimary,
      "--color_texto": textPrimary,
      "--color_principal": neutral50,
      "--color_principal_claro": glass,
      "--color_principal_oscuro": neutral200,
      "--color_principal_opaco": neutral100,
      "--color_bordes": borderDefault,
      "--color_bordes_claro": borderMuted,
      "--color_bordes_presionado": accent500,
      "--color_botones": accent500,
      "--color_botones_presionado": accent600,
      "--color_texto_botones": accentText,
      "--fondo_modal": overlay,
      "--color_fondo_transparente": glass,
      "--color_seleccionado": selected,
      "--warning": "#ff0000",
      "--success": "#01af02",
      "--danger": "#ff8000",
    };
  }

  function rememberDefault(variableName) {
    if (defaultValues.has(variableName)) {
      return;
    }

    defaultValues.set(variableName, root.style.getPropertyValue(variableName));
  }

  function applyTheme(seedHex) {
    const theme = buildThemeFromSeed(seedHex);
    if (!theme) {
      return false;
    }

    Object.entries(theme).forEach(([variableName, value]) => {
      rememberDefault(variableName);
      root.style.setProperty(variableName, value);
    });

    localStorage.setItem(STORAGE_KEY, seedHex);
    updatePreview(seedHex);
    return true;
  }

  function clearTheme() {
    Array.from(defaultValues.keys()).forEach((variableName) => {
      root.style.removeProperty(variableName);
    });

    localStorage.removeItem(STORAGE_KEY);
    updatePreview(null);
  }

  function updatePreview(seedHex) {
    const input = document.getElementById("telerin-live-theme-input");
    const badge = document.getElementById("telerin-live-theme-badge");
    const swatch = document.getElementById("telerin-live-theme-swatch");

    if (!input || !badge || !swatch) {
      return;
    }

    const current = seedHex || localStorage.getItem(STORAGE_KEY) || "#f97316";
    input.value = current;
    badge.textContent = seedHex ? `Activa: ${current}` : "Tema original activo";
    swatch.style.background = current;
    swatch.style.opacity = seedHex ? "1" : "0.45";
  }

  function mountPanel() {
    if (panelMounted || !document.body) {
      return;
    }

    panelMounted = true;

    const wrapper = document.createElement("aside");
    wrapper.id = "telerin-live-theme-panel";
    wrapper.setAttribute("aria-label", "Tema en tiempo real");
    wrapper.style.position = "fixed";
    wrapper.style.right = "16px";
    wrapper.style.bottom = "16px";
    wrapper.style.zIndex = "9999";
    wrapper.style.width = "min(320px, calc(100vw - 24px))";
    wrapper.style.padding = "14px";
    wrapper.style.border = "1px solid rgba(0, 0, 0, 0.18)";
    wrapper.style.borderRadius = "16px";
    wrapper.style.background = "rgba(255, 255, 255, 0.94)";
    wrapper.style.backdropFilter = "blur(12px)";
    wrapper.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.16)";
    wrapper.style.fontFamily = "system-ui, sans-serif";
    wrapper.style.color = "#111111";

    wrapper.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;">
        <div>
          <div style="font-size:14px;font-weight:700;">Tema en vivo</div>
          <div style="font-size:12px;opacity:0.72;">Calcula una paleta completa desde un solo color.</div>
        </div>
        <div id="telerin-live-theme-swatch" style="width:26px;height:26px;border-radius:999px;border:1px solid rgba(0,0,0,.15);flex:none;"></div>
      </div>
      <label for="telerin-live-theme-input" style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;">Color semilla</label>
      <div style="display:flex;gap:8px;align-items:center;">
        <input id="telerin-live-theme-input" type="color" value="#f97316" style="width:52px;height:38px;border:none;background:none;padding:0;cursor:pointer;" />
        <button id="telerin-live-theme-apply" type="button" style="flex:1;height:38px;border:none;border-radius:10px;background:#111111;color:#ffffff;font-weight:700;cursor:pointer;">Aplicar</button>
      </div>
      <div id="telerin-live-theme-badge" style="font-size:12px;margin-top:10px;opacity:0.82;"></div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button id="telerin-live-theme-reset" type="button" style="flex:1;height:36px;border:1px solid rgba(0,0,0,.16);border-radius:10px;background:#ffffff;color:#111111;font-weight:600;cursor:pointer;">Volver al original</button>
        <button id="telerin-live-theme-hide" type="button" style="height:36px;padding:0 12px;border:1px solid rgba(0,0,0,.16);border-radius:10px;background:#ffffff;color:#111111;font-weight:600;cursor:pointer;">Ocultar</button>
      </div>
    `;

    document.body.appendChild(wrapper);

    const input = document.getElementById("telerin-live-theme-input");
    const applyButton = document.getElementById("telerin-live-theme-apply");
    const resetButton = document.getElementById("telerin-live-theme-reset");
    const hideButton = document.getElementById("telerin-live-theme-hide");

    const applyFromInput = function () {
      if (input && applyTheme(input.value)) {
        updatePreview(input.value);
      }
    };

    if (input) {
      input.addEventListener("input", applyFromInput);
      input.addEventListener("change", applyFromInput);
    }

    if (applyButton) {
      applyButton.addEventListener("click", applyFromInput);
    }

    if (resetButton) {
      resetButton.addEventListener("click", clearTheme);
    }

    if (hideButton) {
      hideButton.addEventListener("click", function () {
        wrapper.style.display = "none";

        const reopen = document.createElement("button");
        reopen.id = "telerin-live-theme-reopen";
        reopen.type = "button";
        reopen.textContent = "Tema";
        reopen.style.position = "fixed";
        reopen.style.right = "16px";
        reopen.style.bottom = "16px";
        reopen.style.zIndex = "9999";
        reopen.style.height = "40px";
        reopen.style.padding = "0 14px";
        reopen.style.border = "1px solid rgba(0,0,0,.16)";
        reopen.style.borderRadius = "999px";
        reopen.style.background = "rgba(255,255,255,.94)";
        reopen.style.backdropFilter = "blur(12px)";
        reopen.style.fontWeight = "700";
        reopen.style.cursor = "pointer";
        reopen.style.boxShadow = "0 12px 24px rgba(0,0,0,.12)";

        reopen.addEventListener("click", function () {
          wrapper.style.display = "";
          reopen.remove();
        });

        document.body.appendChild(reopen);
      });
    }

    const persistedSeed = localStorage.getItem(STORAGE_KEY);
    if (persistedSeed) {
      applyTheme(persistedSeed);
    } else {
      updatePreview(null);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountPanel);
  } else {
    mountPanel();
  }
})();
