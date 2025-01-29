# API - Lawyer Management

## Опис
Дана документацію розроблена щоб пояснити як використовувати дані CRUD - операції. А точніше який URL вводити:

Get All Lawyers - https://localhost:5000/lawyers

Get Lawyer By ID - https://localhost:5000/lawyers/{id} (Вводите id юриста)

Post Lawyer - https://localhost:5000/addLawyer

Patch Lawyer - https://localhost:5000/updateLawyer/{id}

Delete Lawyer - https://localhost:5000/deleteLawyer/{id}

_**Структура даних:**_
_**{**_

_**"id": " " ,**_ //Прописувати не потрібно, автоматично визначається

_**"first_name": " ",**_

_**"last_name": " ",**_

_**"middle_name": " ",**_

_**"email": " ",**_

**_"contact": " ",**_

_**"experience": " ",**_

_**"UNITE_number": " " **_//Прописувати не потрібно, визначається автоматично

_**}**_


## Запуск
1. Клонуйте репозиторій:
   ```bash
   git clone <https://github.com/RuslanTsri/API_practice>
   ```
2. Відкрийте проєкт та запустіть файл:
   ```bash
   server.js
   ```
3. Скачайте Postmen та створіть колекцію CRUD - операцій


4. Насолоджуйтесь проєктом
