---
template: post
title: OpenAPI - API documentation standard - Boon for the software engineers
slug: openapi-document-standard-boon-for-software-engineers
socialImage: /media/openapi.png
draft: true
date: 2022-12-27T12:00:29.270Z
description: OpenAPI is a standard for API documentation. It acts as a bridge
  between backend and frontend systems. Using the OpenAPI specification file, we
  can generate beautiful UI using swagger or ReDoc.
category: software engineering
tags:
  - software-engineering
  - openapi
---
## Introduction

Your product manager brought a new product requirement. Frontend engineers and you (backend engineer) finalized a solution. They asked you for an API contract. You created a google doc (or confluence) and gave it to them. The contract changed later and you update the code as well as the document. Wouldn't it be so nice if the documentation also lives in your code repository and automatically updates along with your code changes? That's where OpenAPI comes in.

## What is OpenAPI?

OpenAPI is a standard for defining the documentation of backend APIs. It is in the form of a file called a specification document. It can be in YAML or JSON format. OpenAPI sets standard syntax to define an API contract. You can read more about it [here](https://oai.github.io/Documentation/introduction.html).

An example of an OpenAPI spec looks like this. A more detailed explanation of each field can be found [here](https://oai.github.io/Documentation/specification-structure.html).

```json
openapi: 3.1.0
info:
  title: Order Management System
  description: |
    Order Management provide APIs to create, cancel, deliver and reject orders
  version: 1.0.0
paths:
  /api/v1/order:
    post:
      summary: Creates a new order
      description: creates a new order
      paramters:
        ....
      responses:
        ....

```

## OpenAPI is a Magic

1. You are maintaining a legacy system and you don't have OpenAPI spec for it. Writing it from scratch manually would take a lot of time. Instead, you can use OpenAPI generators to generate specs automatically. You simply need to pass the response object to it. You can find them here - <https://openapi.tools/#converters>

2. The converters can also take HAR (HTTP Archive Format) file and generate a spec. You can get the HAR from chrome or firefox dev tools. Go to the network tab -> right-click on a request -> Save as HAR. List of such generators can be found here - <https://openapi.tools/#auto-generators>

3. You can generate boilerplate code stubs with OpenAPI spec. Yes! you heard it right! you only need to write the business logic that's all, everything will be generated for you. There are so many generators available for every programming language. Find it here [https://openapi-generator.tech](https://openapi-generator.tech/). GitHub repo for the same <https://github.com/OpenAPITools/openapi-generator> & <https://github.com/OpenAPITools/openapi-generator-cli>

With the above tools, writing an API is very easy in 2 steps. Create a sample JSON response structure of your API. Generate OpenAPI spec and pass it to the generators to generate stubs.

## OpenAPI UI Tools

There are two popular UI tools generated using OpenAPI spec. One is a widely used and popular [swagger](https://swagger.io/tools/swagger-ui/). Another is [Redoc](https://redocly.github.io/redoc/#section/OpenAPI-Specification). The integration of these tools with any programming language is very easy. The guides for them are present on their respective websites.

## Additional Referrences

OpenAPI Homepage - <https://www.openapis.org>

OpenAPI Spec - <https://spec.openapis.org/oas/v3.1.0>

OpenAPI Documentation - [https://oai.github.io/Documentation](https://oai.github.io/Documentation/)

OpenAPI Generators - <https://openapi-generator.tech>

OpenAPI Tools - [https://openapi.tools](https://openapi.tools/)