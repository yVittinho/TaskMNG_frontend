document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const emailInput = document.getElementById("floatingInput");
  const senhaInput = document.getElementById("floatingPassword");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      showAlert("Preencha todos os campos.", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/taskmng/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
        credentials: "include", // essencial para cookies de sessão
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao realizar login");
      }

      showAlert("Login realizado com sucesso!", "success");

      // Redireciona para o painel após login
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      console.error(error);
      showAlert(error.message || "Erro inesperado no login.", "danger");
    }
  });

  // Exibe alertas bonitos com Bootstrap
  function showAlert(message, type = "info") {
    const alertPlaceholder = document.createElement("div");
    alertPlaceholder.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow" role="alert" style="z-index: 1055;">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
    document.body.appendChild(alertPlaceholder);
    setTimeout(() => alertPlaceholder.remove(), 3500);
  }

});

