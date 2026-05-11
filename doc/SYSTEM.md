# Dokumentacja projektu (stan na dzień dokumentu)

Krótki opis: aplikacja webowa w stylu „pulpitu” (okna, pasek zadań). Front to **natywne moduły ES** (`import` / `export`). Backend to **PHP + MySQL**; komunikacja przez **jeden endpoint JSON** (`src/api.php`).

---

## 1. Struktura katalogów

| Katalog / plik | Rola |
|----------------|------|
| `public/` | To, co serwuje przeglądarka: `index.php`, CSS, JS (`system`, `view`, `tools`). |
| `public/index.php` | Strona startowa: sesja PHP, HTML, `window.dataSystem`, start `system.js`. |
| `public/system/system.js` | Orkiestracja: logowanie vs zalogowany, język, moduły prywatne. |
| `public/system/handlers.js` | Pomocnicze handlery DOM (formularze, przyciski, tabele, `data-*`). |
| `public/view/app.js` | **Widok** — okna pulpitu, pasek zadań, menu start (duży plik, eksport `default` jako `view`). |
| `public/view/modal.js` | Okna modalne: `alert`, `confirm`, `prompt`, `loading`. |
| `public/tools/login/` | Tool logowania (`login.js`, `config.js`, tłumaczenia). |
| `public/tools/logut/` | Tool wylogowania (literówka w nazwie katalogu — taka jest w projekcie). |
| `private/api/api.js` | **Klient API** — `fetch` do `../src/api.php`, metody typu `login`, `getSessionData`. |
| `private/tools/<nazwa>/` | Prywatne moduły JS ładowane dynamicznie po zalogowaniu (np. `admin_company.js`). |
| `src/api.php` | Endpoint POST JSON: wywołanie procedury PHP lub SQL. |
| `src/procedure/procedure_php.php` | Procedury po stronie PHP (logika aplikacji, sesja). |
| `src/procedure/procedure_sql.php` | Wrapper `CALL nazwa_procedury(...)` do MySQL. |
| `src/modules/loadPrivateModules.php` | Filtrowanie listy modułów z bazy pod bezpieczne ładowanie na froncie. |
| `src/connect/connect.php` | Połączenie `mysqli` z bazą. |
| `doc/` | Dokumentacja, schematy SQL itd. |

---

## 2. Jak działa start aplikacji

1. Użytkownik otwiera **`public/index.php`** (np. `http://localhost/project/public/` — zależnie od konfiguracji XAMPP).
2. PHP uruchamia **`session_start()`**.
3. W HTML tworzone jest **`window.dataSystem`**: `language`, `launge`, `privateModules` (lista nazw załadowanych modułów).
4. Moduł **`public/system/system.js`** importuje `view`, `api`, `login`, `logut` i wywołuje **`await system.init()`**.

### `system.init()` — rozgałęzienie

- Wywołuje **`api.getSessionData()`** → procedura PHP `getSessionData` → zwraca **`$_SESSION`** jako `data`.
- Jeśli **`odp.data.id`** istnieje → użytkownik zalogowany → **`loadSystemLoggedIn()`**:
  - język (`loadLanguageUser`),
  - **`logut.init()`** (menu wylogowania),
  - **`api.loadPrivateModules()`** → dynamiczny `import()` każdego modułu z listy.
- W przeciwnym razie → **`loadSystemLoggedOut()``**:
  - język,
  - **`login.init()`** (ikona logowania na pasku itd.).

---

## 3. `window.dataSystem`

Obiekt ustawiany w `index.php`, uzupełniany w runtime:

| Pole | Znaczenie |
|------|-----------|
| `language` | Kod języka (np. `English`) — po `loadLanguageUser`. |
| `launge` | Obiekt tłumaczeń dla UI logowania itp. |
| `privateModules` | Tablica **nazw** modułów prywatnych, które faktycznie załadowano (`string[]`). |

**Uwaga:** To nie zastępuje `import` w plikach `.js`. Nadal używasz normalnych ścieżek względnych w modułach.

---

## 4. Widok — `public/view/app.js` (`view`)

- Eksport domyślny: pojedynczy obiekt **`view`** z metodami **WindowManager** i **TaskbarManager** (wewnętrznie sklejone na jeden obiekt).
- Na początku pliku jest **długi blok komentarzy z przykładami** (konsola F12): `view.addWindow`, `view.addWindowCard`, `taskbar.refreshTaskbar`, itd.

### Przykłady (z kodu / komentarzy w `app.js`)

```js
import view from './view/app.js';

// Nowe okno
await view.addWindow({ id: 'win-notes', title: 'Notatnik', icon: '📝' });

