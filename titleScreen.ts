import { Progress } from "progress";

interface TitleScreenProps {
  progress: Progress;
}
export class TitleScreen {
  public progress: Progress;
  public element: HTMLDivElement;
  public keyboardMenu: KeyboardMenu;

  constructor({ progress }: TitleScreenProps) {
    this.progress = progress;
    this.element = {} as HTMLDivElement;
    this.keyboardMenu = new KeyboardMenu();
  }

  getOptions(resolve: any) {
    const saveFile = this.progress.getSaveFile();
    return [
      {
        label: "New Game",
        description: "Start a new game",
        handler: () => {
          this.close();
          resolve();
        },
      },
      saveFile
        ? {
            label: "Load game",
            description: "Load a saved game",
            handler: () => {
              this.close();
              resolve(saveFile);
            },
          }
        : null,
    ].filter((v) => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = `
      <img class="TitleScreen_logo" src="./images/logo.png" alt="Pizza Legends" />
    `;
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }

  init(container: HTMLDivElement) {
    return new Promise((resolve) => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    });
  }
}
