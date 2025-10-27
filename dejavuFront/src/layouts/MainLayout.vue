<template>
  <div
    class="container-responsive"
    :style="{
      backgroundImage: `url(${configuracion.background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="overlay"></div>

    <!-- Título fijo en la parte superior -->
    <q-toolbar-title
      class="animate-character title-top"
      :class="configuracion.fuente"
      :style="{ 'font-family': configuracion.fuente }"
    >
      Sorteo&nbsp;&nbsp;&nbsp;DEJAVÙ
    </q-toolbar-title>
    <div>
      <h3 style="color: white; text-align: center; font-weight: 700">
        Comenazamos en {{ cuentaAtras }}
      </h3>
    </div>
    <!-- Números centrados en el medio -->
    <div class="numeros-container">
      <div
        v-if="digitosNecesarios >= 1"
        class="digito-fijo"
        :style="{ 'font-family': configuracion.fuente }"
      >
        {{ digito1 }}
      </div>
      <div
        v-if="digitosNecesarios >= 2"
        class="digito-fijo"
        :style="{ 'font-family': configuracion.fuente }"
      >
        {{ digito2 }}
      </div>
      <div
        v-if="digitosNecesarios >= 3"
        class="digito-fijo"
        :style="{ 'font-family': configuracion.fuente }"
      >
        {{ digito3 }}
      </div>
    </div>
    <button class="boton-iniciar" @click="iniciarSorteoCompleto">🎰 INICIAR SORTEO</button>

    <div class="explosion-container">
      <div
        v-for="particula in particulasExplosion"
        :key="'exp-' + particula.id"
        class="particula particula-explosion"
        :style="{
          '--start-x': '50%',
          '--start-y': '50%',
          '--end-x': `calc(50% + ${Math.cos((particula.angle * Math.PI) / 180) * particula.distance}px)`,
          '--end-y': `calc(50% + ${Math.sin((particula.angle * Math.PI) / 180) * particula.distance}px)`,
          width: `${particula.size}px`,
          height: `${particula.size}px`,
          animationDuration: `${particula.duration}s`,
          background: particula.color,
          boxShadow: `0 0 ${particula.size * 3}px ${particula.color}`,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Particles normales (background)

const particulasExplosion = ref([])
const crearExplosion = () => {
  particulasExplosion.value = Array.from({ length: 250 }, (_, i) => ({
    id: i,
    x: 50, // Centro de la pantalla
    y: 50,
    size: Math.random() * 55 + 3,
    duration: Math.random() * 30 + 2, // Más rápido
    delay: 0,
    color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    angle: Math.random() * 360,
    distance: Math.random() * 100 + 450,
  }))
}
const activarExplosion = () => {
  console.log('🎉 ACTIVANDO EXPLOSIÓN DE CONFETI!')
  crearExplosion()

  // Limpiar explosión después de 5 segundos
  setTimeout(() => {
    particulasExplosion.value = []
  }, 20000)
}
const configuracion = ref({
  color_primario: '#9c9e25',
  fuente: 'Chewy',
  background: '/images/discoBall2.png',
  numeroGanador: '129', // ✅ Puede ser '7', '78' o '786'
})

const numero1 = ref('')
const numero2 = ref('')
const numero3 = ref('')
const digitosNecesarios = ref(0) // ✅ Nueva variable para controlar cuántos dígitos mostrar

let intervalo1 = null
let intervalo2 = null
let intervalo3 = null
let digito1 = ref(0)
let digito2 = ref(0)
let digito3 = ref(0)

const repartirNumeros = () => {
  const numero = configuracion.value.numeroGanador
  digitosNecesarios.value = numero.length // ✅ 1, 2 o 3 dígitos

  let digitos = numero.split('')

  // ✅ Asignar según cuántos dígitos hay
  numero1.value = digitosNecesarios.value >= 1 ? digitos[0] : ''
  numero2.value = digitosNecesarios.value >= 2 ? digitos[1] : ''
  numero3.value = digitosNecesarios.value >= 3 ? digitos[2] : ''

  console.log(`🎯 Número ganador: ${numero} (${digitosNecesarios.value} dígitos)`)
  return digitos
}

// Cada dígito tiene sus propias variables
let tiempo1 = 200
let tiempo2 = 300
let tiempo3 = 100
const tiempoMinimo = 50
const decremento = 50
let sorteoActivo = false
let paradaContador1 = false
let paradaContador2 = false
let paradaContador3 = false

const cuentaAtras = ref(0)
const mostrarCuentaAtras = ref(false)
let intervaloCuentaAtras = null

const iniciarSorteoCompleto = () => {
  // 1. Mostrar cuenta atrás
  mostrarCuentaAtras.value = true
  cuentaAtras.value = 5

  // 2. Iniciar cuenta atrás
  intervaloCuentaAtras = setInterval(() => {
    cuentaAtras.value -= 1

    // 3. Cuando llegue a 0, iniciar el sorteo
    if (cuentaAtras.value === 0) {
      clearInterval(intervaloCuentaAtras)
      mostrarCuentaAtras.value = false
      iniciarSorteoReal() // Tu función original del sorteo
    }
  }, 1000)
}

const iniciarSorteoReal = () => {
  sorteoActivo = true
  console.log('🎰 SORTEO INICIADO')
  repartirNumeros()

  // ✅ Resetear tiempos
  tiempo1 = 500
  tiempo2 = 300
  tiempo3 = 100
  paradaContador1 = false
  paradaContador2 = false
  paradaContador3 = false
  // ✅ Iniciar solo los dígitos necesarios
  if (digitosNecesarios.value >= 1) {
    iniciarContador1()
  }

  if (digitosNecesarios.value >= 2) {
    setTimeout(() => {
      console.log('🔢 Iniciando contador 2')
      iniciarContador2()
    }, 3000)
  }

  if (digitosNecesarios.value >= 3) {
    setTimeout(() => {
      console.log('🔢 Iniciando contador 3')
      iniciarContador3()
    }, 6000)
  }

  // ✅ Programar paradas solo para dígitos necesarios
  if (digitosNecesarios.value >= 1) {
    setTimeout(() => {
      console.log('🛑 Deteniendo contador 1')
      detenerContador1()
      digito1.value = numero1.value
    }, 15000)
  }

  if (digitosNecesarios.value >= 2) {
    setTimeout(() => {
      console.log('🛑 Deteniendo contador 2')
      detenerContador2()
      digito2.value = numero2.value
    }, 18000)
  }

  if (digitosNecesarios.value >= 3) {
    setTimeout(() => {
      console.log('🛑 Deteniendo contador 3')
      detenerContador3()
      digito3.value = numero3.value
      desactivarSorteoCompleto()
    }, 20000)
  } else {
    // ✅ Si no hay 3 dígitos, desactivar después del último
    const ultimoTimeout = digitosNecesarios.value === 1 ? 15000 : 18000
    setTimeout(desactivarSorteoCompleto, ultimoTimeout + 1000)
  }
}

const iniciarContador1 = () => {
  // ✅ Si el sorteo se paró O este contador específico se detuvo, no hacer nada más.
  if (!sorteoActivo || paradaContador1) return

  detenerContador1() // Esto limpia el intervalo anterior para crear uno más rápido
  tiempo1 = tiempo1 - decremento

  intervalo1 = setInterval(() => {
    digito1.value++
    if (digito1.value > 9) digito1.value = 0
  }, tiempo1)

  // ✅ Añadir la comprobación de !paradaContador1 aquí
  if (tiempo1 > tiempoMinimo && sorteoActivo && !paradaContador1) {
    setTimeout(iniciarContador1, 500)
  }
}

const iniciarContador2 = () => {
  // ✅ Comprobación de parada
  if (!sorteoActivo || paradaContador2) return

  detenerContador2()
  tiempo2 = tiempo2 - decremento

  intervalo2 = setInterval(() => {
    digito2.value++
    if (digito2.value > 9) digito2.value = 0
  }, tiempo2)

  // ✅ Añadir la comprobación de !paradaContador2
  if (tiempo2 > tiempoMinimo && sorteoActivo && !paradaContador2) {
    setTimeout(iniciarContador2, 500)
  }
}
const iniciarContador3 = () => {
  // ✅ Comprobación de parada
  if (!sorteoActivo || paradaContador3) return

  detenerContador3()
  tiempo3 = tiempo3 - decremento

  intervalo3 = setInterval(() => {
    digito3.value++
    if (digito3.value > 9) digito3.value = 0
  }, tiempo3)

  // ✅ Añadir la comprobación de !paradaContador3
  if (tiempo3 > tiempoMinimo && sorteoActivo && !paradaContador3) {
    setTimeout(iniciarContador3, 500)
  }
}

const detenerContador1 = () => {
  paradaContador1 = true // ✅ ¡AQUÍ ESTÁ LA MAGIA!
  console.log('🛑 detenerContador1 llamado, intervalo1:', intervalo1)

  if (intervalo1) {
    clearInterval(intervalo1)
    intervalo1 = null
    console.log('✅ Contador 1 DETENIDO')
  } else {
    console.log('❌ Contador 1 ya estaba detenido')
  }
  if (!intervalo1 && !intervalo2 && !intervalo3) {
    activarExplosion()
  }
}

const detenerContador2 = () => {
  paradaContador2 = true // ✅ AVISAR AL CONTADOR 2 QUE PARE
  console.log('🛑 detenerContador2 llamado, intervalo2:', intervalo2)

  if (intervalo2) {
    clearInterval(intervalo2)
    intervalo2 = null
    console.log('✅ Contador 2 DETENIDO')
  } else {
    console.log('❌ Contador 2 ya estaba detenido')
  }
  if (!intervalo1 && !intervalo2 && !intervalo3) {
    activarExplosion()
  }
}

const detenerContador3 = () => {
  paradaContador3 = true // ✅ AVISAR AL CONTADOR 3 QUE PARE
  console.log('🛑 detenerContador3 llamado, intervalo3:', intervalo3)

  if (intervalo3) {
    clearInterval(intervalo3)
    intervalo3 = null
    console.log('✅ Contador 3 DETENIDO')
  } else {
    console.log('❌ Contador 3 ya estaba detenido')
  }
  if (!intervalo1 && !intervalo2 && !intervalo3) {
    activarExplosion()
  }
}

const desactivarSorteoCompleto = () => {
  sorteoActivo = false
  console.log('🎯 SORTEO COMPLETAMENTE DESACTIVADO')
}

onMounted(() => {
  console.log('App montada - listo para sorteo!')
  repartirNumeros() // ✅ Para que se vean los dígitos iniciales
})
</script>

<style scoped>
particles-container,
.explosion-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* Partículas de fondo (normales) */
.particula-fondo {
  position: absolute;
  border-radius: 50%;
  animation: float-fondo infinite linear;
  opacity: 0;
}

@keyframes float-fondo {
  0% {
    transform: translateY(100vh) translateX(0px) rotate(0deg) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
    transform: translateY(80vh) translateX(10px) rotate(90deg) scale(1);
  }
  90% {
    opacity: 0.6;
    transform: translateY(20vh) translateX(20px) rotate(270deg) scale(1);
  }
  100% {
    transform: translateY(-100px) translateX(30px) rotate(360deg) scale(0.5);
    opacity: 0;
  }
}

/* Partículas de explosión (más grandes y rápidas) */
.particula-explosion {
  position: absolute;
  border-radius: 50%;
  left: var(--start-x);
  top: var(--start-y);
  animation: explosion linear forwards;
  opacity: 1;
}

@keyframes explosion {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  70% {
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(var(--end-x) - var(--start-x)), calc(var(--end-y) - var(--start-y)))
      scale(0.5);
    opacity: 0;
  }
}

/* Asegurar que el contenido esté encima */
.overlay,
.title-top,
.numeros-container,
.boton-iniciar {
  position: relative;
  z-index: 2;
}

/* Asegurar que el contenido esté encima */
.overlay,
.title-top,
.numeros-container,
.boton-iniciar {
  position: relative;
  z-index: 2;
}

.boton-iniciar {
  position: relative; /* ✅ Importante */
  z-index: 10; /* ✅ Más alto que el overlay (z-index: 1) */
  margin: 20px auto;
  padding: 15px 30px;
  font-size: 1.5rem;
  background: #ff00cc;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.container-responsive {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: relative;
  padding: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

/* Título en la parte superior - ocupa solo lo necesario */
.title-top {
  position: relative;
  z-index: 2;
  font-size: clamp(2rem, 8vw, 80px) !important;
  margin-top: 20px;
  flex-shrink: 0; /* No se reduce */
  height: auto;
  min-height: 100px;
  /* Asegurar que el título use los mismos estilos animados */
  text-transform: uppercase;
  background-image: linear-gradient(-225deg, #231557 0%, #44107a 29%, #ff1361 67%, #fff800 100%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: textclip 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* Contenedor de números - ocupa el espacio restante */
.numeros-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5vh;
  flex-grow: 1; /* ✅ Ocupa el espacio disponible */
  width: 100%;
  position: relative;
  z-index: 2;
}

.digito-fijo {
  font-size: 25vh;
  /* font-family: 'Monoton', cursive; */
  background: linear-gradient(-225deg, #ff00cc, #3333ff, #00ffcc);
  background-size: 200% auto; /* ✅ Faltaba esto */
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: textclip 3s linear infinite; /* ✅ Animación diferente */
  text-align: center;
  min-width: 30vh;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5vh solid rgba(255, 255, 255, 0.3);
  border-radius: 3vh;
}

@keyframes textclip {
  to {
    background-position: 200% center;
  }
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .title-top {
    font-size: clamp(1.8rem, 7vw, 60px) !important;
    margin-top: 15px;
    min-height: 80px;
  }

  .digito-fijo {
    font-size: 20vh;
    min-width: 25vh;
    height: 25vh;
  }

  .numeros-container {
    gap: 3vh;
  }
}
/* EN TU CSS */
.disco-font-1 {
  font-family: 'Monoton', cursive; /* Muy retro años 80 */
}

.disco-font-2 {
  font-family: 'Luckiest Guy', cursive; /* Divertida y gruesa */
}

.disco-font-3 {
  font-family: 'Bungee', cursive; /* Energética */
}

.disco-font-4 {
  font-family: 'Righteous', cursive; /* Estilo cartel neón */
}

.disco-font-5 {
  font-family: 'Chewy', cursive; /* Joven y divertida */
}
</style>
