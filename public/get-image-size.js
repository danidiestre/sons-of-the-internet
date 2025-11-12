// Pega este código en la consola del navegador para ver el tamaño real de la imagen

// Método 1: Obtener el tamaño del contenedor
const container = document.querySelector('[style*="aspectRatio"]');
if (container) {
  const rect = container.getBoundingClientRect();
  console.log('📐 Tamaño del contenedor:', rect.width, 'x', rect.height, 'px');
}

// Método 2: Obtener el tamaño natural de la imagen
const img = document.querySelector('img[alt="Plano de la casa"]');
if (img) {
  // Esperar a que la imagen cargue
  if (img.complete) {
    console.log('🖼️ Tamaño natural de la imagen:', img.naturalWidth, 'x', img.naturalHeight, 'px');
    console.log('📏 Tamaño renderizado:', img.width, 'x', img.height, 'px');
  } else {
    img.onload = () => {
      console.log('🖼️ Tamaño natural de la imagen:', img.naturalWidth, 'x', img.naturalHeight, 'px');
      console.log('📏 Tamaño renderizado:', img.width, 'x', img.height, 'px');
    };
  }
}

// Método 3: Medir coordenadas al hacer clic
console.log('👆 Haz clic en la imagen para ver las coordenadas en porcentajes');
document.addEventListener('click', function measureClick(e) {
  if (container && container.contains(e.target)) {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`📍 Click en: x: ${x.toFixed(2)}%, y: ${y.toFixed(2)}%`);
  }
}, { once: false });

