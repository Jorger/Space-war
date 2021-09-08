"use strict";
(() => {
  // Utilidades
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const BASE_HEIGHT = 732;
  const BASE_WIDTH = 412;
  const COLORS = {
    red: [
      "#ff5174",
      "#ff4a69",
      "#ee9cac",
      [, , 1675, , 0.06, 0.24, 1, 1.82, , , 837, 0.06],
    ],
    yellow: [
      "#ffe901",
      "#fed702",
      "#fff483",
      [, , 539, 0, 0.04, 0.29, 1, 1.92, , , 567, 0.02, 0.02, , , , 0.04],
    ],
    green: [
      "#48d054",
      "#43c04e",
      "#8ff498",
      [, , 1e3, , , 0.5, , , , , 99, 0.01, 0.03],
    ],
    blue: [
      "#009afe",
      "#018fff",
      "#6abcf2",
      [, 0.1, 75, 0.03, 0.08, 0.17, 1, 1.88, 7.83, , , , , 0.4],
    ],
  };

  $("html").style.cssText += `--h: ${BASE_HEIGHT}px; --w: ${BASE_WIDTH}px`;
  const setHtml = (element, html) => (element.innerHTML = html);
  const ObjectKeys = (obj) => Object.keys(obj);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

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
    $on(target, "transitionend", (evt) => callback(evt));

  const addClass = (target, className) => {
    if (target) {
      className.split(" ").forEach((classText) => {
        target.classList.add(classText);
      });
    }
  };

  const removeClass = (target, className) => {
    if (target) {
      className.split(" ").forEach((classText) => {
        target.classList.remove(classText);
      });
    }
  };

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

  const Piano = () =>
    `<piano class="cs" ${inlineStyles({
      "flex-wrap": "wrap",
      width: "80%",
    })}>${ObjectKeys(COLORS)
      .map((v) => `<button disabled id=${v}></button>`)
      .join("")}</piano>`;

  const PauseButton = () => `<button id=pause>⏸️</button>`;

  const Bullets = (id = "", styles = {}) =>
    `<div class=bullet id=${id} ${inlineStyles(styles)}></div>`;

  const Game = () => {
    // const SHOOTING_POINTS =

    let soundPattern = [];
    let intervalPattern;
    let counterPattern = 0;
    let score = 0;

    const setPositionParticle = (styles) => {
      for (let i = 0; i < 4; i++) {
        addStyle($(`#b-${i + 1}`), styles);
      }
    };

    const shootLaser = async (ship = 1) => {
      const laser = $("#laser");
      const particle = $("#particle");
      const positionLaser = [260, 140];
      const positionParticle = ["43%", "13%"];
      const initialPosition = positionLaser[ship === 1 ? 1 : 0];
      const destinityParticle = [
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ];

      addStyle(particle, {
        top: positionParticle[ship - 1],
        visibility: "visible",
      });

      setPositionParticle({
        top: "7px",
        left: "15px",
        visibility: "hidden",
        opacity: 0,
      });

      // 45deg 135deg 225deg, 315deg

      addStyle(laser, {
        left: "49%",
        top: `${initialPosition}px`,
        visibility: "visible",
        opacity: 0,
      });

      await delay(100);

      console.log("PRIMERO");
      addStyle(laser, {
        top: `${positionLaser[ship - 1]}px`,
        opacity: 1,
      });

      await delay(200);

      console.log("SEGUNDO");
      addStyle(laser, {
        visibility: "hidden",
      });

      for (let i = 0; i < 4; i++) {
        const element = $(`#b-${i + 1}`);
        addStyle(element, {
          left: `${
            +element.style.left.split("px")[0] + destinityParticle[i][0] * 100
          }px`,
          top: `${
            +element.style.top.split("px")[0] + destinityParticle[i][1] * 100
          }px`,
          visibility: "visible",
          opacity: 1,
        });
      }

      await delay(400);

      console.log("TERCERO");
      addStyle(particle, {
        visibility: "hidden",
      });

      setPositionParticle({
        top: "7px",
        left: "15px",
        visibility: "hidden",
      });

      // Se genera otro patrón...
      if (ship === 2) {
        console.log("genera un nuevo patrón");
        setSoundPattern();
      } else {
        console.log("HA PERDIDO!!");
      }
    };

    /** Habila/deshabilita los botones */
    const changeButtonsState = (disabled = false) => {
      ObjectKeys(COLORS).forEach((v) => ($(`piano #${v}`).disabled = disabled));
    };

    /**
     * Función que ejecuta y muetra el sonido
     * @param {*} color
     */
    const executeButtonSound = (color = "") => {
      ObjectKeys(COLORS).forEach(async (v) => {
        const element = $(`piano #${v}`);
        if (color === v) {
          addClass(element, "active");
          await delay(100);
          removeClass(element, "active");
        } else {
          removeClass(element, "active");
        }
      });

      if (color !== "") {
        zzfx(...COLORS[color][3]);
      }
    };

    /**
     * Función que genera un nuevo patrón de sonido
     */
    const setSoundPattern = () => {
      let index = 0;
      let counter = 0;
      soundPattern.push(ObjectKeys(COLORS)[randomNumber(0, 3)]);
      console.log(soundPattern);

      if (intervalPattern) {
        clearInterval(intervalPattern);
      }

      intervalPattern = setInterval(() => {
        if (index >= soundPattern.length) {
          counterPattern = 0;
          clearInterval(intervalPattern);
          changeButtonsState(false);
        }

        if (counter % 2 === 0) {
          executeButtonSound(soundPattern[index]);
          index++;
        }

        counter++;
      }, 200);
    };

    /**
     * Función que revisa si el color seleccionado es el válido
     * @param {*} color
     */
    const checkSoundPattern = async (color = "") => {
      // Reproduce el sonido
      zzfx(...COLORS[color][3]);
      changeButtonsState(true);
      await delay(200);
      // Verificar si el sonido/color seleccionado es el válido...
      if (color === soundPattern[counterPattern]) {
        counterPattern++;
        if (counterPattern < soundPattern.length) {
          changeButtonsState(false);
        } else {
          shootLaser(2);
          console.log("SE HARÍA EL DISPARO DE LA NAVE");
          score++;
          setHtml($("#score"), score);
        }
      } else {
        shootLaser(1);
      }
    };

    setHtml(
      $("#root"),
      `<div class="cs wh" ${inlineStyles({ "flex-direction": "column" })}>
      ${PauseButton()}
      ${Bullets("laser")}
      <div id=particle>
      ${new Array(4)
        .fill(null)
        .map((_, i) =>
          Bullets(`b-${i + 1}`, {
            background: "#f5f301",
            height: "25px",
            transform: `rotate(${45 + 90 * i}deg)`,
          })
        )
        .join("")}
      </div>
      <div id=score>0</div>
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
      $on(btn, "click", (e) => checkSoundPattern(e.target.id))
    );

    $on($("#pause"), "click", () => Screen());

    setSoundPattern();
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

  const customClass = `piano button {
    height: calc(var(--w) * 0.22);
    width: calc(var(--w) * 0.3);
    border: none;
    cursor: pointer;
    margin: 5%;
    -webkit-tap-highlight-color: transparent;
    box-shadow: ${new Array(7)
      .fill(null)
      .map(
        (_, i) =>
          `var(--shadow) ${-2 * (i + 1)}px ${-2 * (i + 1)}px ${
            2 * (i + 1)
          }px 0px`
      )
      .join(",")};
  }
  ${ObjectKeys(COLORS)
    .map(
      (v) => `
    piano button#${v} {
      background: ${COLORS[v][0]};
      border-bottom: 10px solid ${COLORS[v][1]};
    }

    piano button#${v}:active, 
    piano button#${v}.active {
      border-bottom: 0;
      background : ${COLORS[v][2]};
      transform: translateY(4px);
    }
  `
    )
    .join("")}`;

  const style = document.createElement("style");
  setHtml(style, customClass);
  $("head").appendChild(style);

  Screen("Game");

  $on(document, "contextmenu", (event) => event.preventDefault());
  $on(window, "resize", onWindowResize);
  onWindowResize();
})();
