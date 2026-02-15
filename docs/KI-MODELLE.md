# KI-Modelle & Sprachverarbeitung

## Übersicht
Diese Dokumentation enthält alle Informationen zu den KI-Modellen, Sprachverarbeitung (TTS/STT) und APIs, die im Smart Assistant verwendet werden können.

---

## 1. KI-Anbieter & Modelle

### 1.1 Cerebras API

Cerebras bietet ultraschnelle Inference mit bis zu 3.000 Tokens/Sekunde. Alle Modelle unterstützen OpenAI-kompatible APIs.

#### Verfügbare Modelle (Stand: 2026)

| Modell | Kontextfenster | Besonderheit | Tool Calling |
|--------|---------------|--------------|--------------|
| **GLM-4.7** | 128K | 1.000 tokens/sec, Top Tool Calling (BFCL #1) | ✅ |
| **GLM-4.6** | 128K | 1.000 tokens/sec, beste Tool-Calling-Rangliste | ✅ |
| **GPT-OSS-120B** | 128K | 3.000 tokens/sec, Frontier Reasoning | ✅ |
| **Llama 4 Scout** | 128K | 2.600+ tokens/sec | ✅ |
| **Llama 4 Maverick** | 128K | 2.000+ tokens/sec | ✅ |
| **Llama 3.3-70B** | 128K | Ausgewogenes Verhältnis Speed/Qualität | ✅ |
| **Qwen3-235B Thinking** | 128K | Reasoning-Modell | ✅ |
| **Qwen3-32B** | 64K | Coding-optimiert | ✅ |
| **DeepSeek R1 Llama 70B** | 128K | 1.500 tokens/sec | ✅ |

#### API-Endpunkt
```
Base URL: https://api.cerebras.ai/v1
Model Format: llama-3.3-70b, glm-4.7, etc.
```

#### Empfehlung für Smart Assistant
- **Standard**: GLM-4.7 (beste Tool-Calling-Fähigkeit, sehr schnelle Antworten)
- **Alternative**: Llama 3.3-70b (ausgewogenes Verhältnis)

---

### 1.2 NVIDIA NIM API

NVIDIA bietet Modelle über NIM (NVIDIA Inference Microservices) mit Tool-Calling-Support.

#### Unterstützte Modelle mit Tool Calling

| Modell | Kontextfenster | Tool Calling | Detailed Thinking |
|--------|---------------|--------------|-------------------|
| **Llama Nemotron Ultra** | 128K | ✅ | ✅ |
| **Llama Nemotron Super** | 128K | ✅ | ✅ |
| **Llama Nemotron Nano** | 128K | ✅ | ✅ |
| **Llama 3.3 70B** | 128K | ✅ | ❌ |
| **Llama 3.2 Series** | 128K | ✅ | ❌ |
| **Llama 3.1 Series** | 128K | ✅ | ❌ |
| **Mistral Large 3** | 128K | ✅ | ❌ |
| **Mistral Small 3.2** | 128K | ✅ | ❌ |
| **GPT-OSS-120B** | 128K | ✅ | ✅ |
| **GPT-OSS-20B** | 128K | ✅ | ❌ |

#### Tool Calling Features
- `tool_choice`: "none", "auto", oder benanntes Tool
- `tools`: JSON-Schema für Funktionen
- Parallel Tool Calls für ausgewählte Modelle

#### API-Endpunkt
```
Base URL: https://integrate.api.nvidia.com/v1 (oder eigene NIM-Instanz)
```

---

### 1.3 Modell-Vergleich für Smart Assistant

| Kriterium | Cerebras GLM-4.7 | NVIDIA Llama Nemotron Ultra |
|-----------|------------------|----------------------------|
| **Speed** | ~1.000 tokens/sec | ~200-400 tokens/sec |
| **Tool Calling** | #1 auf BFCL | Sehr gut |
| **Preis** | Günstiger (pay-as-you-go) | NIM-basiert |
| **Empfehlung** | ✅ Standard | Alternative |

---

## 2. Text-to-Speech (TTS)

### 2.1 Web Speech API (Browser-basiert)

**Beschreibung**: Integrierte Browser-API für TTS, keine externe Verbindung erforderlich.

#### Eigenschaften
- **Sprachen**: Unterstützt viele Sprachen, inkl. Deutsch (de-DE)
- **Latenz**: Instant (lokal)
- **Qualität**: OS-abhängig (variiert stark)
- **Offline**: ✅ Ja

#### Deutsche Stimmen (Beispiel)
```javascript
const synth = window.speechSynthesis;
const voices = synth.getVoices();
// Suche deutsche Stimme:
const germanVoice = voices.find(v => v.lang.includes('de'));
```

#### Einstellungsoptionen
- **Sprache**: de-DE, de-AT, de-CH
- **Rate**: 0.1 - 10 (Standard: 1)
- **Pitch**: 0 - 2 (Standard: 1)
- **Volume**: 0 - 1 (Standard: 1)
- **Stimme**: Systemabhängig

#### Kompatibilität
| Browser | Support |
|---------|---------|
| Chrome | ✅ 33+ |
| Firefox | ✅ 49+ |
| Safari | ✅ 7+ |
| Edge | ✅ 14+ |
| Samsung Internet | ✅ 4+ |

---

### 2.2 Coqui TTS (XTTS-v2)

**Beschreibung**: Open-Source TTS mit Voice-Cloning-Fähigkeit. Das Unternehmen wurde 2024 geschlossen, aber das Projekt lebt als Open-Source weiter.

#### Eigenschaften
- **Sprachen**: 17 Sprachen inkl. Deutsch
- **Qualität**: MOS 3.7 für Deutsch (gut)
- **Voice Cloning**: 6-Sekunden-Audio genügt
- **Sample Rate**: 24kHz

#### Unterstützte Sprachen
English, Spanish, French, German, Italian, Portuguese, Polish, Turkish, Russian, Dutch, Czech, Arabic, Chinese, Japanese, Hungarian, Korean, Hindi

#### Limitationen
- **Lizenz**: Nur nicht-kommerzielle Nutzung (Coqui Public Model License)
- **Lokale Ausführung**: Benötigt starke GPU (nicht für Mobile geeignet)
- **Für PWA**: Nicht direkt nutzbar - würde Server benötigen

#### Alternative für Mobile PWA
Da XTTS-v2 nicht direkt im Browser läuft, folgende Optionen:
1. **Coqui TTS als Web-Service** (externer Server)
2. **MeloTTS** - Similar quality, Apache Lizenz
3. **Browser-basierte Alternativen** (siehe Web Speech API)

---

### 2.3 Weitere TTS-Optionen

| Modell | Sprache | Qualität | Lizenz | Für PWA geeignet |
|--------|---------|----------|--------|------------------|
| **MeloTTS** | 100+ | Hoch | Apache 2.0 | ❌ (Server) |
| **Chatterbox** | Englisch | Hoch | Resemble AI | ❌ (Server) |
| **Piper TTS** | 50+ | Mittel | Apache 2.0 | ❌ (Lokal, aber kein Browser) |
| **F5-TTS** | Mehrsprachig | Hoch | Apache 2.0 | ❌ (Server) |

---

## 3. Speech-to-Text (STT)

### 3.1 Web Speech API (SpeechRecognition)

**Beschreibung**: Browser-integrierte Spracherkennung.

#### Eigenschaften
- **Sprachen**: Viele Sprachen inkl. Deutsch
- **Latenz**: Instant (Cloud-basiert oder lokal)
- **Qualität**: Mittel (nie so gut wie dedizierte STT)
- **Offline**: Teilweise (Chrome mit Language Pack)

#### Deutsche Erkennung
```javascript
const recognition = new SpeechRecognition() || new webkitSpeechRecognition();
recognition.lang = 'de-DE';
recognition.continuous = false;
recognition.interimResults = true;
```

#### Einstellungsoptionen
- **Sprache**: de-DE, de-AT, de-CH
- **Continuous**: true/false
- **InterimResults**: true/false
- **MaxAlternatives**: 1-10

#### Kompatibilität
| Browser | Support |
|---------|---------|
| Chrome | ✅ (Prefix: webkitSpeechRecognition) |
| Edge | ✅ |
| Safari | ✅ (ab Version 14.1) |
| Firefox | ❌ (nicht unterstützt) |
| Samsung Internet | ✅ |

---

### 3.2 STT-Alternativen (für zukünftige Erweiterungen)

| Anbieter | Modell | Sprache | API | Qualität |
|----------|--------|--------|-----|----------|
| **Whisper (OpenAI)** | whisper-1 | 100+ | ✅ | Sehr hoch |
| **NVIDIA NIM** | Paraformer | Mehrsprachig | ✅ | Hoch |
| **Cerebras** | STT-Modell | Limited | ❌ | - |
| **Deepgram** | Nova-2 | 100+ | ✅ | Sehr hoch |
| **AssemblyAI** | Universal-1 | 100+ | ✅ | Sehr hoch |

---

## 4. Einstellungen (Settings) Struktur

### 4.1 KI-Provider Einstellungen

```json
{
  "defaultProvider": "cerebras",
  "cerebras": {
    "apiKey": "",
    "defaultModel": "glm-4.7"
  },
  "nvidia": {
    "apiKey": "",
    "defaultModel": "meta/llama-3.3-70b-instruct"
  }
}
```

### 4.2 TTS-Einstellungen

```json
{
  "tts": {
    "provider": "webspeech", // oder "external"
    "webspeech": {
      "language": "de-DE",
      "rate": 1.0,
      "pitch": 1.0,
      "volume": 1.0,
      "voice": "auto"
    },
    "external": {
      "url": "",
      "apiKey": ""
    }
  }
}
```

### 4.3 STT-Einstellungen

```json
{
  "stt": {
    "provider": "webspeech",
    "language": "de-DE",
    "continuous": false,
    "interimResults": true
  }
}
```

---

## 5. API-Key Verwaltung

### 5.1 Cerebras API Key
- **Website**: https://cerebras.ai/inference
- **Key-Typ**: Bearer Token
- **Speicherung**: IndexedDB (verschlüsselt empfohlen)

### 5.2 NVIDIA API Key
- **Website**: https://build.nvidia.com/
- **Key-Typ**: Bearer Token
- **NIM-Deployment**: Local oder Cloud

---

## 6. Zusammenfassung

### Empfohlene Konfiguration für MVP

| Komponente | Option | Begründung |
|------------|--------|------------|
| **KI-Provider** | Cerebras | Schnellste Inference, beste Tool-Calling |
| **KI-Modell** | GLM-4.7 | Top BFCL-Ranking, 128K Context |
| **TTS** | Web Speech API | Offline-fähig, keine externen Calls |
| **STT** | Web Speech API | Browser-integriert, Deutsch-Support |
| **Sprache** | de-DE | Deutsche Lokalisierung |

---

## 7. Einstellungen Detail

### 7.1 Vollständige Settings-Struktur

```json
{
  "general": {
    "triggerWord": "HeyAssistent",
    "wakeWordEnabled": true,
    "wakeWordSensitivity": 0.5,
    "autoSpeak": true,
    "language": "de-DE"
  },
  "personality": {
    "systemPrompt": "",
    "userInfo": "",
    "customInstructions": ""
  },
  "providers": {
    "defaultProvider": "cerebras",
    "cerebras": {
      "apiKey": "",
      "defaultModel": "glm-4.7"
    },
    "nvidia": {
      "apiKey": "",
      "defaultModel": "meta/llama-3.3-70b-instruct"
    }
  },
  "tts": {
    "provider": "webspeech",
    "webspeech": {
      "language": "de-DE",
      "rate": 1.0,
      "pitch": 1.0,
      "volume": 1.0,
      "voice": "auto"
    }
  },
  "stt": {
    "provider": "webspeech",
    "language": "de-DE",
    "continuous": false,
    "interimResults": true
  }
}
```

### 7.2 Standard-System-Prompt

```
Du bist ein freundlicher und hilfreicher KI-Assistent. 
Antworte kurz und prägnant. 
Versuche den Benutzer kennenzulernen und merke dir wichtige Informationen über ihn.
Sei natürlich und conversationell.
```

---

## 8. Chat-Historie (IndexedDB)

- **Datenbank-Name**: smart-assistent-db
- **Object Store**: chat-history
- **Maximale Einträge**: 25 Nachrichten (älteste werden automatisch gelöscht)
- **Datenstruktur**:
  ```json
  {
    "id": "timestamp-uuid",
    "role": "user" | "assistant",
    "content": "Nachrichtentext",
    "timestamp": 1234567890
  }
  ```

---

## 9. PWA-Konfiguration

### 9.1 Manifest (manifest.json)
- **Name**: Smart Assistent
- **Kurzname**: Assistent
- **Theme Color**: #000000
- **Background Color**: #000000
- **Display**: fullscreen
- **Orientation**: landscape

### 9.2 Service Worker
- **Caching**: Statische Assets (index.html, CSS, JS)
- **Offline-Fallback**: Grund-UI funktioniert offline

---

## 10. Zukünftige Erweiterungen

- [ ] Coqui TTS (XTTS-v2) via externem Server
- [ ] Whisper für bessere STT-Qualität
- [ ] Tool Calling Implementation
- [ ] Mehrere Stimmen für TTS auswählbar
- [ ] Voice Activity Detection (VAD) für Wake Word
