---
myst:
  html_meta:
    "description": "Plone 6 Docker image recipes"
    "property=og:description": "Plone 6 Docker image recipes"
    "property=og:title": "Plone 6 Image recipes"
    "keywords": "Plone 6, install, installation, docker, containers, Official Images"
---

# Recipes

Here you have some useful recipes when working with Plone containers


## Remove access log from plone containers

When working a project generated using [cookieplone](https://github.com/plone/cookieplone) you will be creating Plone containers for your project that are based on the official `plone/plone-backend` images.

You may have noted that when you run your container or the official `plone/plone-backend` image, the output mixes both the event log and the access log making it hard to follow the logs you may have added to your application.

In such cases, you may end with a `docker compose` setup with several components in which you will have a proxy server that already provides access logs.

So it is a common usage configuration to remove the access logging from the Plone container.

To do so you will need a custom {file}`zope.ini` file in your project's {file}`backend` folder with the following content:

```ini
[app:zope]
use = egg:Zope#main
zope_conf = %(here)s/%(config_file)s

[server:main]
use = egg:waitress#main
host = 0.0.0.0
port = 8080
threads = 2
clear_untrusted_proxy_headers = false
max_request_body_size = 1073741824


[filter:translogger]
use = egg:Paste#translogger
setup_console_handler = False

[pipeline:main]
pipeline =
    egg:Zope#httpexceptions
    zope

[loggers]
keys = root, waitress.queue, waitress, wsgi

[handlers]
keys = accesslog, eventlog

[formatters]
keys = generic, message

[formatter_generic]
format = %(asctime)s %(levelname)s [%(name)s:%(lineno)s][%(threadName)s] %(message)s
datefmt = %Y-%m-%d %H:%M:%S

[formatter_message]
format = %(message)s

[logger_root]
level = INFO
handlers = eventlog

[logger_waitress.queue]
level = INFO
handlers = eventlog
qualname = waitress.queue
propagate = 0

[logger_waitress]
level = INFO
handlers = eventlog
qualname = waitress
propagate = 0

[logger_wsgi]
level = WARN
handlers = accesslog
qualname = wsgi
propagate = 0

[handler_accesslog]
class = StreamHandler
args = (sys.stdout,)
level = INFO
formatter = message

[handler_eventlog]
class = StreamHandler
args = (sys.stderr,)
level = INFO
formatter = generic

```

If you compare this file with the [original zope.ini file](https://github.com/plone/plone-backend/blob/6.1.x/skeleton/etc/zope.ini) that comes with the `plone/plone-backend` container, you may realize that the only change here is that we remove `translogger` from the `pipeline` option.

This `translogger` middleware [produces logs in the Apache Combined Log Format](https://docs.pylonsproject.org/projects/waitress/en/latest/logging.html) and that is exactly what we want to remove in our setup.

After adding the mentioned file in your project, you need to adjust the {file}`Dockerfile` also.


In your {file}`Dockerfile` you have the following contents:

```Dockerfile
...
# Add local code
COPY scripts/ scripts/
COPY . src

# Install local requirements and pre-compile mo files
RUN <<EOT
...
```

Just before the `RUN` command, you need to copy the {file}`zope.ini` file into the container, as follows:

```Dockerfile
...
# Add local code
COPY scripts/ scripts/
COPY . src
COPY zope.ini etc/

# Install local requirements and pre-compile mo files
RUN <<EOT
```

With these changes, after you build your project container as usual, it will not output the access log, but only the event log.

