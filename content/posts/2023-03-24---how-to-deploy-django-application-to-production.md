---
template: "post"
title: How to deploy django application to production
slug: "/posts/how-to-deploy-django-application-to-production/"
socialImage: "/media/django-deployment.png"
draft: false
date: "2023-03-25T07:57:18.034Z"
description: "Django is a popular web framework with all batteries included. In this blog post, we will learn how to deploy it to production"
category: "Software Engineering"
tags:
  - "software-engineering"
  - "django"
---

## Introduction

If you are looking for a guide to deploying a Django application to production, then you are at the right place. This guide assumes that you have a working Django application. You can check if your application is healthy by running this command `python manage.py check` .

## Components

### Gunicorn

`python manage.py runserver` is not ideal for production. We need to run it with gunicorn and wsgi. We can also use `gevent` workers to take advantage of multiple processors. Remember python's GIL that makes it hard to achieve concurrency?

```bash
#!/bin/bash

NAME="ProjectName"
DJANGODIR=/root/project_name
USER=root
GROUP=root
NUM_WORKERS=5
DJANGO_SETTINGS_MODULE=config.settings.production
DJANGO_WSGI_MODULE=config.wsgi
echo "Starting $NAME as `whoami`"

cd $DJANGODIR
exec venv/bin/python venv/bin/gunicorn ${DJANGO_WSGI_MODULE}:application --name ${NAME} --workers ${NUM_WORKERS} --worker-class gevent --bind unix:///tmp/gunicorn.sock --log-level info --access-logfile ${DJANGODIR}/logs/django_server_stdout.log --error-logfile ${DJANGODIR}/logs/django_server_stderr.log --timeout 300
```

### Supervisor

Supervisor is a utility to manage multiple processes. It is like `pm2` in node.js. We need to add gunicorn and celery worker if you have any.

```bash
[program:gunicorn]
directory = /root/project_name
command = /bin/bash -c "/bin/bash gunicorn_start"
user = root
stdout_logfile = /root/project_name/logs/gunicorn_stdout.log
stderr_logfile = /root/project_name/logs/gunicorn_stderr.log
redirect_stderr = false
environment = LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8

[program:celery_worker]
command = /bin/bash -c "/root/project_name/venv/bin/celery -A config.celery worker -c 10 -P gevent -Q openai -n openai_w1@%%h"
directory = /root/project_name
user = root
stdout_logfile = /root/project_name/logs/openai_worker_stdout.log
stderr_logfile = /root/project_name/logs/openai_worker_stderr.log
redirect_stderr = false
autostart = False
environment = LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8
```

### Nginx

We need a reverse proxy to route all the requests to the web server.

```bash
server {
    server_name project_name.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    client_max_body_size 4G;
    access_log /root/project_name/logs/nginx_access.log;
    error_log /root/project_name/logs/nginx_error.log;
    location /static/ {
        autoindex on;
        alias /root/project_name/staticfles/;
    }

    location /media/ {
        autoindex on;
        alias /root/project_name/media/;
    }

    location / {
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://unix:/tmp/gunicorn.sock;
    }

    listen 80;
}

server {

    if ($host = www.project_name.com) {
        return 301 http://$host$request_uri;
    }

    server_name www.domain.com;
    listen 80;
    return 404;
}
```

## Glue them All

```bash
# OS dependencies
sudo apt-get install software-properties-common
sudo apt-add-repository universe
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install -y gcc libpq-dev make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python-openssl git python3 python-dev python3-dev libxml2-dev libxslt1-dev zlib1g-dev python-pip libmysqlclient-dev gcc libpq-dev python-dev python-pip python-wheel python3-dev python3-pip python3-venv python3-wheel
# install nginx and supervisor
sudo apt-get install nginx supervisor
```

By default, nginx runs with the user `www-data` and other processes run on `root` or a different user. So, all the static files give 403 forbidden because of it. To fix this, we need to create a new group, add `www-data` and `root` to it and add it to the permissions of static files.

```bash
sudo groupadd nginx
sudo usermod -a -G nginx root
sudo usermod -a -G nginx www-data
sudo chown root:nginx /root
# assuming that your project is in root
sudo chown root:nginx /root/project_name
sudo chown -R root:nginx /root/project_name/projectfiles
sudo chmod 755 /root
sudo chmod 770 /root/project_name
sudo chmod 770 -R /root/project_name/staticfiles
```

Copy the above supervisor config to `/etc/supervisor/conf.d/django.conf` and nginx config to `/etc/nginx/sites-available/project_name.conf` using the below command.

```bash
cp django.conf /etc/supervisor/conf.d/django.conf
cp project_name.conf /etc/nginx/sites-available/project_name.conf
ln -s /etc/nginx/sites-available/project_name.conf /etc/nginx/sites-enabled/project_name.conf
```

Start gunicorn and nginx

```bash
supervisorctl start gunicorn celery_worker
sudo service nginx restart
```

If you are using Ubuntu, check if the firewall is enabled using `ufw status` command. Allow ports 80 and 443 in the firewall using `ufw allow 80` and `ufw allow 443` . Many times I used to wonder why the website is inaccessible but accessible inside the machine. It is because those ports are blocked by the firewall.

## Redeployment Script

To redeploy on every change, it becomes cumbersome to execute every command. Here is the shell script to execute.

```bash
source venv/bin/activate
source .envrc
git pull origin main
python manage.py check
python manage.py migrate
npm run build
python manage.py collectstatic --no-input
supervisorctl -c /etc/supervisor/supervisord.conf restart gunicorn celery_worker
sudo service restart nginx
```
