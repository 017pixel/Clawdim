# Projektstruktur - Smart Assistent

## Übersicht
Die folgende Struktur zeigt alle Dateien und Ordner des Smart Assistant Projekts.

---

## Verzeichnisbaum

```
Smart-Assistent/
├── index.html              # Hauptseite (Single Page App)
├── manifest.json           # PWA Manifest
├── sw.js                   # Service Worker
├── icons/                  # PWA Icons
│   ├── icon-192.png
│   └── icon-512.png
├── docs/                   # Dokumentation
│   ├── APP-IDEE.md
│   ├── KI-MODELLE.md
│   ├── EINSTELLUNGEN.md
│   └── PROJEKTSTRUKTUR.md
├── src/
│   ├── css/                # Stylesheets
│   │   ├── main.css        # Hauptstile
│   │   ├── eyes.css        # Augen-Animationen
│   │   ├── menu.css        # Seitenmenü
│   │   ├── settings.css    # Einstellungsseite
│   │   └── components.css  # Wiederverwendbare Komponenten
│   │
│   ├── js/                 # JavaScript
│   │   ├── app.js          # Hauptanwendung
│   │   ├── eyes.js         # Augen-Controller
│   │   ├── menu.js         # Menü-Handling
│   │   ├── chat.js         # Chat-Funktionalität
│   │   └── settings.js     # Einstellungsseite
│   │
│   ├── components/         # Web Components
│   │   ├── Eyes.js         # Augen-Component
│   │   ├── SideMenu.js     # Seitenmenü-Component
│   │   ├── ChatBubble.js   # Chat-Nachricht
│   │   └── SettingsPanel.js # Einstellungen-Panel
│   │
│   ├── services/           # API-Dienste
│   │   ├── cerebras.js     # Cerebras API Client
│   │   ├── nvidia.js       # NVIDIA NIM API Client
│   │   ├── tts.js          # Text-to-Speech Service
│   │   ├── stt.js          # Speech-to-Text Service
│   │   └── api.js          # API-Manager (Routing)
│   │
│   ├── utils/              # Hilfsfunktionen
│   │   ├── storage.js      # IndexedDB Wrapper
│   │   ├── config.js       # Konfigurationsmanagement
│   │   ├── logger.js       # Logging Utility
│   │   └── helpers.js      # Allgemeine Helfer
│   │
│   └── assets/             # Statische Assets
│       ├── sounds/         # Audio-Dateien
│       └── images/         # Bilder
│
└── README.md               # Projekt-Readme
```

---

## Datei-Beschreibungen

### Hauptdateien (Wurzel)

| Datei | Beschreibung |
|-------|--------------|
| `index.html` | Haupteinstiegspunkt der PWA |
| `manifest.json` | PWA Manifest für Installation |
| `sw.js` | Service Worker für Offline-Fähigkeit |

### CSS (`src/css/`)

| Datei | Beschreibung |
|-------|--------------|
| `main.css` | Globale Stile, Reset, Variablen |
| `eyes.css` | Animationsstile für die Augen |
| `menu.css` | Styling für das Seitenmenü |
| `settings.css` | Einstellungsseiten-Styling |
| `components.css` | Wiederverwendbare UI-Komponenten |

### JavaScript (`src/js/`)

| Datei | Beschreibung |
|-------|--------------|
| `app.js` | Hauptanwendungs-Controller |
| `eyes.js` | Augen-Animation Logik |
| `menu.js` | Swipe- und Menü-Handling |
| `chat.js` | Chat-UI und Nachrichtenverwaltung |
| `settings.js` | Einstellungsseiten-Logik |

### Services (`src/services/`)

| Datei | Beschreibung |
|-------|--------------|
| `cerebras.js` | Cerebras API Client |
| `nvidia.js` | NVIDIA NIM API Client |
| `tts.js` | Text-to-Speech Abstraktion |
| `stt.js` | Speech-to-Text Abstraktion |
| `api.js` | Zentrale API-Routing |

### Utils (`src/utils/`)

| Datei | Beschreibung |
|-------|--------------|
| `storage.js` | IndexedDB Wrapper für alle Speicheroperationen |
| `config.js` | Laden/Speichern der App-Konfiguration |
| `logger.js` | Debug-Logging System |
| `helpers.js` | String-, Array-, DOM-Helfer |

---

## Datenbankstruktur (IndexedDB)

### Datenbank: `smart-assistent-db`

#### Object Store: `chat-history`
```
Key: id (Auto-Inkrement)
Index: timestamp
Max Einträge: 25 (FIFO)
```

#### Object Store: `settings`
```
Key: "user-settings"
Speichert: Vollständiges Einstellungs-JSON
```

---

## PWA Anforderungen

### manifest.json
```json
{
  "name": "Smart Assistent",
  "short_name": "Assistent",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (sw.js)
- Cache static assets
- Offline fallback page
- Background sync (zukünftig)

---

## Build-Prozess (Optional)

Für Produktion kann ein Build-Prozess eingerichtet werden:
- **Bundler**: Vite oder Parcel (empfohlen)
- **Minifizierung**: CSS/JS
- **PWA-Generator**: Workbox

---

## Entwicklung

### IDE Empfehlungen
- VS Code
- WebStorm

### Nützliche Extensions
- Live Server
- PWA Validator
- ES Lint

### Testing
- Chrome DevTools
- Lighthouse (PWA Audit)
