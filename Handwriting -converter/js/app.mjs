import {
  addFontFromFile,
  formatText,
  addPaperFromFile,
} from "./utils/helpers.mjs";
import {
  generateImages,
  downloadAsPDF,
  deleteAll,
} from "./generate-images.mjs";
import { setInkColor, toggleDrawCanvas } from "./utils/draw.mjs";

/**
 *
 * Hi there! This is the entry file of the tool and deals with adding event listeners
 * and some other functions.
 *
 * To contribute, you can follow the imports above and make changes in the file
 * related to the issue you've choosen.
 *
 * If you have any questions related to code, you can drop them in my Twitter DM @saurabhcodes
 * or in my email at saurabhdaware99@gmail.com
 *
 * Thanks! and Happy coding 🌻
 *
 */

const pageEl = document.querySelector(".page-a");

const papercontent = document.querySelector(".paper-content");

const setTextareaStyle = (attrib, v) => (pageEl.style[attrib] = v);

const setContentStyle = (attrib, v) => (papercontent.style[attrib] = v);

function countLines(classname) {
  var el = document.getElementsByClassName(classname)[0];
  var divHeight = el.offsetHeight;
  console.log(el);
  var lineHeight = parseInt(el.style["lineHeight"]);
  alert(lineHeight);
  var lines = divHeight / lineHeight;
  window.alert("Lines: " + lines);
}

/**
 * Add event listeners here, they will be automatically mapped with addEventListener later
 */
const EVENT_MAP = {
  "#generate-image-form": {
    on: "submit",
    action: (e) => {
      e.preventDefault();
      generateImages();
    },
  },
  "#handwriting-font": {
    on: "change",
    action: (e) =>
      document.body.style.setProperty("--handwriting-font", e.target.value),
  },
  "#font-size": {
    on: "change",
    action: (e) => {
      if (e.target.value > 30) {
        alert("Font-size is too big try upto 30");
      } else {
        setTextareaStyle("fontSize", e.target.value + "pt");
        e.preventDefault();
      }
    },
  },
  "#letter-spacing": {
    on: "change",
    action: (e) => {
      if (e.target.value > 40) {
        alert("Letter Spacing is too big try a number upto 40");
      } else {
        setTextareaStyle("letterSpacing", e.target.value + "px");
        e.preventDefault();
      }
    },
  },
  "#word-spacing": {
    on: "change",
    action: (e) => {
      if (e.target.value > 100) {
        alert("Word Spacing is too big try a number upto hundred");
      } else {
        setTextareaStyle("wordSpacing", e.target.value + "px");

        e.preventDefault();
      }
    },
  },
  "#letter-rotation": {
    on: "change",
    action: (e) => {
      if (e.target.value > 40) {
        alert("Letter Rotation is too much try a smaller number");
      } else {
        setTextareaStyle("wordSpacing", e.target.value + "px");

        e.preventDefault();
      }
    },
  },
  "#top-padding": {
    on: "change",
    action: (e) => {
      document.querySelector(".page-a .paper-content").style.paddingTop =
        e.target.value + "px";
    },
  },
  "#font-file": {
    on: "change",
    action: (e) => addFontFromFile(e.target.files[0]),
  },
  "#ink-color": {
    on: "change",
    action: (e) => {
      document.body.style.setProperty("--ink-color", e.target.value);
      setInkColor(e.target.value);
    },
  },
  "#rot-er": {
    on: "change",
    action: (e) => {
      document.querySelector(".paper-content").style["transform"] =
        "rotate(" + e.target.value + "deg) ";
    },
  },
  "#note": {
    on: "click",
    action: (e) => {},
  },
  "#draw-diagram-button": {
    on: "click",
    action: () => {
      toggleDrawCanvas();
    },
  },
  ".draw-container .close-button": {
    on: "click",
    action: () => {
      toggleDrawCanvas();
    },
  },
  "#download-as-pdf-button": {
    on: "click",
    action: () => {
      downloadAsPDF();
    },
  },
  "#delete-all-button": {
    on: "click",
    action: () => {
      deleteAll();
    },
  },
  ".page-a .paper-content": {
    on: "paste",
    action: formatText,
  },
  "#paper-file": {
    on: "change",
    action: (e) => addPaperFromFile(e.target.files[0]),
  },
};

for (const eventSelector in EVENT_MAP) {
  console.log(eventSelector);
  document
    .querySelector(eventSelector)
    .addEventListener(
      EVENT_MAP[eventSelector].on,
      EVENT_MAP[eventSelector].action
    );
}

/**
 * This makes toggles, accessible.
 */
document.querySelectorAll(".switch-toggle input").forEach((toggleInput) => {
  toggleInput.addEventListener("change", (e) => {
    if (toggleInput.checked) {
      document.querySelector(
        `label[for="${toggleInput.id}"] .status`
      ).textContent = "on";
      toggleInput.setAttribute("aria-checked", true);
    } else {
      toggleInput.setAttribute("aria-checked", false);
      document.querySelector(
        `label[for="${toggleInput.id}"] .status`
      ).textContent = "off";
    }
  });
});

/**
 * Set GitHub Contributors
 */

fetch(
  "https://api.github.com/repos/saurabhdaware/text-to-handwriting/contributors"
)
  .then((res) => res.json())
  .then((res) => {
    document.querySelector("#project-contributors").innerHTML = res
      .map(
        (contributor) => /* html */ `
        <div class="contributor-profile shadow">
          <a href="${contributor.html_url}">
            <img 
              alt="GitHub avatar of contributor ${contributor.login}" 
              class="contributor-avatar" 
              loading="lazy" 
              src="${contributor.avatar_url}" 
            />
            <div class="contributor-username">${contributor.login}</div>
          </a>
        </div>
      `
      )
      .join("");
  });
