import { Pizzas } from "content/pizzas";
import { Person } from "person";
import { Progress } from "progress";
import { playerState } from "state/playerState";
import { wait } from "utils";

export interface MenuPage {
  label: string;
  description: string;
  handler: () => void;
}

interface PauseMenuProps {
  progress: Progress;
  onComplete: () => void;
  hero: Person;
}
export class PauseMenu {
  public progress;
  public onComplete;
  public hero;
  public keyboardMenu: KeyboardMenu | null;
  public element: HTMLDivElement | null;
  public esc: KeyPressListener | null;
  constructor({ progress, onComplete, hero }: PauseMenuProps) {
    this.progress = progress;
    this.onComplete = onComplete;
    this.hero = hero;
    this.keyboardMenu = null;
    this.element = null;
    this.esc = null;
  }

  getOptions(pageKey: string): MenuPage[] {
    if (pageKey === "root") {
      const lineupPizzas = playerState.lineup.map((id) => {
        const { pizzaId } = playerState.pizzas[id];
        const base = Pizzas[pizzaId];
        return {
          label: base.name,
          description: base.description,
          handler: () => this.keyboardMenu!.setOptions(this.getOptions(id)),
        };
      });
      return [
        ...lineupPizzas,
        {
          label: "Save",
          description: "Save your progress",
          handler: () => {
            this.progress.save(this.hero);
            this.close();
          },
        },
        {
          label: "Load",
          description: "Load your progress",
          handler: () => {
            this.progress.load();
            this.close();
          },
        },
        {
          label: "Close",
          description: "Close the game",
          handler: () => this.close(),
        },
      ];
    }

    const unequipped = Object.keys(playerState.pizzas)
      .filter((id) => playerState.lineup.indexOf(id) === -1)
      .map((id) => {
        const { pizzaId } = playerState.pizzas[id];
        const base = Pizzas[pizzaId];
        return {
          label: `Swap for ${base.name}`,
          description: base.description,
          handler: () => {
            playerState.swapLineup(pageKey, id);
            this.keyboardMenu!.setOptions(this.getOptions("root"));
          },
        };
      });
    return [
      ...unequipped,
      {
        label: "move to front",
        description: "Move this pizza to the front of the lineup",
        handler: () => {
          playerState.moveToFront(pageKey);
          this.keyboardMenu!.setOptions(this.getOptions("root"));
        },
      },
      {
        label: "Back",
        description: "Go back to root menu",
        handler: () => this.keyboardMenu!.setOptions(this.getOptions("root")),
      },
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("overlayMenu");
    this.element.innerHTML = `
      <h2>Paused</h2>
    `;
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu!.end();
    this.element!.remove();
    this.onComplete();
  }

  async init(container: HTMLDivElement) {
    this.createElement();

    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });

    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element!);

    wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    });
  }
}
