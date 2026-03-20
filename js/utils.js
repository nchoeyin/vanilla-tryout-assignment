// script.js
document.addEventListener("DOMContentLoaded", async () => {
  const target = document.getElementById("navbar-root");
  if (!target) return;

  try {
    const res = await fetch("navbar.html");
    const html = await res.text();
    target.innerHTML = html;
  } catch (error) {
    console.error("Failed to load navbar:", error);
  }
});