// Karta w oknie
await view.addWindowCard({ id: 'win-notes', cardId: 'c1', title: 'Info', text: 'Treść' });

// Zamknięcie okna
await view.removeWindow({ id: 'win-notes' });
```

W **`login.js`** / **`logut.js`** widok jest importowany tak samo i używany do budowy okien z konfiguracji (`config.js`).

---

## 5. Handlery — `public/system/handlers.js`

Eksport domyślny: obiekt z funkcjami:

| Funkcja | Krótki opis |
|---------|-------------|
| `handleTableRowClick(id_tabeli, callback)` | Klik w wiersz `<tr class="selectable-row">` — callback dostaje dane wiersza + `dataset`. |
| `removeTableRowClickHandler(id_tabeli)` | Czyści listener. |
| `getFormData(formId)` | Odczyt pól formularza po `id` → obiekt `{ pole: wartość }`. |
| `handleButtonClicks(['btn1','btn2'], callback)` | `callback(id_klikniętego_przycisku)`. |
| `removeButtonClicks(['btn1', ...])` | Usuwa listenery (przez klonowanie węzłów). |
| `handleDataElementClick(selector, callback)` | Delegacja kliknięć po selektorze (np. `[data-user-card]`). |
| `removeDataElementClick(selector)` | Usuwa delegację. |

### Przykład (jak w `login.js`)

```js
import handlers from '../system/handlers.js';

