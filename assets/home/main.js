if (!auth.isLoggedin()) {
  window.location.href = "/dct/login.html";
}

const openDialog = (selector) => $(selector).get(0).showModal();
const closeDialog = (selector) => $(selector).get(0).close();

const handleUpdateUser = (el) => {
  const user = JSON.parse(el.dataset.user);
  const dialogId = "#update-user-dialog__home";
  const dialog = $(dialogId);
  const form = dialog.find("form").get(0);

  form[0].value = user.id;
  form[1].value = user.first_name + " " + user.last_name;
  form[2].value = user.job ?? "";

  openDialog(dialogId);
};

const handleDeleteUser = (el) => {
  const user = JSON.parse(el.dataset.user);
  const dialogId = "#delete-user-dialog__home";
  const dialog = $(dialogId);
  const form = dialog.find("form").get(0);

  form[0].value = user.id;

  openDialog(dialogId);
};

$(function () {
  let usersPage = 1;
  const renderListUsers = async () => {
    const renderItem = (user) => `<li>
      <div class="user-avatar" data-id="${user.id}">
        <img src="${user.avatar ?? "https://placehold.co/100"}" alt="avatar" />
      </div>
      <div class="user-detail">
        <div>${user.first_name + user.last_name}</div>
        <div>${user.email}</div>
        <div>${dayjs(user.createdAt).format("ddd, D MMM YYYY - HH:mm")}</div>
      </div>
      <div class="user-action-dropdown">
        <button class="btn btn-icon">
          <span class="material-icons">more_vert</span>
        </button>
        <div class="dropdown">
          <button
            class="dropdown-item"
            data-user='${JSON.stringify(user)}'
            onclick="handleUpdateUser(this)"
          >
            <span class="material-icons">edit</span>
            Update
          </button>
          <button
            class="dropdown-item"
            style="color: tomato"
            data-user='${JSON.stringify(user)}'
            onclick="handleDeleteUser(this)"
          >
            <span class="material-icons">delete</span>
            Delete
          </button>
        </div>
      </div>
    </li>`;

    const container = $("#list-users ul");
    const data = await user.getUsers({ page: usersPage });
    const { data: users } = data;
    const items = users
      .map((user) => {
        const selector = `li[data-id="${user.id}"]`;
        if (container.find(selector).length) return "";

        return renderItem(user);
      })
      .join("");

    container.append(items);

    return data;
  };

  $("#list-users .load-more").on("click", function () {
    usersPage++;
    const users = renderListUsers();

    if (users.page === users.total_pages) this.remove();
  });

  const logoutButton = $("#logout");
  logoutButton.click(function () {
    auth.logout();
    window.location.href = "/dct/login.html";
  });

  renderListUsers();

  $("#create-user-form").submit(async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const submitButton = $(form[2]);
    submitButton.attr("disabled", true).attr("aria-busy", true);

    await user.createUser(
      {
        name: formData.get("name"),
        job: formData.get("job"),
      },
      {
        onSuccess: (data) => {
          form.reset();
          alert("Success create user: " + data.name);
        },
      }
    );
    submitButton.removeAttr("disabled").removeAttr("aria-busy");

    closeDialog("#create-user-dialog__home");
  });

  $("#update-user-form").submit(async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const submitButton = $(form[3]);
    submitButton.attr("disabled", true).attr("aria-busy", true);

    await user.updateUser(
      {
        id: formData.get("id"),
        name: formData.get("name"),
        job: formData.get("job"),
      },
      {
        onSuccess: (data) => {
          form.reset();
          alert("Success update user: " + data.name);
        },
      }
    );
    submitButton.removeAttr("disabled").removeAttr("aria-busy");

    closeDialog("#update-user-dialog__home");
  });

  $("#delete-user-form").submit(async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const submitButton = $(form[1]);
    submitButton.attr("disabled", true).attr("aria-busy", true);

    console.log({ form });

    await user.deleteUser(
      {
        id: formData.get("id"),
      },
      {
        onSuccess: () => {
          form.reset();
          alert("Success delete user");
        },
      }
    );
    submitButton.removeAttr("disabled").removeAttr("aria-busy");

    closeDialog("#delete-user-dialog__home");
  });
});
