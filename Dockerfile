FROM ubuntu:23.10

COPY ./project /var/www/project  
WORKDIR /var/www/project
COPY poetry.lock pyproject.toml ./

RUN apt-get update && apt-get -y --no-install-recommends install nginx npm supervisor redis-server python3 python3-pip python3-dev gcc curl wget
RUN rm /usr/lib/python3.11/EXTERNALLY-MANAGED
RUN useradd --no-create-home nginx && \
    pip3 install --upgrade pip && pip3 install poetry==1.4.* wheel && \
    poetry config virtualenvs.create false && \
    poetry install && npm i && npm run build && rm -rf ./node_modules && \
    rm -rf poetry.lock pyproject.toml 

COPY ./config/nginx.conf /etc/nginx/nginx.conf
COPY ./config/nginx-app.conf /etc/nginx/sites-available/default
COPY ./config/supervisor-app.conf /etc/supervisor/conf.d/app.conf

