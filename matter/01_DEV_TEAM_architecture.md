# [DEV TEAM] — Matter: Stack Tecnológico y Arquitectura de Componentes

## Stack Tecnológico Sugerido

### Mobile Core
| Capa | Tecnología | Justificación |
|---|---|---|
| Framework | **React Native + Expo** | Cross-platform (iOS/Android), comunidad enorme, soporte a Reanimated y gestos nativos |
| Lenguaje | **TypeScript** | Tipado estático, indispensable en lógica de Triage emocional |
| Navegación | **React Navigation v7** | Stack + Tab navigation con transiciones personalizadas |
| Estado Global | **Zustand** | Ligero, sin boilerplate; ideal para el estado de burbujas y Triage |
| Persistencia Local | **MMKV + WatermelonDB** | MMKV para prefs/sesión (ultra-rápido); WatermelonDB para historial de inputs/burbujas |

### Animación y Gráficos (Liquid Glass / Fluids)
| Capa | Tecnología | Justificación |
|---|---|---|
| Animaciones táctiles | **React Native Reanimated 3** | Animaciones en el UI thread, 60-120fps sin drops |
| Gestos (Swipe/LongPress) | **React Native Gesture Handler** | Integración directa con Reanimated, soporte haptics |
| Efectos de fluidos | **Three.js (via expo-gl)** | Shaders GLSL para orbes que "respiran" y fluidos interactivos |
| Blur / Glassmorphism | **@react-native-community/blur** | BlurView nativo en iOS/Android para el efecto cristal esmerilado |
| Partículas / Confeti | **react-native-confetti-cannon** + shader custom | POP! con confeti digital + vibración háptica |
| Lottie | **lottie-react-native** | Microanimaciones de onboarding y feedback emocional |

### Backend & AI
| Capa | Tecnología | Justificación |
|---|---|---|
| Backend | **Supabase** (PostgreSQL + Auth + Realtime) | BaaS completo; row-level security para datos de salud mental |
| AI / NLP | **Anthropic Claude API** (claude-sonnet-4-6) | Motor de Triage: clasificación de nivel + generación de Re-Frames |
| STT (Voice Input) | **expo-speech / Whisper API** | Transcripción del Brain-dump de voz en tiempo real |
| Análisis de audio | **librosa (Python microservice)** | Extrae intensidad/pitch para determinar tamaño/color de burbuja |
| Edge Functions | **Supabase Edge Functions (Deno)** | Llamadas a Claude sin exponer API key en el cliente |

### Herramientas de Calidad
- **Jest + React Native Testing Library** — Unit/integration tests
- **Detox** — E2E tests en dispositivo
- **ESLint + Prettier** — Código consistente
- **Sentry** — Monitoreo de errores en producción

---

## Arquitectura de Componentes (Frontend)

```
src/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx             # Screen 1: Lienzo de Descarga (Home)
│   │   ├── space.tsx             # Screen 2: Tu Espacio (Burbujas)
│   │   ├── debrief.tsx           # Screen 3: El Debrief (AI Checkout)
│   │   └── profile.tsx           # Screen 4: El Reflejo (Stats)
│   └── _layout.tsx               # Root layout + ThemeProvider
│
├── components/
│   ├── core/
│   │   ├── GlassCard.tsx         # Tarjeta glassmorphism base (BlurView + border)
│   │   ├── GlowButton.tsx        # Botón con aura animada (Reanimated pulse)
│   │   └── HapticFeedback.ts     # Wrapper de vibración háptica (Expo Haptics)
│   │
│   ├── input/
│   │   ├── VoiceDumpButton.tsx   # Botón micrófono con aura brillante (LongPress)
│   │   ├── TextDumpInput.tsx     # Input de texto expandible (Brain-dump escrito)
│   │   └── AudioWaveform.tsx     # Visualizador de onda de audio en tiempo real
│   │
│   ├── bubbles/
│   │   ├── BubbleCanvas.tsx      # Canvas de Three.js (expo-gl) — ecosistema de burbujas
│   │   ├── BubbleCell.tsx        # Burbuja individual (Liquid Glass + color por emoción)
│   │   ├── BubbleFocusMode.tsx   # Overlay de LongPress con Swipe Up/Down
│   │   ├── BubblePopEffect.tsx   # Animación POP! + confeti + haptic
│   │   └── DensityBar.tsx        # Barra de progreso "Densidad Acumulada"
│   │
│   ├── ai/
│   │   ├── TriageProcessor.ts    # Lógica de clasificación Verde/Amarillo/Rojo
│   │   ├── ReFrameCard.tsx       # Tarjeta de respuesta AI con botón Reload
│   │   ├── CrisisOverlay.tsx     # Pantalla Nivel Rojo (colores neutros + recursos)
│   │   └── ProcessMatterButton.tsx # Botón masivo "Procesar Materia" (POP ALL)
│   │
│   ├── profile/
│   │   ├── CognitiveHeatmap.tsx  # Mapa de calor horario (react-native-svg)
│   │   ├── EmotionFlowChart.tsx  # Gráfico fluido de colores dominantes
│   │   └── ReFrameGallery.tsx    # Galería de tarjetas Re-Frame exitosas
│   │
│   └── theme/
│       ├── ThemeProvider.tsx     # Context: color dinámico según emoción activa
│       ├── colors.ts             # Paleta completa (ver UXUI_TEAM)
│       └── typography.ts         # Tipografías y escalas
│
├── hooks/
│   ├── useTriageLevel.ts         # Determina nivel Verde/Amarillo/Rojo del input
│   ├── useBubblePhysics.ts       # Estado de posición/velocidad de burbujas (Reanimated)
│   ├── useVoiceCapture.ts        # Grabación + transcripción STT
│   └── useEmotionColor.ts        # Mapeo emoción → color hex dinámico
│
├── services/
│   ├── claudeService.ts          # Llamadas a Supabase Edge Function → Claude API
│   ├── audioAnalysisService.ts   # Envía audio al microservicio Python (intensidad/pitch)
│   └── supabaseClient.ts         # Inicialización Supabase
│
└── store/
    ├── bubbleStore.ts            # Zustand: lista de burbujas activas/archivadas
    ├── sessionStore.ts           # Zustand: estado de sesión del usuario
    └── triageStore.ts            # Zustand: nivel actual, historial de Triage
```

---

## Flujo de Datos: Brain-dump → Burbuja

```
[Usuario habla/escribe]
        ↓
useVoiceCapture.ts  →  Transcripción (Whisper API)
        +
audioAnalysisService.ts  →  intensidad (0-1), pitch (Hz)
        ↓
useTriageLevel.ts  →  Llama claudeService.ts con el texto
        ↓
Claude API (Edge Function)  →  { level: 'green'|'yellow'|'red', emotion: string, color: hex }
        ↓
bubbleStore.ts  →  Agrega burbuja con { size, color, text, triageLevel }
        ↓
BubbleCanvas.tsx  →  Renderiza burbuja en el ecosistema Three.js
```

---

## Consideraciones de Seguridad y Privacidad
- Todos los datos sensibles almacenados con **Row-Level Security** en Supabase (solo el usuario propietario puede leerlos).
- El texto de los Brain-dumps **nunca se logea** en servicios de terceros — solo se envía al Edge Function encriptado.
- El Nivel Rojo nunca almacena el contenido del input; solo activa el protocolo de crisis.
- Soporte para **borrado total de cuenta** (GDPR / Ley de Privacidad MX).
