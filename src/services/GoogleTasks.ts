// @ts-ignore
let google = window.gapi;

class GoogleTasksService {
  private clientId: string = "721709625729-0jp536rce8pn3i5ie0pg213d2t55mu55.apps.googleusercontent.com"
  private scopes: string = 'https://www.googleapis.com/auth/tasks'
  private isLoaded: boolean = false;
  private auth: any;

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

  authorize() {
    return new Promise(async (resolve) => {
      await this.load();

      this.auth = await google.auth2.init({
        client_id: this.clientId,
        //ux_mode: 'redirect',
        //redirect_uri: window.location.href,
        scope: this.scopes,
        //cookie_policy: 'single_host_origin'
      });

      resolve();
    });
  }

  isSignedIn () {
    if (!this.auth) return false;
    return this.auth.isSignedIn.get();
  }

  subscribeSigninStatus (subscriber: (status: boolean) => void) {
    if (!this.auth) return false;
    return this.auth.isSignedIn.listen(subscriber);
  }

  signIn() {
    this.auth.signIn();
  }
}

export default new GoogleTasksService();