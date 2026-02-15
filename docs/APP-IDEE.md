# Smart Assistant - Projektidee

## Übersicht
Ein als Progressive Web App (PWA) ausgeführter Smart Assistant für ein altes Android-Handy im Querformat.

## Technologie-Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Datenbank**: IndexedDB für lokale Datenspeicherung
- **Konfiguration**: JSON für Einstellungen
- **PWA**: Service Worker für Offline-Fähigkeit

## UI/UX Anforderungen

### Design
- **Hintergrund**: Vollständig schwarz (#000000) für OLED-Optimierung
- **Farbschema**: Dunkel-pastellgrüne Akzentfarben

### Hauptansicht
- Zwei dynamisch animierte Augen in der Bildschirmmitte
- Augen bewegen sich nach links und rechts (neugierig)
- Natürliche, lebendige Bewegungsmuster

### Navigation
- **Swipe-Geste**: Rechts nach Links wischen öffnet Seitenmenü
- **Menü**: 2-3 Buttons für Navigation (Einstellungen, etc.)

## Backend-Integration

### KI-Anbieter
1. **NVIDIA API**
   - Modelle mit hohem Kontextfenster
   - Tool Calling Support
   - Recherche erforderlich

2. **Cerebras API**
   - Modelle mit hohem Kontextfenster
   - Tool Calling Support
   - Recherche erforderlich

### Sprachfunktionen
- **Sprachausgabe**: Lokale Lösung für deutsche Stimmen
- **Ziel**: Natürlich klingende deutsche Stimme ohne externe API

## Funktionalität

### Phase 1 (MVP)
- API Key Eingabe (NVIDIA / Cerebras)
- Basic Chatbot-Funktionalität
- Sprach-Input/Output

### Zukünftige Erweiterungen
- Tool Calling Integration
- Weitere KI-Anbieter
- Erweiterte Einstellungen

## Zielplattform
- Altes Android-Handy
- Querformat-Modus
- Handyhalterung

## Dokumentation
- Projektstruktur wird in separaten Markdown-Dateien geplant
- Jede Komponente erhält eigene Dokumentation
