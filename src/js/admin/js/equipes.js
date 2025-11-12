// js/equipes.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEquipe");
  const listaEquipes = document.getElementById("listaEquipes");

  carregarEquipes();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert("Por favor, preencha todos os campos corretamente.", "warning");
      return;
    }

    const novaEquipe = {
      nomeEquipe: document.getElementById("nomeEquipe").value.trim(),
      ativo: parseInt(document.getElementById("ativo").value),
    };

    const idProjeto = document.getElementById("projeto").value;
    const idTechLead = document.getElementById("techLead").value;

    const params = new URLSearchParams({
      idProjeto,
      idTechLead,
    });

    try {
      await apiRequest(`/equipe/criar?${params.toString()}`, "POST", novaEquipe);
      showAlert("Equipe cadastrada com sucesso!");
      form.reset();
      form.classList.remove("was-validated");
      carregarEquipes();
    } catch (err) {
      showAlert(`Erro ao cadastrar equipe: ${err.message}`, "danger");
    }
  });

  async function carregarEquipes() {
    try {
      const equipes = await apiRequest("/equipe/listar", "GET");
      listaEquipes.innerHTML = "";

      if (equipes.length === 0) {
        listaEquipes.innerHTML =
          '<tr><td colspan="5" class="text-center text-muted">Nenhuma equipe cadastrada.</td></tr>';
        return;
      }

      equipes.forEach((equipe, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${equipe.nomeEquipe}</td>
          <td>${equipe.nomeProjeto || "—"}</td>
          <td>${equipe.nomeTechLead || "—"}</td>
          <td>${equipe.ativo === 1 ? "Ativa" : "Inativa"}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger excluir" data-index="${index}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;

        // Exclusão
        tr.querySelector(".excluir").addEventListener("click", async () => {
          if (confirm(`Deseja realmente excluir a equipe "${equipe.nomeEquipe}"?`)) {
            try {
              await apiRequest(`/equipe/excluir/${index + 1}`, "DELETE");
              showAlert("Equipe excluída com sucesso!", "info");
              carregarEquipes();
            } catch (err) {
              showAlert(`Erro ao excluir: ${err.message}`, "danger");
            }
          }
        });

        listaEquipes.appendChild(tr);
      });
    } catch (err) {
      listaEquipes.innerHTML =
        '<tr><td colspan="5" class="text-center text-danger">Erro ao carregar equipes.</td></tr>';
      console.error(err);
    }
  }
});
