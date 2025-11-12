// js/api.js
const API_BASE = "http://localhost:8080/taskmng";

/**
 * Função genérica para fazer requisições ao backend Spring Boot
 * @param {string} endpoint - Caminho do recurso (ex: "/usuario/listar")
 * @param {string} method - Método HTTP ("GET", "POST", "PUT", "DELETE")
 * @param {Object|null} body - Corpo da requisição (se houver)
 * @param {boolean} parseJson - Define se o retorno deve ser convertido em JSON
 */
async function apiRequest(endpoint, method = "GET", body = null, parseJson = true) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Autenticação futura (caso adicione JWT)
  const token = sessionStorage.getItem("authToken");
  if (token) options.headers["Authorization"] = `Bearer ${token}`;

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Erro ${response.status}: ${message}`);
  }

  return parseJson ? response.json() : null;
}

/**
 * Utilitário para mostrar feedback rápido
 */
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertDiv.style.zIndex = "1055";
  alertDiv.innerHTML = `
    <span>${message}</span>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 4000);
}
