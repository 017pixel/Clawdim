# Clawdim - Smart Assistant

Ein KI-gestützter persönlicher Assistent als Progressive Web App (PWA), optimiert für OLED-Screens im Querformat.

## Features

- **Dynamische Augen-Animation**: Zwei abstrakte Augen mit Glow-Effekt, die sich natürlich bewegen
- **KI-Integration**: Unterstützung für Cerebras und NVIDIA NIM APIs
- **Sprachsteuerung**: Wake Word Erkennung, Speech-to-Text und Text-to-Speech
- **Swipe-Menü**: Von rechts nach links wischen für Navigation
- **Einstellungen**: API-Keys, Persönlichkeit, Sprachausgabe konfigurieren
- **Chat-Historie**: Automatische Speicherung der letzten 25 Nachrichten in IndexedDB

## Installation

1. Repository klonen oder herunterladen
2. API Key in den Einstellungen konfigurieren
3. Als PWA installieren (Browser-Menü: "Zum Startbildschirm hinzufügen")

## Nutzung

### Sprachsteuerung
- **Wake Word**: Sage "HeyAssistent" (standardmäßig) zum Aktivieren
- **Leertaste**: Drücken für manuelle Spracherkennung
- **Escape**: Spracherkennung abbrechen

### Menü
- Von rechts nach links wischen
- Einstellungen, Chat, Verlauf löschen

### Einstellungen
- **Trigger Word**: Eigenes Wake Word festlegen
- **KI-Provider**: Cerebras (empfohlen) oder NVIDIA NIM
- **Persönlichkeit**: System Prompt, Benutzer-Info, Anweisungen
- **Sprachausgabe**: Geschwindigkeit, Tonhöhe, Stimme

## Unterstützte KI-Modelle

### Cerebras (Empfohlen)
- GLM-4.7 (Beste Tool-Calling-Fähigkeit)
- Llama 3.3 70B
- Llama 4 Scout

### NVIDIA NIM
- Llama 3.3 70B
- Nemotron Ultra
- Mistral Large 3

## Technologie-Stack

- HTML5, CSS3, JavaScript (ES6)
- IndexedDB für lokale Speicherung
- Web Speech API (TTS/STT)
- Service Worker für Offline-Fähigkeit
- PWA Manifest

## API Keys

- **Cerebras**: https://cerebras.ai/inference
- **NVIDIA**: https://build.nvidia.com/

## Browser-Kompatibilität

- Chrome/Chromium (empfohlen)
- Edge
- Safari (teilweise)
- Samsung Internet

## Lizenz

MIT License