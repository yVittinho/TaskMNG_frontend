// js/tarefas.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formTarefa");
  const listaTarefas = document.getElementById("listaTarefas");

  carregarTarefas();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert("Por favor, preencha todos os campos corretamente.", "warning");
      return;
    }

    const novaTarefa = {
      nomeTarefa: document.getElementById("nome").value.trim(),
      descricao: document.getElementById("descricao").value.trim(),
      dataEntrega: document.getElementById("dataEntrega").value,
      prioridade: document.getElementById("prioridade").value,
      status: document.getElementById("status").value,
      colaboradorDesignado: document.getElementById("colaborador").value.trim(),
      descricaoProjeto: document.getElementById("projeto").value.trim(),
    };

    try {
      await apiRequest("/tarefa/criar", "POST", novaTarefa);
      showAlert("Tarefa cadastrada com sucesso!");
      form.reset();
      form.classList.remove("was-validated");
      carregarTarefas();
    } catch (err) {
      showAlert(`Erro ao cadastrar tarefa: ${err.message}`, "danger");
    }
  });

  async function carregarTarefas() {
    try {
      const tarefas = await apiRequest("/tarefa/listar", "GET");
      listaTarefas.innerHTML = "";

      if (tarefas.length === 0) {
        listaTarefas.innerHTML =
          '<tr><td colspan="7" class="text-center text-muted">Nenhuma tarefa cadastrada.</td></tr>';
        return;
      }

      tarefas.forEach((t) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${t.nomeTarefa}</td>
          <td>${t.descricaoProjeto || "—"}</td>
          <td>${t.colaboradorDesignado || "—"}</td>
          <td>${t.dataEntrega ? new Date(t.dataEntrega).toLocaleDateString() : "—"}</td>
          <td><span class="badge bg-${
            t.prioridade === "ALTA" ? "danger" : t.prioridade === "MEDIA" ? "warning" : "success"
          }">${t.prioridade}</span></td>
          <td>${t.status}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger excluir">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;

        tr.querySelector(".excluir").addEventListener("click", async () => {
          if (confirm(`Deseja excluir a tarefa "${t.nomeTarefa}"?`)) {
            try {
              await apiRequest(`/tarefa/excluir/${t.id}`, "DELETE");
              showAlert("Tarefa excluída com sucesso!", "info");
              carregarTarefas();
            } catch (err) {
              showAlert(`Erro ao excluir: ${err.message}`, "danger");
            }
          }
        });

        listaTarefas.appendChild(tr);
      });
    } catch (err) {
      listaTarefas.innerHTML =
        '<tr><td colspan="7" class="text-center text-danger">Erro ao carregar tarefas.</td></tr>';
      console.error(err);
    }
  }
});