await handlers.handleButtonClicks(['button_zaloguj', 'button_anuluj'], async (id) => {
  if (id === 'button_zaloguj') { /* ... */ }
});
await handlers.removeButtonClicks(['button_zaloguj', 'button_anuluj']);
```

---

## 6. Modal — `public/view/modal.js`

Singleton **`modal`** (klasa `MODAL`):

- `await modal.alert(title, message)`
- `await modal.confirm(title, message)` → `true` / `false`
- `await modal.prompt(title, message, defaultValue)` → string lub `null`
- `await modal.loading(title, message)` — pierwsze wywołanie pokazuje, drugie zamyka (wg komentarza w kodzie)

Tłumaczenia bazowe z `public/view/launge.js` (import wewnątrz `modal.js`).

---

## 7. API po stronie przeglądarki — `private/api/api.js`

- Jeden obiekt **`api`**: metody wołają **`responseApi({ procedurePhp | procedureSql, arguments })`**.
- **`fetch('../src/api.php', { method: 'POST', body: JSON.stringify(...) })`**  
  Ścieżka jest poprawna, gdy strona jest serwowana z **`public/`** (tak jak w `index.php`).

### Dostępne metody (stan obecny)

| Metoda | `procedurePhp` | Opis |
|--------|----------------|------|
| `getSessionData()` | `getSessionData` | Zawartość sesji jako `data`. |
| `getLanguageUser()` | `getLanguageUser` | `{ language: ... }`. |
| `login(data)` | `loginUser` | `data` = tablica argumentów (np. email, hasło) w kolejności oczekiwanej przez backend. |
| `logout()` | `logout` | Niszczy sesję. |
| `loadPrivateModules()` | `loadPrivateModules` | Lista modułów do dynamicznego importu. |

### Wywołanie procedury SQL z frontu (gdy dodasz metodę)

W JSON musisz użyć **`procedureSql`** zamiast **`procedurePhp`**, oraz **`arguments`** jako tablica wartości w kolejności parametrów procedury MySQL.

Przykład struktury (bez konkretnej nazwy procedury):

```js
await fetch('../src/api.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    procedureSql: 'sp_nazwa_procedury',
    arguments: [1, 'tekst', null]
  })
});
```

---

## 8. Backend — `src/api.php`

- **POST**, body: JSON.
- Dokładnie **jedno** z pól: `procedurePhp` **lub** `procedureSql` (nie oba).
- Nazwa procedury: tylko **`[a-zA-Z_][a-zA-Z0-9_]*`**.
- `arguments`: tablica (w PHP jest normalizowana do `array_values`).

### Format odpowiedzi (typowy)

- Sukces: obiekt z **`status_response`** (opcjonalnie) i **`data`**, albo **`results`** przy wielu zestawach — zależnie od procedury i normalizacji w `procedure_sql.php`.
- Błąd techniczny inicjalizacji: HTTP 500 + JSON z komunikatem.
- Błąd wywołania: HTTP 400 + komunikat o nieznanej procedurze itd.

---

## 9. Procedury PHP — `src/procedure/procedure_php.php`

- Każda „procedura” to **prywatna metoda** klasy `ProcedurePHP` o tej samej nazwie co wywołanie z frontu.
- Publiczny dostęp jest tylko przez **`__call`**, który sprawdza, że metoda jest **private** (nie da się wywołać publicznej metody przez API).

Najważniejsze metody:

| Metoda | Zachowanie |
|--------|------------|
| `getSessionData` | Zwraca `$_SESSION`. |
| `getLanguageUser` | Język z sesji lub domyślny. |
| `loginUser` | Wywołuje `ProcedureSQL->sp_login_user`, przy sukcesie kopiuje **`data`** do `$_SESSION`. |
| `logout` | `session_destroy()` + komunikat sukcesu. |
| `loadPrivateModules` | Pobiera `id` z sesji, woła **`sp_get_access_tools`**, filtruje przez **`PrivateModulesLoader`**. |

---

## 10. Moduły prywatne — przepływ end-to-end

1. **MySQL**: procedura **`sp_get_access_tools(id_użytkownika)`** zwraca wiersze m.in. z **`tools_name`**, **`access_tools`**.
2. **`loadPrivateModules.php` (`PrivateModulesLoader`)**:
   - zostawia tylko wiersze z **`access_tools = 1`** (także `'1'`, `true`),
   - **`tools_name`**: tylko `[a-z0-9_]+`,
   - musi istnieć plik: **`private/tools/{tools_name}/{tools_name}.js`**.
3. Odpowiedź do frontu: tablica obiektów `{ name, import_path }` (ścieżka względem `public/system/system.js`).
4. **`system.js`**: waliduje wpis i robi **`import(import_path)`**, zapisuje eksport w **`this.privateModules`** (Mapa: nazwa → moduł) oraz nazwy w **`window.dataSystem.privateModules`**.

### Nowy moduł prywatny — checklista

1. Folder + plik: `private/tools/moj_modul/moj_modul.js` (`moj_modul` tylko małe litery, cyfry, `_`).
2. W bazie: rekord z `tools_name = moj_modul` i **`access_tools = 1`** dla danego użytkownika.
3. W module możesz importować np. `api`, `view`, `handlers`, `modal` **ścieżkami względnymi** od tego pliku (patrz `admin_company.js` → `../../api/api.js`).

### Import z modułu prywatnego do reszty systemu

Przykład (względem `private/tools/admin_company/admin_company.js`):

```js
import api from '../../api/api.js';
// do publicznych plików z public/ ścieżka będzie inna, np.:
// import view from '../../../public/view/app.js';
```

Unikaj importowania **`system.js`** z modułu, który jest ładowany **przez** `system.js` — ryzyko **cyklicznej zależności**.

---

## 11. Logowanie i wylogowanie (skrót)

**Login** (`public/tools/login/login.js`):

- `init()` → jeśli w sesji jest `id` → `reload`; inaczej ikona na pasku.
- Okno logowania: `view.addWindow` + `addWindowCard`, przyciski przez `handlers.handleButtonClicks`.
- Submit: `handlers.getFormData('login_form')` → `api.login(data)` → przy sukcesie komunikat + **`window.location.reload()`**.

**Logout** (`public/tools/logut/logut.js`):

- `init()` → pozycja w menu start z `config.js`.
- Wylogowanie: `api.logout()` → `reload`.

---

## 12. Baza danych i SQL w repozytorium

- Szczegóły tabel / procedur: **`doc/tableSQL.sql`** (w projekcie).
- Konfiguracja połączenia: **`src/connect/connect.php`** (host, user, hasło, nazwa bazy).

---

## 13. Style

- `public/css/style.css` — ogólny wygląd.
- `public/css/modal.css` — modale.

---

## 14. Pliki pomocnicze / literówki

- Katalog **`logut`** (nie „logout”) — spójnie używany w importach; zmiana nazwy wymagałaby aktualizacji ścieżek.
- W `procedure_php.php` w `getLanguageUser` domyślny język jest ustawiony na string zawierający znak tabulacji przed `English` — jeśli w bazie/sesji nie ma `lang`, może to powodować niezgodność z kluczami w `LAUNGE_LOGIN`; warto to zweryfikować przy problemach z językiem.

---

## 15. Szybki „szkielet” nowego toola w `public/tools/`

1. Nowy folder, np. `public/tools/moj_tool/`.
2. `moj_tool.js`: import `view`, `api`, `handlers`, `modal` według potrzeb (wzór: `login.js`).
3. Podłączenie w **`system.js`** (import + wywołanie `init()` w odpowiedniej gałęzi), jeśli ma być częścią cyklu życia aplikacji.

Moduły w **`private/tools/`** są natomiast przeznaczone do **dynamicznego** ładowania po zalogowaniu i uprawnieniach z bazy.

---

*Dokument opisuje stan kodu w repozytorium w momencie jego utworzenia. Po większych refaktorach warto zaktualizować sekcje dotyczące ścieżek i listy metod API.*
