// js/footer.js

document.addEventListener("DOMContentLoaded", () => {
  const footerHTML = `
    <footer class="text-center py-3 shadow-lg bg-dark text-white fixed-bottom">
      <p class="m-0">
        &copy; 2025 TaskMNG | Desenvolvido por Murillo Aragão e Victtor Marcelo
        <br />
        <a
          href="https://github.com/yVittinho/TaskMNG_frontend"
          target="_blank"
          class="text-decoration-none text-white-50"
        >
          <i class="bi bi-github me-1"></i> Repositório no GitHub
        </a>
      </p>
    </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);
});
