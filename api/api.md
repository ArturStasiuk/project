# API – dokumentacja struktury i zasad rozbudowy

## Struktura katalogów

```
api/
├── autoload.php          # PSR-4 autoloader – ładuje klasy automatycznie
├── config.php            # Konfiguracja bazy danych (credentiale / zmienne środowiskowe)
├── index.php             # Punkt wejścia API (entry point) – wszystkie requesty POST
├── api.js                # Klient JavaScript – wysyła żądania POST do index.php
├── api.md                # Ten plik – dokumentacja
│
├── connect/              # Namespace App\Connect
│   ├── Connection.php    # Połączenie z MySQL (PDO-friendly wrapper na mysqli)
│   ├── Session.php       # Zarządzanie sesją PHP
│   └── Router.php        # Router – odwzorowuje "function" z JSON-a na metodę prywatną
│
├── database/             # Namespace App\Database
│   ├── Access.php        # Uprawnienia modułów dla użytkowników (tabela acess)
│   ├── Table.php         # Metadane tabel bazy danych
│   └── Users.php         # Logowanie, wylogowanie, rejestracja użytkowników
│
└── sys/                  # Namespace App\Sys
    ├── ModuleLoader.php  # Ładowanie i proxy plików JS modułów
    └── module_loader.php # Endpoint GET: /api/sys/module_loader.php?file=...
```

---

## Co zostało zmienione

| Stary plik | Nowy plik | Zmiany |
|---|---|---|
| `conect/conect.php` (klasa `CONECT`) | `connect/Connection.php` (klasa `App\Connect\Connection`) | Poprawka literówki, namespace, config z `config.php` |
| `conect/session.php` (klasa `SESSION`) | `connect/Session.php` (klasa `App\Connect\Session`) | Namespace, ochrona przed podwójnym `session_start()` |
| `conect/router.php` (klasa `ROUTER`) | `connect/Router.php` + `index.php` | Namespace, autoloader zamiast ręcznych `require_once`, wydzielony entry point |
| `dataBase/acess.php` (klasa `ACESS`) | `database/Access.php` (klasa `App\Database\Access`) | Poprawka literówek, namespace |
| `dataBase/table.php` (klasa `TABLE`) | `database/Table.php` (klasa `App\Database\Table`) | Namespace, naprawa SQL injection (`DESCRIBE $tableName` → `information_schema`) |
| `dataBase/users.php` (klasa `USERS`) | `database/Users.php` (klasa `App\Database\Users`) | Namespace, naprawa SQL injection (prepared statements), naprawa weryfikacji hasła (`===` → `password_verify()`) |
| `sys/module_loader.php` (funkcja globalna) | `sys/ModuleLoader.php` (klasa `App\Sys\ModuleLoader`) + uproszczony `sys/module_loader.php` | Klasa z metodami, proxy oddzielony od logiki |

### Kluczowe poprawki bezpieczeństwa

1. **SQL Injection** – `Users::loginUsers` i `Table::getTableMeta` używały interpolacji stringów. Zastąpione prepared statements.
2. **Weryfikacja hasła** – `loginUsers` porównywało hash z czystym tekstem (`===`). Naprawione na `password_verify()`.
3. **Wyświetlanie błędów** – `display_errors` wyłączone w `index.php` (błędy idą do logu, nie do klienta).

> **Uwaga dla istniejących kont:** Jeśli w bazie danych były konta z hasłami w postaci czystego tekstu (ze starej wersji), logowanie nie zadziała dopóki hasła nie zostaną ponownie zahashowane. Można to zrobić jednorazowym skryptem migracyjnym.

---

## Jak działa autoloader

Plik `api/autoload.php` rejestruje autoloader PSR-4:

- Namespace `App\` jest mapowany na katalog `api/`
- `App\Connect\Router` → `api/connect/Router.php`
- `App\Database\Users` → `api/database/Users.php`
- `App\Sys\ModuleLoader` → `api/sys/ModuleLoader.php`

**Nie trzeba nic zmieniać w autoloaderze** – wystarczy stworzyć plik w odpowiednim miejscu z właściwym namespace.

---

## Jak dodać nową klasę

1. Zdecyduj, do którego katalogu należy klasa:
   - `connect/` – infrastruktura (połączenia, sesje, routing)
   - `database/` – operacje na tabelach bazy danych
   - `sys/` – narzędzia systemowe
   - Możesz też stworzyć nowy katalog, np. `api/mail/`

2. Utwórz plik, np. `api/database/Orders.php`:

```php
<?php

namespace App\Database;

class Orders
{
    public function getAll(\mysqli $conn): array
    {
        // implementacja
    }
}
```

3. Klasa jest dostępna natychmiast – autoloader ją załaduje przy pierwszym użyciu:

```php
use App\Database\Orders;

$orders = new Orders();
$result = $orders->getAll($this->conn);
```

---

## Jak dodać nowy endpoint w routerze

Otwórz `api/connect/Router.php` i dodaj prywatną metodę:

```php
/** Pobierz wszystkie zamówienia użytkownika. */
private function getOrders(): array
{
    if (!$this->session->getKey('logIn')) {
        return ['status' => false, 'error' => 'Unauthorized'];
    }
    $orders = new \App\Database\Orders();
    return $orders->getAll($this->conn);
}
```

Następnie wywołaj z JavaScript:

```javascript
const result = await api.crud({ function: 'getOrders' });
```

Router automatycznie znajdzie metodę `getOrders()` przez `method_exists()`.

---

## Jak dodać nowy katalog i namespace

1. Utwórz katalog, np. `api/mail/`
2. Utwórz klasę z namespace `App\Mail`, np. `api/mail/Mailer.php`:

```php
<?php

namespace App\Mail;

class Mailer
{
    public function send(string $to, string $subject, string $body): bool
    {
        // implementacja
    }
}
```

3. Autoloader załaduje klasę automatycznie przy `use App\Mail\Mailer` lub `new \App\Mail\Mailer()`.

---

## Jak używać API z JavaScript

Plik `api/api.js` eksportuje singleton `api`. Wyślij żądanie POST:

```javascript
import api from '../api/api.js';

// Wywołanie endpointu bez danych
const loginStatus = await api.crud({ function: 'isLoggedIn' });

// Wywołanie z danymi
const result = await api.crud({
    function: 'loginUsers',
    data: { email: 'user@example.com', password: 'haslo123' }
});

if (result.status) {
    console.log('Zalogowano:', result.data);
}
```

---

## Konwencje nazewnictwa

| Element | Konwencja | Przykład |
|---|---|---|
| Namespace | `App\<KatalogPascalCase>` | `App\Database` |
| Nazwa klasy | PascalCase | `ModuleLoader` |
| Nazwa pliku | Identyczna z klasą + `.php` | `ModuleLoader.php` |
| Nazwa katalogu | lowercase | `database/`, `connect/` |
| Metody prywatne (endpointy) | camelCase | `loginUsers`, `getOrders` |
| Wywołanie z JS | identyczne z metodą | `{ function: 'loginUsers' }` |
