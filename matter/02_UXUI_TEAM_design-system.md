# [UX/UI TEAM] — Matter: Design System, Paleta de Colores y Animaciones

## Paleta de Colores Hexadecimal — Triage Emocional

### Sistema de Color Dinámico (Emotion-Reactive)

El color de la app **no es estático**: el ThemeProvider escucha el `triageLevel` del store y transiciona suavemente entre paletas usando Reanimated `withSpring`.

---

### NIVEL VERDE — Fricción Diaria (Fun Mode)

| Token | Hex | Uso |
|---|---|---|
| `--emotion-anger-primary` | `#FF4B2B` | Burbuja enojo intenso |
| `--emotion-anger-secondary` | `#FF6F47` | Glow / aura de burbuja enojo |
| `--emotion-frustration-primary` | `#FF8C00` | Burbuja frustración media |
| `--emotion-frustration-secondary` | `#FFA833` | Borde / shimmer |
| `--emotion-annoyance-primary` | `#FFCA28` | Burbuja molestia leve |
| `--emotion-annoyance-secondary` | `#FFD966` | Fondo sutil de sesión |
| `--glass-green-bg` | `#FFFDF5` | Fondo principal (Light Mode, sesión verde) |
| `--glass-green-card` | `rgba(255,255,255,0.55)` | Tarjeta glassmorphism |
| `--glass-green-border` | `rgba(255,202,40,0.35)` | Borde de cristal |

---

### NIVEL AMARILLO — Agotamiento (Contenedor Seguro)

| Token | Hex | Uso |
|---|---|---|
| `--emotion-anxiety-primary` | `#6C63FF` | Burbuja ansiedad |
| `--emotion-anxiety-secondary` | `#9D97FF` | Aura / glow suave |
| `--emotion-fatigue-primary` | `#4A90D9` | Burbuja fatiga cognitiva |
| `--emotion-fatigue-secondary` | `#7BB8F0` | Shimmer |
| `--emotion-sadness-primary` | `#3D5A80` | Burbuja tristeza profunda |
| `--emotion-sadness-secondary` | `#6B8EAD` | Borde sutil |
| `--emotion-burnout-primary` | `#7B4FA6` | Burbuja burnout |
| `--emotion-burnout-secondary` | `#A67BC8` | Glow |
| `--glass-yellow-bg` | `#0D0D1A` | Fondo (Dark Mode, sesión amarilla) |
| `--glass-yellow-card` | `rgba(108,99,255,0.12)` | Tarjeta glassmorphism oscura |
| `--glass-yellow-border` | `rgba(108,99,255,0.3)` | Borde cristal azul-púrpura |

---

### EL DEBRIEF — Intervención AI (Deep Work)

| Token | Hex | Uso |
|---|---|---|
| `--debrief-bg` | `#071A1E` | Fondo Dark Mode inmersivo |
| `--debrief-accent` | `#00D2C8` | Turquesa principal (inducción de calma) |
| `--debrief-accent-soft` | `#00F0E4` | Highlight / botones CTA |
| `--debrief-accent-glow` | `rgba(0,210,200,0.25)` | Halo alrededor de tarjetas AI |
| `--debrief-card-bg` | `rgba(0,210,200,0.08)` | Fondo glassmorphism turquesa |
| `--debrief-card-border` | `rgba(0,240,228,0.25)` | Borde cristal |
| `--debrief-text-primary` | `#E8F8F7` | Texto principal |
| `--debrief-text-secondary` | `#8ECECA` | Texto secundario / labels |

---

### NIVEL ROJO — Protocolo de Crisis

| Token | Hex | Uso |
|---|---|---|
| `--crisis-bg` | `#111111` | Fondo neutro sin saturación |
| `--crisis-card` | `rgba(255,255,255,0.06)` | Tarjeta contenida, sin color |
| `--crisis-text` | `#D4D4D4` | Texto neutro, no alarmante |
| `--crisis-cta` | `#4CAF50` | Verde seguro para botones de ayuda |
| `--crisis-border` | `rgba(255,255,255,0.1)` | Borde casi invisible |

---

### Sistema Base (Tokens Universales)

| Token | Hex | Uso |
|---|---|---|
| `--background-light` | `#F8F7FF` | Fondo Home (Light Mode base) |
| `--surface-blur` | `rgba(255,255,255,0.4)` | Superficie glassmorphism universal |
| `--text-primary-dark` | `#1A1A2E` | Texto sobre fondos claros |
| `--text-primary-light` | `#F0F0FF` | Texto sobre fondos oscuros |
| `--shadow-soft` | `rgba(0,0,0,0.08)` | Sombra difusa tarjetas |
| `--shadow-glow` | depende de emoción activa | Sombra de color (computed) |
| `--radius-bubble` | `50%` | Burbujas perfectamente redondas |
| `--radius-card` | `24px` | Tarjetas glassmorphism |
| `--radius-button` | `16px` | Botones principales |

---

## Tipografía

