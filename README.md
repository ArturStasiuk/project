# myAppProject – Dokumentacja architektury

## Spis treści
1. [Struktura projektu](#struktura-projektu)
2. [Backend PHP (API)](#backend-php-api)
3. [Frontend JavaScript](#frontend-javascript)
4. [Jak to działa (przepływ danych)](#jak-to-działa-przepływ-danych)
5. [Konfiguracja środowiska](#konfiguracja-środowiska)
6. [Dodawanie nowych modułów](#dodawanie-nowych-modułów)
7. [Dodawanie nowych narzędzi](#dodawanie-nowych-narzędzi)

---

## Struktura projektu

```
project/
├── api/                        # Backend PHP
│   ├── src/                    # Kod źródłowy (PSR-4, namespace App\)
│   │   ├── Config/
│   │   │   └── ConfigDb.php        # Konfiguracja bazy danych (z .env)
│   │   ├── Connect/
│   │   │   └── Connect.php         # Połączenie PDO z bazą
│   │   ├── Database/               # Repozytoria tabel bazy danych
│   │   │   ├── AccessTables.php
│   │   │   ├── AccessTools.php
│   │   │   ├── Company.php
│   │   │   ├── CompanyUsers.php
│   │   │   ├── Tables.php
│   │   │   └── Users.php
│   │   ├── Service/                # Usługi pomocnicze
│   │   │   ├── Session.php         # Zarządzanie sesją PHP
│   │   │   └── Tools.php           # Skanowanie narzędzi JS
│   │   ├── Modules/                # Moduły API (logika biznesowa)
│   │   │   ├── User.php            # Logowanie / rejestracja / wylogowanie
│   │   │   └── ModulesCompany.php  # Operacje na danych firm
│   │   └── Core/                   # Rdzeń routera
│   │       ├── Router.php          # Główny kontroler żądań HTTP
│   │       ├── Method.php          # Metody globalne API (bez modułu)
│   │       └── ModuleBuilder.php   # Fabryka zależności (DI)
│   ├── index.php               # Punkt wejścia HTTP (entry point)
│   ├── tools_loader.php        # Serwowanie prywatnych plików JS
│   ├── api.js                  # Klient API (JavaScript)
│   ├── composer.json           # Definicja zależności PHP
│   ├── .env                    # Zmienne środowiskowe (NIE commitować!)
│   └── .env.example            # Przykładowy plik .env
│
├── public/                     # Frontend (HTML/JS/CSS)
│   ├── index.php               # Główna strona aplikacji
│   ├── css/                    # Arkusze stylów
│   ├── sys/                    # System JavaScript
│   │   ├── sys.js              # Główna klasa SYS (init, ładowanie narzędzi)
│   │   ├── conf.js             # Konfiguracja okien (menu, login, logout)
│   │   ├── func.js             # Funkcje UI (show/hide okien)
│   │   ├── handlers.js         # Universalne handlery zdarzeń
│   │   └── launge.js           # Tłumaczenia (i18n)
│   ├── view/                   # Komponenty widoku
│   │   ├── app.js              # Zarządzanie oknami (desktop UI)
│   │   └── modal.js            # Modale (alert, confirm, loading, prompt)
│   └── tools/                  # Publiczne narzędzia JS
│       └── notepad/            # Przykładowe narzędzie – Notatnik
│
└── private/                    # Prywatne narzędzia (tylko dla zalogowanych)
    └── tools/
        └── [nazwa_narzedzia]/
            └── [nazwa_narzedzia].js
```

---

## Backend PHP (API)

### Autoładowanie (Composer PSR-4)

Backend używa **Composer** z konfiguracją PSR-4. Wszystkie klasy w katalogu `src/`
są ładowane automatycznie – **nie ma żadnych ręcznych `require`/`include`** poza
jednym wpisem w `index.php`:

```php
require_once __DIR__ . '/vendor/autoload.php';
```

Namespace bazowy to `App\`, mapowany na `api/src/`:

```json
"autoload": {
    "psr-4": {
        "App\\": "src/"
    }
}
```

### Punkt wejścia: `api/index.php`

Wszystkie żądania HTTP POST trafiają do `api/index.php`, który:
1. Ładuje autoloader Composera.
2. Wczytuje zmienne środowiskowe z `.env` (przez `vlucas/phpdotenv`).
3. Tworzy instancję `Router` i wywołuje `handleRequest()`.

### Router (`App\Core\Router`)

Odbiera JSON z żądania POST i kieruje wywołanie:

| Żądanie zawiera       | Obsługa                                       |
|-----------------------|-----------------------------------------------|
| `modules` + `method`  | `ModuleBuilder` buduje zależności, tworzy moduł, wywołuje metodę |
| tylko `method`        | `Method::call()` wywołuje metodę globalną     |
| nic                   | Odpowiedź informacyjna `no module specified`  |

### Zależności (Dependency Injection)

`ModuleBuilder` buduje zależności dla każdego modułu z osobna.
Każdy moduł otrzymuje gotowe instancje przez konstruktor – **nie tworzy ich samodzielnie**.

Przykład dla modułu `user`:
```
Router → ModuleBuilder::build('user') → [pdo, session, users, …] → new User(...$deps, $param)
```

---

## Frontend JavaScript

### Komunikacja z API: `api/api.js`

```js
import api from '../api/api.js';

// Wywołanie metody globalnej
const { loggedIn } = await api.send({ method: 'checkLoggedIn' });

// Wywołanie metody modułu
const result = await api.send({
    modules: 'user',
    method:  'loginUsers',
    param:   { email, password }
});
```

Każde żądanie jest wykonywane jako HTTP POST na `api/index.php`.

### Import map (`public/index.php`)

Aby uniknąć ścieżek względnych w modułach ładowanych przez Blob URL,
`index.php` definiuje `importmap`:

```html
<script type="importmap">
{
    "imports": {
        "modal":    "./view/modal.js",
        "view":     "./view/app.js",
        "api":      "../api/api.js",
        "handlers": "./sys/handlers.js"
    }
}
</script>
```

Dzięki temu narzędzia prywatne mogą importować `modal`, `api` itp. bez względu na kontekst Blob URL.

### Ładowanie narzędzi (`SYS`)

Klasa `SYS` (`public/sys/sys.js`) automatycznie ładuje narzędzia:
- **Publiczne** – jako `<script type="module">` bezpośrednio z serwera.
- **Prywatne** – pobierane przez API (`getPrivateToolContent`), wstrzykiwane jako Blob URL.

---

## Jak to działa (przepływ danych)

```
Przeglądarka
    │
    ├─ GET /public/index.php           → Ładuje HTML + JS (sys.js, modal.js itp.)
    │
    └─ POST /api/index.php             → Żądania API (JSON)
           │
           ├─ Router::handleRequest()
           │       │
           │       ├─ modules = null  → Method::call(methodName, param)
           │       │                         np. checkLoggedIn(), getAllTools()
           │       │
           │       └─ modules = 'user' → ModuleBuilder::build('user')
           │                              → new User($pdo, $session, …, $param)
           │                              → User::loginUsers()
           │
           └─ JSON response
```

---

## Konfiguracja środowiska

1. **Skopiuj plik `.env.example` do `.env`** w katalogu `api/`:
   ```bash
   cp api/.env.example api/.env
   ```

2. **Uzupełnij dane w `.env`**:
   ```env
   APP_ENV=development
   DB_HOST=localhost
   DB_USER=twoj_uzytkownik
   DB_PASSWORD=twoje_haslo
   DB_NAME=project
   ```

3. **Zainstaluj zależności PHP** (jeśli `vendor/` nie istnieje):
   ```bash
   cd api && composer install
   ```

> **Uwaga bezpieczeństwa:** Plik `.env` jest w `.gitignore` – nigdy nie commituj go do repozytorium.

---

## Dodawanie nowych modułów

### 1. Utwórz klasę modułu

Utwórz plik `api/src/Modules/MojModul.php`:

```php
<?php
declare(strict_types=1);
namespace App\Modules;

class MojModul
{
    public function __construct(
        private readonly \PDO $pdo,
        private readonly mixed $param
    ) {}

    public function mojaDziałanie(): array
    {
        // logika...
        return ['status' => true, 'data' => []];
    }
}
```

### 2. Zarejestruj moduł w Router

W `api/src/Core/Router.php` dodaj wpis do `MODULE_MAP`:

```php
private const MODULE_MAP = [
    'user'            => User::class,
    'modules_company' => ModulesCompany::class,
    'moj_modul'       => MojModul::class,   // ← nowy
];
```

### 3. Dodaj zależności w ModuleBuilder

W `api/src/Core/ModuleBuilder.php` dodaj prywatną metodę:

```php
private function moj_modul(): array
{
    $config  = new ConfigDb();
    $connect = new Connect();
    return [
        'pdo' => $connect->connect($config->getConfig()),
    ];
}
```

### 4. Wywołaj z JavaScript

```js
const result = await api.send({
    modules: 'moj_modul',
    method:  'mojaDziałanie',
    param:   { klucz: 'wartość' }
});
```

---

## Dodawanie nowych narzędzi

### Narzędzie publiczne

1. Utwórz katalog `public/tools/moje_narzedzie/`.
2. Dodaj plik `moje_narzedzie.js` jako ES module.
3. Narzędzie zostanie automatycznie wykryte i załadowane przez `SYS`.

### Narzędzie prywatne

1. Utwórz katalog `private/tools/moje_narzedzie/`.
2. Dodaj plik `moje_narzedzie.js`.
3. W bazie danych przyznaj dostęp użytkownikowi w tabeli `access_tools`
   (kolumna `tools_name = 'moje_narzedzie'`, `access_tools = 1`).
4. Narzędzie zostanie załadowane przez SYS po zalogowaniu, przez Blob URL.
