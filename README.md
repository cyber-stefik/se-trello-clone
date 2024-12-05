# Copyright Stefanita Ionita, MTI 1B, 2024-2025
# Trello Clone

# Proiect Board Management

## Descriere

Este o clona de Trello in care functiile de baza sunt prezente: crearea de board-uri, updatarea numelor acestora, crearea de liste in interiorul board-urilor si crearea de carduri in interiorul listelor.

## Deciziile Luate
Am reusit sa creez functiile necesare (findById, getBoardItem samd) in fisierul actions.ts, fiind separat de ui. Am separat partea de server de client.

1. **Interfete definite in cod**:
   - **Board**: Un board are un nume si contine liste.
   - **Lista**: O lista are un nume si contine o lista de carduri.
   - **Card**: Un card are un nume si o descriere.

2. **Fluxul de creare**:
   - **Creare Lista**: Listele se adauga unui board existent, iar fiecare lista are un nume unic in cadrul boardului respectiv.
   - **Creare Card**: Cardurile sunt adaugate la o lista existenta. Din implementare, poti adauga carduri doar in cadrul listei selectate

3. **Fluxul de actualizare**:
   - **Actualizare Board**: Numele board-ului poate fi actualizat printr-o cerere PUT.
   - **Actualizare Listă**: Listelor le pot fi actualizate numele printr-o cerere PUT.
   - **Actualizare Card**: Cardurile pot fi actualizate printr-o cerere PUT, modificând numele și descrierea acestora.

4. **Endpointuri API**:
   - **POST** `/api/boards`: Creaza un board nou.
   - **PUT** `/api/boards/[id]`: Actualizeaza numele unui board existent.
   - **POST** `/api/boards/[id]/list`: Adauga o lista noua sau modifica una existenta pe board.
   - **POST** `/api/boards/[id]/list/card`: Adauga sau actualizeaaza un card intr-o lista.

5. **Gestionarea modurilor de cerere**:
   - **POST** pentru creare.
   - **PUT** pentru actualizare.
   - **GET** pentru citire.
   - **DELETE** pentru stergere.


