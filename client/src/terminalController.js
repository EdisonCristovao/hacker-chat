import ComponentsBuilder from "./components.js";

export default class TerminalController {
  #usersCollors = new Map();
  constructor() {}

  #pickCollor() {
    return `#` + (((1 << 24) * Math.random()) | 0).toString(16) + `-fg`;
  }

  #getUserCollor(userName) {
    if (this.#usersCollors.has(userName))
      return this.#usersCollors.get(userName);

    const collor = this.#pickCollor();
    this.#usersCollors.set(userName, collor);

    return collor;
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue();
      this.clearValue();
    };
  }

  #onMessageReceived({ screen, chat }) {
    return (msg) => {
      const { userName, message } = msg;
      const collor = this.#getUserCollor(userName);
      chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`);
      screen.render();
    };
  }

  #onLogChanged({ screen, activityLog }) {
    return (msg) => {
      const [userName] = msg.split(/\s/);
      const collor = this.#getUserCollor(userName);
      activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`);
      screen.render();
    };
  }

  #registerEvents(eventEmitter, components) {
    // eventEmitter.emit("turma01", "hey");

    eventEmitter.on("message:received", this.#onMessageReceived(components));
    eventEmitter.on("activityLog:update", this.#onLogChanged(components));
    // eventEmitter.on("status:update", this.#onStatusChanged(components));
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: "HackerChat - Edison Junior" })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponents()
      .setActivityLogComponent()
      .setStatusComponent()
      .build();

    this.#registerEvents(eventEmitter, components);
    components.input.focus();
    components.screen.render();

    eventEmitter.emit("activityLog:update", "Lari left");
    eventEmitter.emit("activityLog:update", "Edison left");
    eventEmitter.emit("activityLog:update", "Eric left");
    setInterval(() => {
      eventEmitter.emit("message:received", {
        userName: "Lari",
        message: "Opa",
      });
      eventEmitter.emit("message:received", {
        userName: "Edison",
        message: "iaiii porww",
      });
      eventEmitter.emit("message:received", {
        userName: "Eric",
        message: "Fala feioo",
      });
    }, 2000);
  }
}
