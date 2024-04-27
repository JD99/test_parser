# Тестовый проект Информационная система «Курсы валют»

Для работы необходимо: python v3.10, poetry 1.4, node v20, tmux, make

1. Для запуска на локальной машине потребуется tmux и make
- `apt install tmux make npm`
- Интерактивный режим tmux `vi ~/.tmux.conf`

```
set-option -g -q mouse on
bind-key -T root WheelUpPane if-shell -F -t = "#{alternate_on}" "send-keys -M" "select-pane -t =; copy-mode -e; send-keys -M"
bind-key -T root WheelDownPane if-shell -F -t = "#{alternate_on}" "send-keys -M" "select-pane -t =; send-keys -M"
```

2. Установка и настройка poetry
* Скачать и установить `curl -SL https://install.python-poetry.org | python3 - --version 1.4.2`
* Проверить установлен ли poetry `poetry --version`


3. После того как клонировали репозиторий выполните `make install`
4. Для запуска необходимо в корне проекта создать файл `.env`
   заполнить в соответсвии с `.env.example`

5. Создание базы данных, применение миграций `make migrate`
6. Запуск проекта. Выполнить команду `make dev_start`. Веб интерфейс будет доступен по адресу `http://127.0.0.1:8015/`
 
Полезные команды в Makefile:
* make install - создает вирт.окружение устанавливает зависимости, выполняет сборку js
* make migrate - создает БД, применяет миграции
* make dev_start - запуск дев сервера (ресурс доступен на порту 8015)
* make dev_stop - остановка дев сервера
* make dev_stop - проверить стили кода


