install:
	poetry install
	cd project/ && npm ci && npm run build
 
dev_start: dev_stop
	tmux new-session -s test_parser -d && \
	tmux split-window -v -t test_parser:0.0 && \
	tmux split-window -h -t test_parser:0.1 && \
	tmux split-window -h -t test_parser:0.2 && \
	tmux send-keys -t test_parser:0.0 'poetry run python project/manage.py runserver 0.0.0.0:8015' Enter && \
	tmux send-keys -t test_parser:0.1 'cd project/' Enter && \
	tmux send-keys -t test_parser:0.1 'poetry run npm run watch' Enter && \
	tmux send-keys -t test_parser:0.2 'cd project/' Enter && \
	tmux send-keys -t test_parser:0.2 'poetry run celery --pidfile= -A project worker --loglevel=info --concurrency=4 -E' Enter && \
	tmux send-keys -t test_parser:0.3 'cd project/' Enter && \
	tmux send-keys -t test_parser:0.3 'poetry run celery --pidfile= -A project beat --loglevel=info' Enter && \
	tmux attach -t test_parser

dev_stop:
	tmux kill-session -t test_parser || true

dev_style:
	cd project/ && poetry run sh style.sh
 