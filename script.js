"use strict";
// Correo de contacto del portafolio.
const CONTACT_EMAIL = "eddychuquimiapinto@gmail.com";
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
// 1. Menú adaptable para celulares.
menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navigation.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false");
}));
// 2. Tema claro/oscuro, con preferencia guardada cuando el navegador lo permite.
const themeButton = document.querySelector("#theme-button");
function setTheme(light) {
  document.body.classList.toggle("light", light);
  themeButton.textContent = light ? "Tema oscuro ☾" : "Tema claro ☀";
  themeButton.setAttribute("aria-label", light ? "Activar tema oscuro" : "Activar tema claro");
}
try { setTheme(localStorage.getItem("eddy-theme") === "light"); } catch (_) {}
themeButton.addEventListener("click", () => {
  const light = !document.body.classList.contains("light"); setTheme(light);
  try { localStorage.setItem("eddy-theme", light ? "light" : "dark"); } catch (_) {}
});
// 3. Filtro de proyectos por categoría.
document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("[data-filter]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
  let count = 0;
  document.querySelectorAll("[data-category]").forEach(card => {
    card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  });
  document.querySelector("#filter-status").textContent = `${count} proyectos visibles`;
}));
// 4. Galería ampliable. El diálogo permite cerrar con Escape.
const gallery = document.querySelector("#gallery");
document.querySelectorAll("[data-image]").forEach(button => button.addEventListener("click", () => {
  const image = document.querySelector("#gallery-image"); image.src = button.dataset.image;
  image.alt = button.querySelector("img").alt;
  document.querySelector("#gallery-caption").textContent = button.dataset.caption; gallery.showModal();
}));
document.querySelector("#close-gallery").addEventListener("click", () => gallery.close());
gallery.addEventListener("click", event => { if (event.target === gallery) gallery.close(); });
// 5. Validación del formulario y preparación de un correo, sin envío automático.
const form = document.querySelector("#contact-form");
if (CONTACT_EMAIL) {
  const link = document.querySelector("#contact-info");
  link.href = `mailto:${CONTACT_EMAIL}`; link.textContent = CONTACT_EMAIL;
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const status = document.querySelector("#form-status");
  if (!form.reportValidity()) { status.textContent = "Revisa los campos: nombre, correo válido y mensaje de al menos 10 caracteres."; return; }
  const name = form.elements.name.value.trim(); const message = form.elements.message.value.trim();
  if (name.length < 2 || message.length < 10) { status.textContent = "Escribe un nombre y un mensaje completos, sin contar espacios vacíos."; return; }
  if (!CONTACT_EMAIL) { status.textContent = "Formulario validado. Eddy todavía debe configurar su correo de contacto. No se ha enviado ningún mensaje."; return; }
  const body = `Nombre: ${name}\nCorreo: ${form.elements.email.value.trim()}\n\n${message}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contacto desde el portafolio")}&body=${encodeURIComponent(body)}`;
  status.textContent = "Se solicitó abrir tu aplicación de correo. Revisa y envía el mensaje desde allí.";
});
document.querySelector("#year").textContent = new Date().getFullYear();

// 6. Música de fondo: se inicia solamente cuando la persona pulsa el botón.
const music = document.querySelector("#background-music");
const musicToggle = document.querySelector("#music-toggle");
const musicStatus = document.querySelector("#music-status");
const musicVolume = document.querySelector("#music-volume");
music.volume = Number(musicVolume.value);
function updateMusicButton() {
  musicToggle.textContent = music.paused ? "Reproducir música" : "Pausar música";
  musicToggle.setAttribute("aria-pressed", String(!music.paused));
}
musicToggle.addEventListener("click", async () => {
  if (!music.paused) { music.pause(); return; }
  musicToggle.disabled = true;
  try { await music.play(); musicStatus.textContent = "Música activada"; }
  catch (_) { musicStatus.textContent = "No se pudo reproducir el audio. Comprueba que exista audio/fondo.mp3."; }
  finally { musicToggle.disabled = false; updateMusicButton(); }
});
music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);
musicVolume.addEventListener("input", () => { music.volume = Number(musicVolume.value); });
