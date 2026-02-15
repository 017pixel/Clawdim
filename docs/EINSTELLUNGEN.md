# Einstellungen - Smart Assistent

## Übersicht
Diese Dokumentation beschreibt alle Einstellungsmöglichkeiten des Smart Assistants.

---

## 1. Allgemeine Einstellungen (General)

| Einstellung | Typ | Standard | Beschreibung |
|-------------|-----|----------|--------------|
| `triggerWord` | String | "HeyAssistent" | Wake Word zum Aktivieren des Assistants |
| `wakeWordEnabled` | Boolean | true | Wake Word aktivieren/deaktivieren |
| `wakeWordSensitivity` | Number | 0.5 | Sensitivität der Spracherkennung (0.1 - 1.0) |
| `autoSpeak` | Boolean | true | Automatische Sprachausgabe nach KI-Antwort |
| `language` | String | "de-DE" | Sprache für STT und TTS |

---

## 2. Persönlichkeit (Personality)

### 2.1 System Prompt
- **Feld**: `systemPrompt`
- **Typ**: Textarea (mehrzeilig)
- **Standard**: (leer - wird durch Standard-Prompt ersetzt)
- **Beschreibung**: Der System-Prompt definiert, wie sich der KI-Assistent verhält.

### 2.2 Benutzer-Info
- **Feld**: `userInfo`
- **Typ**: Textarea
- **Standard**: (leer)
- **Beschreibung**: Informationen über den Benutzer, die der Assistent wissen soll.
- **Beispiel**:
  ```
  Name: Max
  Alter: 25
  Beruf: Softwareentwickler
  Hobbys: Programmieren, Gaming
  ```

### 2.3 Benutzerdefinierte Anweisungen
- **Feld**: `customInstructions`
- **Typ**: Textarea
- **Standard**: (leer)
- **Beschreibung**: Spezifische Anweisungen für den Assistenten.
- **Beispiel**:
  ```
  - Antworte immer in kurzen Sätzen
  - Verwende keine Fachbegriffe
  - Sei humorvoll
  ```

### 2.4 Standard-System-Prompt (wenn leer)
```
Du bist ein freundlicher und hilfreicher KI-Assistent. 
Antworte kurz und prägnant. 
Versuche den Benutzer kennenzulernen und merke dir wichtige Informationen über ihn.
Sei natürlich und conversationell.
```

---

## 3. KI-Provider

### 3.1 Standard-Provider
- **Feld**: `defaultProvider`
- **Typ**: Select
- **Optionen**: "cerebras", "nvidia"
- **Standard**: "cerebras"

### 3.2 Cerebras Einstellungen
| Einstellung | Typ | Standard | Beschreibung |
|-------------|-----|----------|--------------|
| `apiKey` | String | "" | Cerebras API Key |
| `defaultModel` | Select | "glm-4.7" | Standard-Modell |

#### Verfügbare Modelle:
- `glm-4.7` (Empfohlen - beste Tool-Calling)
- `glm-4.6`
- `llama-3.3-70b`
- `llama-4-scout`
- `llama-4-maverick`
- `qwen3-235b-thinking`

### 3.3 NVIDIA Einstellungen
| Einstellung | Typ | Standard | Beschreibung |
|-------------|-----|----------|--------------|
| `apiKey` | String | "" | NVIDIA API Key |
| `defaultModel` | Select | "meta/llama-3.3-70b-instruct" | Standard-Modell |

#### Verfügbare Modelle:
- `meta/llama-nemotron-ultra-4b-instruct` (Empfohlen)
- `meta/llama-nemotron-super-4b-instruct`
- `meta/llama-nemotron-nano-4b-instruct`
- `meta/llama-3.3-70b-instruct`
- `meta/llama-3.2-90b-vision-instruct`
- `mistralai/mistral-large-3-instruct`
- `mistralai/mistral-small-3.2-2506-instruct`

---

## 4. Sprachausgabe (TTS)

### 4.1 Anbieter
- **Feld**: `tts.provider`
- **Typ**: Select
- **Optionen**: "webspeech", "external"
- **Standard**: "webspeech"

### 4.2 Web Speech API Einstellungen

| Einstellung | Typ | Standard | Bereich |
|-------------|-----|----------|---------|
| `tts.webspeech.language` | Select | "de-DE" | de-DE, de-AT, de-CH |
| `tts.webspeech.rate` | Number | 1.0 | 0.1 - 10 |
| `tts.webspeech.pitch` | Number | 1.0 | 0 - 2 |
| `tts.webspeech.volume` | Number | 1.0 | 0 - 1 |
| `tts.webspeech.voice` | String | "auto" | auto oder Voice-Name |

### 4.3 Externe TTS (zukünftig)
| Einstellung | Typ | Standard | Beschreibung |
|-------------|-----|----------|--------------|
| `tts.external.url` | String | "" | API-URL |
| `tts.external.apiKey` | String | "" | API-Key |

---

## 5. Spracherkennung (STT)

### 5.1 Anbieter
- **Feld**: `stt.provider`
- **Typ**: Select
- **Optionen**: "webspeech"
- **Standard**: "webspeech"

### 5.2 Web Speech API Einstellungen

| Einstellung | Typ | Standard | Beschreibung |
|-------------|-----|----------|--------------|
| `stt.language` | Select | "de-DE" | Erkennungssprache |
| `stt.continuous` | Boolean | false | Fortlaufende Erkennung |
| `stt.interimResults` | Boolean | true | Vorläufige Ergebnisse anzeigen |
| `stt.maxAlternatives` | Number | 1 | Maximale Alternativen |

---

## 6. Vollständiges Einstellungs-JSON

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
      "defaultModel": "meta/llama-nemotron-ultra-4b-instruct"
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
    "interimResults": true,
    "maxAlternatives": 1
  }
}
```

---

## 7. Speicherung

- **Speicherort**: IndexedDB
- **Datenbank**: smart-assistent-db
- **Object Store**: settings
- **Key**: "user-settings"
