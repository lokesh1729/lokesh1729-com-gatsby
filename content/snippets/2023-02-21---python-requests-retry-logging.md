---
template: "snippet"
title: HTTP Requests Retry and Logging in Python
slug: "/snippets/python-requests-retry-logging/"
draft: false
date: "2023-02-21T00:00:00Z"
description: "Snippet for HTTP request logging and retry"
category: "Software Engineering"
tags:
  - "software-engineering"
  - "python"
  - "logging"
  - "http"
---

```python
import logging
import sys
import time

import requests
from requests.adapters import Retry, HTTPAdapter


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


class RequestSession(requests.Session):

    def request(
        self,
        method,
        url,
        params=None,
        data=None,
        headers=None,
        cookies=None,
        files=None,
        auth=None,
        timeout=None,
        allow_redirects=True,
        proxies=None,
        hooks=None,
        stream=None,
        verify=None,
        cert=None,
        json=None,
    ):
        logger.debug(f"Before making HTTP request. url={url} method={method}"
                     f"params={params} data={data}"
                     f"headers={headers} json={json} timeout={timeout}")
        start_time = time.time()
        response = super().request(
            method,
            url,
            params=params,
            data=data,
            headers=headers,
            cookies=cookies,
            files=files,
            auth=auth,
            timeout=timeout,
            allow_redirects=allow_redirects,
            proxies=proxies,
            hooks=hooks,
            stream=stream,
            verify=verify,
            cert=cert,
            json=json,
        )
        logger.debug(f"After making HTTP request with params url={url} method={method}"
                     f"params={params} data={data} headers={headers}"
                     f"json={json} timeout={timeout} response={response.text}"
                     f"response_status_code={response.status_code}"
                     f"response_headers={response.headers} total_time_taken={time.time() - start_time} seconds")
        try:
            response.raise_for_status()
        except requests.HTTPError:
            logger.critical(f"HTTP request failed. url={url} method={method}"
                            f"params={params} data={data} headers={headers}"
                            f"json={json} response={response.text}"
                            f"response_status_code={response.status_code}")
        return response


retry = Retry(total=10, connect=5, read=5, allowed_methods=['GET', 'POST', 'PUT'], backoff_factor=10, status_forcelist=[500, 502, 503, 504])
session = requests.Session()
session.mount("http://", HTTPAdapter(max_retries=retry))
resp = session.get("https://jsonplaceholder.typicode.com/posts")
print(resp.json())
```
