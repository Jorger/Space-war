"use strict";
(() => {
  // Utilidades
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const BASE_HEIGHT = 732;
  const BASE_WIDTH = 412;
  $("html").style.cssText += `--h: ${BASE_HEIGHT}px; --w: ${BASE_WIDTH}px`;
  const setHtml = (element, html) => (element.innerHTML = html);
  const ObjectKeys = (obj) => Object.keys(obj);

  /**
   * Para edicioar eventos
   * @param {*} target
   * @param {*} type
   * @param {*} callback
   * @param {*} parameter
   */
  const $on = (target, type, callback, parameter = {}) => {
    if (target) {
      target.addEventListener(type, callback, parameter);
    }
  };

  /**
   * Función que detcta cuando un evento de tipo transitionend termina
   * @param {*} target
   * @param {*} callback
   * @returns
   */
  const onRest = (target, callback) =>
    $on(target, "transitionend", (evt) => callback(evt.propertyName));

  const addClass = (target, className) => {
    if (target) {
      className.split(" ").forEach((classText) => {
        target.classList.add(classText);
      });
    }
  };

  // const removeClass = (target, className) => {
  //   if (target) {
  //     className.split(' ').forEach((classText) => {
  //       target.classList.remove(classText);
  //     });
  //   }
  // };

  /**
   * Eliminar un evento
   * @param {*} target
   * @param {*} type
   * @param {*} callback
   * @param {*} parameter
   */
  // const $off = (target, type, callback, parameter = {}) => {
  //   if (target) {
  //     target.removeEventListener(type, callback, parameter);
  //   }
  // };

  /**
   * Determina si el dispotivo es mobile
   */
  const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const inlineStyles = (styles) =>
    ObjectKeys(styles).length
      ? `style='${ObjectKeys(styles)
          .map((v) => `${v}:${styles[v]}`)
          .join(";")}'`
      : "";

  /**
   * Agregar estilos inline a un elemento
   * @param {*} target
   * @param {*} styles
   */
  const addStyle = (target, styles) => {
    if (target) {
      for (let style in styles) {
        target.style[style] = styles[style];
      }
    }
  };

  /**
   * Para establecer un tiempo para hacer una acción en una función
   * útil para el evento de resize
   * @param {*} fn
   * @param {*} delay
   */
  const debounce = (fn, delay) => {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, delay);
    };
  };

  /**
   * Retonará las dimnesiones de la pantalla
   */
  const getDimensionsScreen = () => ({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  const onWindowResize = debounce(() => {
    const { w, h } = getDimensionsScreen();
    const scale = Math.min(w / BASE_WIDTH, h / BASE_HEIGHT);
    const mobile = isMobile();
    addStyle($("body"), {
      zoom: `${w < BASE_WIDTH ? Math.round((w / BASE_WIDTH) * 100) : 100}%`,
      transform:
        scale >= 1 || mobile ? `scale(${!mobile ? scale : 1})` : undefined,
    });
  }, 100);
  // fin de utilidades

  const Ship = (number = 1, styles = {}) =>
    `<div class=s${number} ${inlineStyles(styles)}></div>`;

  const PianoKey = (color = "") =>
    `<button id=p-${color} class="pkey ${color}"></button>`;

  const Piano = () =>
    `<piano class="cs" ${inlineStyles({
      "flex-wrap": "wrap",
      width: "80%",
    })}>${["red", "yellow", "green", "blue"]
      .map((v) => PianoKey(v))
      .join("")}</piano>`;

  const PauseButton = () => `<button id=pause>⏸️</button>`;

  const Game = () => {
    setHtml(
      $("#root"),
      `<div class="cs wh" ${inlineStyles({ "flex-direction": "column" })}>
      ${PauseButton()}
      ${new Array(2)
        .fill(null)
        .map((_, i) =>
          Ship(i + 1, {
            width: "60px",
            height: "60px",
            filter: "drop-shadow(-14px -13px 3px var(--shadow))",
            "margin-bottom": i ? "30px" : "150px",
          })
        )
        .join("")}
        ${Piano()}
      </div>`
    );

    $$("piano button").forEach((btn) =>
      $on(btn, "click", (e) => {
        const color = e.target.id.split("-")[1];
        console.log({ color });
      })
    );

    $on($("#pause"), "click", () => Screen());
  };

  const Lobby = () => {
    setHtml(
      $("#root"),
      `<div class="cs wh">
        Pantalla del Lobby
        <button>GAME</button>
      </div>`
    );

    $on($("button"), "click", () => Screen("Game"));
  };

  const Screen = (screen = "Lobby") => {
    const Handler = {
      Lobby,
      Game,
    };

    Handler[screen]();
  };

  Screen("Game");

  $on(document, "contextmenu", (event) => event.preventDefault());
  $on(window, "resize", onWindowResize);
  onWindowResize();
})();
