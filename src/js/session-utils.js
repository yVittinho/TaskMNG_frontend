export async function verificarSessao() {
  try {
    const response = await fetch("http://localhost:8080/taskmng/auth/verify", {
      credentials: "include",
    });

    if (!response.ok) {
      window.location.href = "login.html";
      return null;
    }

    const usuario = await response.json();
    console.log("Usuário logado:", usuario);
    return usuario;
  } catch (err) {
    console.error(err);
    window.location.href = "login.html";
  }
}
