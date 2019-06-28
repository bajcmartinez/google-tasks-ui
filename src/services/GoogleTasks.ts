// @ts-ignore
let google = window.gapi;

export type TaskList = {
  id: String,
  title: String,
  updated: Date
}

class GoogleTasksService {
  private clientId: string = "721709625729-0jp536rce8pn3i5ie0pg213d2t55mu55.apps.googleusercontent.com";
  private scopes: string = 'https://www.googleapis.com/auth/tasks';
  private isLoaded: boolean = false;
  private auth: any;

  /**
   * Loads the client library and gets all the api required information from google servers
   *
   */
  load() {
    if (this.isLoaded) return Promise.resolve()

    const self = this;

    return new Promise(resolve => {

      // To load first we need to inject the scripts
      const script = document.createElement("script");
      script.src = "gapi.js";
      // @ts-ignore
      script.onload = () => {
        // @ts-ignore
        google = window.gapi;

        // Then we load the API
        google.load('client', () => {
          google.client.load('tasks', 'v1', () => {
            // @ts-ignore
            google = window.gapi;

            self.isLoaded = true;
            resolve();
          });
        });
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Gets the client authorization to query google's API
   *
   */
  authorize() {
    return new Promise(async (resolve) => {
      await this.load();

      this.auth = await google.auth2.init({
        client_id: this.clientId,
        scope: this.scopes
      });

      resolve();
    });
  }

  /**
   * Returns whether the current session is signed in or not
   *
   */
  isSignedIn () {
    if (!this.auth) return false;
    return this.auth.isSignedIn.get();
  }

  /**
   * Event listener for sign in status
   *
   * @param subscriber
   */
  subscribeSigninStatus (subscriber: (status: boolean) => void) {
    if (!this.auth) return false;
    return this.auth.isSignedIn.listen(subscriber);
  }

  /**
   * Starts the sign in process against your Google Account
   *
   */
  signIn() {
    this.auth.signIn();
  }

  /**
   * Lists all tasks lists
   *
   * @returns [TaskList]
   */
  async listTaskLists() {
    const response = await google.client.tasks.tasklists.list();

    return response.result.items.map((item: any): TaskList => ({
      id: item["id"],
      title: item["title"],
      updated: item["update"]
    }) as TaskList);
  }
}

export default new GoogleTasksService();