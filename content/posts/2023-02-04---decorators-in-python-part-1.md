---
template: "post"
title: Decorators in python (part-1)
slug: "/python-decorators"
socialImage: "/media/python-decorators.png"
draft: false
date: "2023-02-04T10:52:10.327Z"
description: "Decorators in python are very useful in reducing boilerplate code. They extend the functionality of a function. In this blog post, we will deep dive into python decorators."
category: "Software Engineering"
tags:
  - "python"
  - "software-engineering"
---
## Introduction

As usual, let's stick to the first principles. Let's start with what was taught in our schools. What is a function in mathematics? `f(x) -> y` spelled as `f of x` is a function that takes `x` as input and returns `y` as output. Right, It's the same thing in programming. A function takes some parameters as input and returns a value or object as output.

Let's understand the difference between the definition and the calling of a function.

```python
 def make_http_request(url: str) -> http.Response:
    resp = http.request(url)
    if resp.status_code == 200:
        return resp
    return None
```

In the above code snippet, we defined a function `make_http_request` that takes `url` as the "parameter" and returns `http.Response` the object as output. As the definition we mean, the function will be registered with in-memory (RAM) when the program run. The calling of a function happens when we supply the "arguments" to the function as shown in the below code.

```python
resp = make_http_request("https://twitter.com/api/users")
print(resp)
```

*notice the difference between parameter and argument. "parameters" are the variables passed to the function, they are not the real values. "arguments" are the real values passed to the function. It's not much important to differentiate them as some people use both words interchangeably.*

## Function Basics

Functions are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) in python. It means that they can be assigned to a variable, passed as an argument to a function, and returned from another function.

### Assign function to a variable

```python
def fetch_movies_by_actor(actor_name, movie_db):
    if actor_name == '' or actor_name is None:
        raise ValueError("actor name shouldn't be empty'")
    return filter(lambda movie: actor_name in movie["actors"], movie_db)

if __name__ == "__main__":
    obj = fetch_movies_by_actor
'''
>>> print(obj)
<function fetch_movies_by_actor at 0x109f01280>
>>> print(fetch_movies_by_actor)
<function fetch_movies_by_actor at 0x109f01280>
'''
```

As seen from the above snippet, we defined a function named `fetch_movies_by_actor` and assigned it to a variable called `obj`. When I print both, they both printed the same.

### Pass as an argument

```python
def fetch_movies_by_actor(actor_name, movie_db):
    if actor_name == '' or actor_name is None:
        raise ValueError("actor name shouldn't be empty'")
    return filter(lambda movie: actor_name in movie["actors"], movie_db)

def fetch_movie_details(actor_name, func):
    if func is not None:
        print(func)
        movies = func(actor_name)
        return movies
    return []

if __name__ == "__main__":
    result = fetch_movie_details("Tom Cruise", fetch_movies_by_actor)
```

As seen in the above example, `fetch_movies_by_actor` the function is passed as an argument to `fetch_movie_details` and it is called there.

### Returning from another function

```python
def fetch_movie_genres_by_year(year):
    filtered_movies = list(filter(lambda movie: movie["year"] == year, movie_db))
    def get_genres_by_movie_name(movie_name):
        movie = list(filter(lambda movie: movie["name"] == movie_name ,filtered_movies))[0]
        return movie["genre"]
    return get_genres_by_movie_name
```

As seen in the above code snippet, the function `fetch_movie_genres_by_year` returned another function `get_genres_by_movie_name` . To obtain the final result, we need to do this 👇.

```python
movie_genres = fetch_movie_genres_by_year(2009)("XYZ")
```

Let's try to understand what's happening there. In mathematical terms, `f(x) -> g(x) -> result` the function `f(x)` returned `g(x)` which returned the result. So, to get the final result, we need to call `f(x)` and then `g(x)` that's what we did above.

## Decorators

What is a decorator? A decorator is a function, which takes a function as a parameter and returns another function. It may be slightly confusing at this point, but everything will be clear at the end. Why do decorators exist? What are its uses? **Decorators extend the functionality of a function which reduces the lines of code to write**. When to use decorators? Simple, when you see a lot of repetitive code.

