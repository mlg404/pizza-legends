import { Overworld } from "./overworld";

const init = () => {
  const overworld = new Overworld({
    element: document.querySelector(".game-container") as HTMLElement,
  });

  overworld.init();
};

init();
