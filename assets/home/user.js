class User {
  BASE_ENDPOINT = "https://reqres.in";

  async getUsers(
    { page = 0 } = {},
    { onSuccess = null, onFailed = null } = {}
  ) {
    try {
      const url = new URL(this.BASE_ENDPOINT + "/api/users");

      if (page) {
        url.searchParams.set("page", page);
      }

      const response = await fetch(url.toString());
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (e) {
      console.error(e.message);

      if (onFailed) {
        onFailed(e.message);
      }
    }
  }

  async createUser({ name, job }, { onSuccess = null, onFailed = null } = {}) {
    try {
      const url = new URL(this.BASE_ENDPOINT + "/api/users");
      const response = await fetch(url.toString(), {
        method: "POST",
        body: new URLSearchParams({ name, job }),
      });
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (e) {
      console.error(e.message);

      if (onFailed) {
        onFailed(e.message);
      }
    }
  }

  async updateUser(
    { id, name, job },
    { onSuccess = null, onFailed = null } = {}
  ) {
    try {
      const url = new URL(this.BASE_ENDPOINT + "/api/users/" + id);
      const response = await fetch(url.toString(), {
        method: "PUT",
        body: new URLSearchParams({ name, job }),
      });
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (e) {
      console.error(e.message);

      if (onFailed) {
        onFailed(e.message);
      }
    }
  }

  async deleteUser({ id }, { onSuccess = null, onFailed = null } = {}) {
    try {
      const url = new URL(this.BASE_ENDPOINT + "/api/users/" + id);
      const response = await fetch(url.toString(), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      if (onSuccess) {
        onSuccess();
      }

      return response.ok;
    } catch (e) {
      console.error(e.message);

      if (onFailed) {
        onFailed(e.message);
      }
    }
  }
}

const user = new User();
