# Web Frameworks: Project

## Wymagania

1. Należy utworzyć aplikację webową na dowolny temat, wykorzystując do tego celu szkielety
   programistyczne zarówno po stronie serwera jak i klienta. Wskazane jest, aby część serwerowa została
   zaimplementowana przy użyciu szkieletu Express albo Laravel, natomiast strona klienta powinna być
   wykonana w przy pomocy technologii React albo Angular, ewentualnie innego szkieletu
   programistycznego opartego na języku JavaScript.
2. Aplikacja powinna współpracować z bazą danych i realizować operacje CRUD (Create, Read, Update,
   Delete). Preferowaną bazą danych jest MongoDB, ale można też użyć MySQL albo MariaDB. Baza
   danych powinna zawierać przynajmniej 2 encje połączone związkiem jeden do wielu, na których
   aplikacja będzie wykonywać operacje CRUD. Użytkownik powinien mieć dostęp do tych operacji za
   pomocą odpowiedniego graficznego interfejsu użytkownika. `Należy zadbać o informowanie użytkownika o powodzeniu albo niepowodzeniu operacji z wykorzystaniem tego interfejsu.`
3. Strona główna powinna zawierać linki wyświetlające:
    - podstawowe dane z przynajmniej dwóch encji w formie tabel (2 linki, dwie ścieżki do obsługi, 2
      tabele) z przyciskami do dodawania nowego rekordu (pod i nad tabelą), przyciski do
      wyświetlania szczegółów, edycji i usuwania przy każdym rekordzie.
    - przyciski dodawania nowego elementu i edycji przekierowują do odpowiednich formularzy.
    - wyświetlanie szczegółów powinno przekierowywać do widoku wyświetlającego wszystkie dane
      z rekordu poza kluczami (głównymi i obcymi dla tabeli podrzędnej).
    - listę numerowaną zawierającą wszystkie elementy z tabeli nadrzędnej, a pod każdym z nich w
      zagnieżdżonej liście punktowanej odpowiadające elementy z tabeli podrzędnej.
    - każdy element z list z ppktu d. powinien być linkiem do odpowiedniego widoku szczegółowego.
    - w widoku szczegółów zamiast klucza obcego należy wyświetlić najważniejsze pola z
      odpowiadającego rekordu tabeli nadrzędnej.
    - w formularzu dodawania rekordu do tabeli podrzędnej zamiast pola do wprowadzenia klucza
      obcego użyć pola select wyświetlającego najważniejsze pola z tabeli nadrzędnej.
4. `Funkcje aplikacji powinny być dostępne dla zalogowanych użytkowników i zabezpieczone przed
nieuprawnionym dostępem. Do uwierzytelniania i autoryzacji należy wykorzystać mechanizm oparty na
tokenach JWT (JSON Web Token).`
5. `Formularze powinny być walidowane zarówno po stronie klienta jak i serwera za pomocą odpowiednich
filtrów i wyrażeń regularnych.`
6. `Przy ocenie pod uwagę będzie brana jakość kodu i jego organizacja.`
7. Termin oddania projektu – przedostatnie laboratorium w semestrze (na ostatnich zajęciach planowane
   jest omówienie prac i rozmowa z każdym studentem o jego projekcie, która jest warunkiem konieczym
   do otrzymania zaliczenia z zajęć).
