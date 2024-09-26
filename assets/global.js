class Auth {
  AUTH_TOKEN_KEY = "auth";
  BASE_ENDPOINT = "https://reqres.in";

  async attemptLogin(
    { email, password },
    { onSuccess = null, onFailed = null }
  ) {
    try {
      const url = this.BASE_ENDPOINT + "/api/login";
      const response = await fetch(url, {
        method: "POST",
        body: new URLSearchParams({
          email,
          password,
        }),
      });
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      this.handleSuccessLogin(result.token);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (e) {
      if (onFailed) {
        onFailed(e.message);
      }
    }
  }

  logout() {
    window.localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  handleSuccessLogin(token) {
    window.localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  isLoggedin() {
    return Boolean(this.getToken());
  }

  getToken() {
    return window.localStorage.getItem(this.AUTH_TOKEN_KEY) ?? null;
  }
}

const auth = new Auth();
