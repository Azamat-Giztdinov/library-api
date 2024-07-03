# library-api

1. Создать файл .env и добавить параметры
    ``` bash
    cp .env.example .env
    ```

2. Сборка и запуск сервера
    ```
    docker-compose up --build -d
    ```

3. Миграция и добавление администратора
    ```
    docker-compose exec api-library npm run prism
    docker-compose exec api-library npm run seed
    ```