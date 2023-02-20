---
template: "post"
title: Decorators in python (part-2)
slug: "/posts/decorators-in-python-part-2"
socialImage: "/media/python-decorators.png"
draft: false
date: "2023-02-04T14:15:07.389Z"
description: "This is part-2 of decorators in python. In this post, we will learn about decorators with arguments and some of the applications"
category: "Software Engineering"
tags:
  - "python"
  - "software-engineering"
---

## Introduction

If you have not read [the previous post](https://lokesh1729.com/posts/python-decorators), please go through it because it is a prerequisite for this. In this post, we will go into some more depth and learn about decorators with arguments.

## functools.wraps decorator

We learned from the previous blog post that when a function is decorated with a decorator, the representation of it will be changed to `decorator.<locals>.wrapper at 0x109e233a0>` which looks ugly. How can we keep the original string representation of the function? Here comes `functools.wraps` the decorator. It is a decorator — again, so many decorators huh? — which restores the original function name. We will use it like the one below.

```python
import functools

def decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        pass
    return wrapper
```

In a nutshell, what it does is simply sets `__name__` , `__doc__` and `__module__` properties of the wrapper function to the original one.

```python
wrapper.__name__ = func.__name__
wrapper.__doc__ = func.__doc__
wrapper.__module__ = func.__module__
```

## Decorators with arguments

First, let's write a retry decorator which makes an API call and retries on failure.

```python
import requests
import time
import logging


logger = logging.getLogger(__name__)

def retry(make_http_call):
    def wrapper(*args, **kwargs):
        curr_retry_count = 0
        max_retries = 5
        retry_interval = 10
        while init_retry_count <= max_retries:
            try:
                response = make_http_call(*args, **kwargs)
                if response.status_code in [200, 201]:
                    return response
            except requests.RequestException:
                logger.error("error in making call")
            time.sleep(retry_interval * (math.pow(2, curr_retry_count - 1))) # retry_interval * 2^(n-1) -> exponential backoff
            curr_retry_count += 1
        raise requests.RequestException("problem in making HTTP call please check logs")
    return wrapper
```

In the above code snippet, `retry` is a function accepting `make_http_call` as a parameter. Assume that `make_http_call` triggers an HTTP request. The code is a no-brainer, it makes an HTTP request in a loop until the request is a success or the maximum retries are reached. It waits for some time until the next retry i.e. exponential backoff.

We want to make `retry` customizable by accepting `max_retry_count` and `retry_interval` because they may vary depending upon the usecase. How do we do that? simple, we will create another function which takes two parameters and simply wrap the above function inside it.

```python
import requests
import time
import logging


logger = logging.getLogger(__name__)


def retry(max_retries, retry_interval):
    def inner(make_http_call):
        def wrapper(*args, **kwargs):
            curr_retry_count = 0
            while init_retry_count <= max_retries:
                try:
                    response = make_http_call(*args, **kwargs)
                    if response.status_code in [200, 201]:
                        return response
                except requests.RequestException:
                    logger.error("error in making call")
                time.sleep(retry_interval * (math.pow(2, curr_retry_count - 1))) # retry_interval * 2^(n-1) -> exponential backoff
                curr_retry_count += 1
            raise requests.RequestException("problem in making HTTP call please check logs")
        return wrapper
    return inner


@retry(10, 60)
def make_http_request(url, params=None, data=None):
    pass
```

Mathematically, the above function `make_http_request` becomes `make_http_request = retry(10, 60)(make_http_request)` and calling that function would be like

```python
make_http_request(
    "https://api.twitter.com/v2/users",
    params={"username": "lsanapalli"}
) = retry(10, 60)(make_http_request)(
    "https://api.twitter.com/v2/users",
    params={"username": "lsanapalli"}
)
```

## Using multiple decorators

Can we decorate a function with multiple decorators? yes. What will be the order of execution? simple, let's consider an example and stick to our basics.

```python
@decorator3
@decorator2
@decorator1
def myfunc(a, b):
    pass
```

Consider we have a function `myfunc` decorated with 3 decorators as above. Firstly, `myfunc` will be passed as an argument to `decorator1` and the result of that will be passed to `decorator2` and so on....

`myfunc = decorator3(decorator2(decorator1(myfunc)))`

If you prefer a video version, check out 👇

[](https://www.youtube.com/watch?v=puMqIA4NNmc)[Decorators in python (part-1)](https://www.youtube.com/watch?v=puMqIA4NNmc)

[Decorators in python (part-2)](https://youtu.be/4EiEUyvD0KU)