| Rol | Fuente | Peso | Uso |
|---|---|---|---|
| Display / Headlines | **Plus Jakarta Sans** | 700-800 | Saludos, títulos de pantalla |
| Body / UI | **Inter** | 400-500 | Texto general, labels |
| Monospace / AI Output | **JetBrains Mono** | 400 | Respuestas de Re-Frame |
| Accent / Taglines | **Syne** | 700 | Marketing in-app, onboarding |

---

## Librerías de Animación — Liquid Glass Interactivo

### 1. React Native Reanimated 3 (Animaciones Core)
```ts
// Ejemplo: Burbuja que "respira" (pulse orgánico)
const breathScale = useSharedValue(1);

useEffect(() => {
  breathScale.value = withRepeat(
    withSequence(
      withSpring(1.06, { damping: 6, stiffness: 40 }),
      withSpring(0.97, { damping: 6, stiffness: 40 })
    ),
    -1, // infinito
    true
  );
}, []);

const animStyle = useAnimatedStyle(() => ({
  transform: [{ scale: breathScale.value }],
}));
```
**Uso:** Pulso de burbujas, transición de colores entre niveles de Triage, micro-interacciones del botón micrófono.

---

### 2. Three.js via expo-gl (Fluidos y Orbes)
```ts
// Shader GLSL simplificado para orbe líquido
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  float noise(vec2 p) {
    return sin(p.x * 3.0 + uTime) * sin(p.y * 2.5 + uTime * 0.7);
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    float edge = smoothstep(0.5, 0.45, dist + noise(uv * 2.0) * 0.08);
    float gloss = pow(max(dot(normalize(uv), vec2(0.3, 0.7)), 0.0), 4.0) * 0.4;
    vec3 color = mix(uColor * 0.6, uColor, edge) + gloss;
    gl_FragColor = vec4(color, edge * 0.85);
  }
`;
```
**Uso:** BubbleCanvas.tsx — renderiza el ecosistema de burbujas con física de fluidos y reflejos de cristal.

---

### 3. React Native Gesture Handler (Swipe Interactions)
```ts
// LongPress → activa Focus Mode; Swipe Up → POP!
const swipeGesture = Gesture.Pan()
  .onUpdate((e) => {
    translateY.value = e.translationY;
  })
  .onEnd((e) => {
    if (e.translationY < -80) {
      runOnJS(handlePopBubble)(); // Swipe Up → POP!
    } else if (e.translationY > 80) {
      runOnJS(handleArchiveBubble)(); // Swipe Down → Archivar
    } else {
      translateY.value = withSpring(0);
    }
  });
```

---

### 4. @react-native-community/blur (Glassmorphism)
```tsx
import { BlurView } from '@react-native-community/blur';

// Tarjeta glassmorphism universal
<BlurView
  style={styles.glassCard}
  blurType="light"       // "dark" para sesión Nivel Amarillo / Debrief
  blurAmount={18}
  reducedTransparencyFallbackColor="rgba(255,255,255,0.6)"
>
  {children}
</BlurView>

// styles
glassCard: {
  borderRadius: 24,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.35)',
  overflow: 'hidden',
  // Sombra suave
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 20,
  elevation: 6,
}
```

---

### 5. Expo Haptics (Feedback Táctil Satisfactorio)
```ts
import * as Haptics from 'expo-haptics';

// POP! → impacto fuerte + confeti
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// LongPress → selección suave
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Swipe de Archivo → leve
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

---

## Especificaciones de UI por Pantalla

### Screen 1 — Lienzo de Descarga (Home)
- **Fondo:** `#F8F7FF` con gradiente radial sutil `rgba(108,99,255,0.04)` desde el centro
- **Saludo:** "Hola, [Nombre]" — Plus Jakarta Sans 800, 28px, color `#1A1A2E`
- **Botón micrófono:** Círculo 96px, fondo `rgba(255,255,255,0.7)` + BlurView, icono SF Symbol / Material, aura pulsante en el color de la última emoción registrada
- **Separador:** Línea "o escríbelo" con opacity 0.3

### Screen 2 — Tu Espacio
- **Fondo:** Gradiente radial animado del color de emoción dominante con opacidad 0.12
- **Burbujas:** Tamaño entre 60px y 140px según intensidad de audio. Flotan con física suave (Reanimated spring)
- **Barra de Densidad:** Barra horizontal en la parte inferior, relleno con gradiente del color de emoción dominante, animación `withTiming` al agregar nuevas burbujas

### Screen 3 — El Debrief
- **Transición de entrada:** CrossFade con escala desde 0.95 a 1.0 + cambio de tema a Dark Turquesa
- **Tarjetas Re-Frame:** GlassCard con borde `--debrief-accent` y texto en JetBrains Mono
- **Botón "Reload":** Ícono de refresh con animación de rotación 360° al tap
- **CTA "Procesar Materia":** Botón full-width, altura 64px, gradiente de `#00D2C8` a `#00F0E4`, texto Bold 18px

### Screen 4 — El Reflejo
- **Mapa de calor:** Grid 7×24 (días × horas), celdas coloreadas según emoción dominante de ese slot
- **Gráfico fluido:** SVG path animado con `react-native-svg` + Reanimated para transición fluida entre semanas
