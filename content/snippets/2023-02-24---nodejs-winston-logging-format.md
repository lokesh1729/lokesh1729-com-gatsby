---
template: "snippet"
title: Nodejs Winston Logging Format
slug: "/snippets/nodejs-winston-logging-format/"
draft: false
date: "2023-02-24T00:00:00Z"
description: "Logging formats in winston in node.js"
category: "Software Engineering"
tags:
  - "software-engineering"
  - "nodejs"
  - "logging"
---

Winston logger is one of the popular logging libraries in Node.js. Setting it up is as simple as this

```javascript
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.json(),
    winston.format.errors({ stack: true }),
  ),
  transports: [new winston.transports.Console({ level: "info" })],
});
```

winston uses [logform](https://github.com/winstonjs/logform) a library for managing different kinds of formats.
`errors` - This will be helpful if you need to print the stack traces of errors. You can simply pass the instance of `Error` to the log function.

`simple` - As name says, it simply logs the message like printf in C.

`splat` - This is very useful if you want to print objects, arrays. It uses [Node.js built-in util.format](https://nodejs.org/api/util.html#utilformatformat-args). `%s`, `%d` are common known formats.

`%j` does `JSON.stringify` of your object. But, if your object has circular references, it prints `[Circular]`. What is circular reference? Consider the following snippet. `obj.xyz` attribute has the reference to the whole object.

```javascript
var obj = { abc: 123 };
obj.xyz = obj;
```

`%o` String representation of object with all the properties including non-enumerable properties and proxies.
`%O` Similar to `%o` but without non-enumerable properties and proxies.

Most of the times, in your code, you need to use `%s`, `%O` to log the message. In very rare case, you need to use `%o`.
