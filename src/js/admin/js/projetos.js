// js/projetos.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProjeto");
  const listaProjetos = document.getElementById("listaProjetos");

  carregarProjetos();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert("Por favor, preencha todos os campos corretamente.", "warning");
      return;
    }

    const novoProjeto = {
      descricaoProjeto: document.getElementById("descricao").value.trim(),
      statusProjeto: document.getElementById("status").value,
    };

    try {
      await apiRequest("/projeto/criar", "POST", novoProjeto);
      showAlert("Projeto cadastrado com sucesso!");
      form.reset();
      form.classList.remove("was-validated");
      carregarProjetos();
    } catch (err) {
      showAlert(`Erro ao cadastrar projeto: ${err.message}`, "danger");
    }
  });

  async function carregarProjetos() {
    try {
      const projetos = await apiRequest("/projeto/listar", "GET");
      listaProjetos.innerHTML = "";

      if (projetos.length === 0) {
        listaProjetos.innerHTML =
          '<tr><td colspan="3" class="text-center text-muted">Nenhum projeto cadastrado.</td></tr>';
        return;
      }

      projetos.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.descricaoProjeto}</td>
          <td>${p.statusProjeto || "—"}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger excluir">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;

        tr.querySelector(".excluir").addEventListener("click", async () => {
          if (confirm(`Deseja realmente excluir o projeto "${p.descricaoProjeto}"?`)) {
            try {
              await apiRequest(`/projeto/excluir/${p.id}`, "DELETE");
              showAlert("Projeto excluído com sucesso!", "info");
              carregarProjetos();
            } catch (err) {
              showAlert(`Erro ao excluir: ${err.message}`, "danger");
            }
          }
        });

        listaProjetos.appendChild(tr);
      });
    } catch (err) {
      listaProjetos.innerHTML =
        '<tr><td colspan="3" class="text-center text-danger">Erro ao carregar projetos.</td></tr>';
      console.error(err);
    }
  }
});
