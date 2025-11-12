document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formUsuario");
  const listaUsuarios = document.getElementById("listaUsuarios");

  carregarUsuarios();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      form.classList.add("was-validated");
      return;
    }

    const novoUsuario = {
      nome: document.getElementById("nome").value.trim(),
      idade: parseInt(document.getElementById("idade").value),
      email: document.getElementById("email").value.trim(),
      senha: document.getElementById("senha").value.trim(),
      tipoPerfil: document.getElementById("perfil").value,
      ativo: parseInt(document.getElementById("ativo").value),
    };

    try {
      await apiRequest("/usuario/criar", "POST", novoUsuario);
      showAlert("Usuário cadastrado com sucesso!");
      form.reset();
      form.classList.remove("was-validated");
      carregarUsuarios();
    } catch (err) {
      console.error(err);
      showAlert(`Erro ao cadastrar usuário: ${err.message}`, "danger");
    }
  });

  function validarFormulario() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Regex de validação de e-mail (domínio existente)
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

    // Regex de validação de senha (8–14 chars, minúscula, maiúscula, número e símbolo)
    const senhaRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,14}$/;

    if (!emailRegex.test(email)) {
      showAlert("Por favor, insira um e-mail válido com domínio existente.", "warning");
      return false;
    }

    if (!senhaRegex.test(senha)) {
      showAlert(
        "A senha deve ter entre 8 e 14 caracteres e incluir letra maiúscula, minúscula, número e símbolo.",
        "warning"
      );
      return false;
    }

    return form.checkValidity();
  }

  async function carregarUsuarios() {
    try {
      const usuarios = await apiRequest("/usuario/listar", "GET");
      listaUsuarios.innerHTML = "";

      if (!usuarios || usuarios.length === 0) {
        listaUsuarios.innerHTML =
          '<tr><td colspan="6" class="text-center text-muted">Nenhum usuário cadastrado.</td></tr>';
        return;
      }

      usuarios.forEach((u) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${u.nome}</td>
          <td>${u.idade}</td>
          <td>${u.email || "-"}</td>
          <td>${u.tipoPerfil}</td>
          <td>${u.ativo === 1 ? "Ativo" : "Inativo"}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger excluir">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;

        tr.querySelector(".excluir").addEventListener("click", async () => {
          if (confirm(`Deseja realmente excluir ${u.nome}?`)) {
            try {
              await apiRequest(`/usuario/excluir/${u.id}`, "DELETE");
              showAlert("Usuário excluído com sucesso!", "info");
              carregarUsuarios();
            } catch (err) {
              showAlert(`Erro ao excluir: ${err.message}`, "danger");
            }
          }
        });

        listaUsuarios.appendChild(tr);
      });
    } catch (err) {
      listaUsuarios.innerHTML =
        '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar usuários.</td></tr>';
      console.error(err);
    }
  }

   const popoverTriggerList = Array.from(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );

  popoverTriggerList.forEach((el) => {
    new bootstrap.Popover(el, {
      trigger: "focus", // exibe ao clicar e desaparece ao clicar fora
      html: true,
      container: "body" // mantém o popover sobreposto, sem empurrar o layout
    });
  });
});
