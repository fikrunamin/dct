if (auth.isLoggedin()) {
  window.location.href = "/dct/home.html";
}

$(function () {
  const loginForm = $(".login-form__login");

  loginForm.on("submit", async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const submitButton = $(form[2]);
    submitButton.attr("disabled", true).attr("aria-busy", true);

    await auth.attemptLogin(
      {
        email: formData.get("email"),
        password: formData.get("password"),
      },
      {
        onSuccess: () => {
          window.location.href = "home.html";
        },
        onFailed: (error) => {
          form[0].focus();
          submitButton.removeAttr("disabled").removeAttr("aria-busy", true);
          alert(error);
        },
      }
    );
  });
});