Let's say you have hundreds of functions defined and you want to log the parameters of the function and the result of it for troubleshooting purposes. Using decorators, you can add them in a single place and apply them to all the functions.

```python
def decorator(func): # decorator is a function, taking another function "func" as a parameter
    def wrapper(*args, **kwargs):
        # do something before evaluating function
        result = func(*args, **kwargs)
        # do something with result or some other stuff
        return result
    return wrapper # decorator is returning another function

@decorator
def myfunc(a, b):
    # function body
    pass
'''
myfunc's identity will be changed as myfunc = decorator(myfunc)
'''
```

In the above code snippet, `myfunc` is decorated with the decorator named `decorator` using `@` symbol which is syntactic sugar to use decorators in python. So, What happens when you decorate a function? Let's understand it.

```python
@decorator
def myfunc(a, b):
    # function body
    pass

def myfunc2(a, b):
    # function body
    pass

if __name__ == "__main__":
    print(myfunc)
    print(myfunc2)

'''
>>> print(myfunc)
<function decorator.<locals>.wrapper at 0x109e233a0>
>>> print(myfunc2)
<function myfunc2 at 0x109e23430>
'''
```

As seen in the above code snippet, `myfunc` is printed with the name of the decorator and the function returned by the decorator i.e. `wrapper`. Whereas `myfunc2` is printed as usual.

It is clear that when a function is decorated with a decorator, the original function's definition will change to `myfunc = decorator(myfunc)` i.e. `myfunc = decorator(myfunc) -> wrapper` . **If we look at the decorator's definition, the** `func` **parameter is nothing but the original function which is decorated.**

Calling the original function will be equal to `myfunc(*args, **kwargs) = decorator(myfunc)(*args, **kwargs)` i.e. `myfunc(*args, **kwargs) = decorator(myfunc) -> wrapper(*args, **kwargs)`. **If we look at the decorator definition again, the arguments passed to the** `wrapper` **function inside the decorator are nothing but the arguments passed to the original function.** Also, be sure to call the original function in the inner function of the decorator else the whole purpose of the decorator will be lost.

### Logger Example

```python
import logging


logger = logging.getLogger(__name__)

class CustomException(Exception):
    pass

def exception_logger(func):
    """decorator to log the exceptions"""

    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as exc:
            logger.exception(
                "Unhandled exception in function %s , exception is %s", func.__name__, exc
            )
            raise CustomException("Unhandled exception in function %s" % func.__name__) from exc

    return wrapper
```

In the above code snippet, the original function is called in between try and except block where we are catching and logging the exceptions.

Let's use the decorator and see what happens.

```python
@exception_logger
def func(a, b): # func = exception_logger(func)
    return a / b

print(func(1, 0)) # func(1, 0) = exception_logger(func)(1,0)

'''
Unhandled exception in function func , exception is division by zero
Traceback (most recent call last):
  File "<ipython-input-1-5525c8c2a27e>", line 14, in inner
    return func(*args, **kwargs)
  File "<ipython-input-3-e825ef26bd9c>", line 3, in func
    return a / b
ZeroDivisionError: division by zero
'''
```

As we see from the above snippet, the exception was logged by the decorator. When the program runs, firstly the `func` will be changed to `func = exception_logger(func)` . When we call the original function, we are indirectly calling the `wrapper` function of the decorator.

### Timing Example

Let's write a decorator to measure the time taken by a function. Below is the code snippet for it. It is self-explanatory.

```python
import functools
import time


def timeit(func):
    def wrapper(*args, **kwargs):
        before_calling = time.time()
        result = func(*args, **kwargs)
        after_calling = time.time()
        print("function %s has took %s seconds" % (func.__name__, (after_calling - before_calling)))
        return result
    return wrapper
```

If you prefer a video version, check out 👇

[](https://www.youtube.com/watch?v=puMqIA4NNmc)[Decorators in python (part-1)](https://www.youtube.com/watch?v=puMqIA4NNmc)

[Decorators in python (part-2)](https://youtu.be/4EiEUyvD0KU)