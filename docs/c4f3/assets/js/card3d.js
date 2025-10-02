const wrapper = document.querySelector(".wrapper");
const card = document.querySelector(".card");
const img = card.querySelector("img");

function applyTransform(x, y, rect) {
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;

  // Rotación del contenedor
  const rotY = (x - halfWidth) / halfWidth * 15;
  const rotX = (halfHeight - y) / halfHeight * 15;
  card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  // Movimiento independiente de la imagen
  const moveX = (x - halfWidth) / halfWidth * 20;
  const moveY = (y - halfHeight) / halfHeight * 20;

  img.style.transform = `translateZ(80px) translate(${moveX}px, ${moveY}px)`;
  img.style.filter = `drop-shadow(${-moveX}px ${-moveY}px 15px rgba(0,0,0,0.35))`;
}

// 🖱️ Para PC
wrapper.addEventListener("mousemove", (e) => {
  const rect = wrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  applyTransform(x, y, rect);
});

// 📱 Para móvil
wrapper.addEventListener("touchmove", (e) => {
  const rect = wrapper.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  applyTransform(x, y, rect);
}, { passive: true });

// Reset al salir o soltar
function resetCard() {
  card.style.transform = `rotateX(0deg) rotateY(0deg)`;
  img.style.transform = `translateZ(0px) translate(0,0)`;
  img.style.filter = "none";
}

wrapper.addEventListener("mouseleave", resetCard);
wrapper.addEventListener("touchend", resetCard);
