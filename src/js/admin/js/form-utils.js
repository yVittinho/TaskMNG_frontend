// js/form-utils.js

document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os formulários administrativos
  const forms = document.querySelectorAll(".form-admin");

  forms.forEach((form) => {
    // Cria o botão de limpar
    const btnLimpar = document.createElement("button");
    btnLimpar.type = "button";
    btnLimpar.className = "btn btn-outline-secondary px-4";
    btnLimpar.innerHTML = `<i class="bi bi-x-circle"></i> Limpar`;

    // Encontra a div que contém os botões do formulário
    const actionsDiv = form.querySelector(".form-actions");

    if (actionsDiv) {
      // Adiciona o botão "Limpar" à esquerda do botão principal
      actionsDiv.prepend(btnLimpar);

      // Ação de limpeza
      btnLimpar.addEventListener("click", () => {
        form.reset();
        form.classList.remove("was-validated");
        showAlert("Formulário limpo com sucesso!", "info");
      });
    }
  });
});
