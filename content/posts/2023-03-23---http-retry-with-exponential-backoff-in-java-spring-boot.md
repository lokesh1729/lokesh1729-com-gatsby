---
template: "post"
title: HTTP retry with exponential backoff in java spring boot
slug: "/posts/http-retry-with-exponential-backoff-in-java-and-spring-boot/"
socialImage: "/media/java-http-retry.png"
draft: false
date: "2023-03-23T20:47:18.034Z"
description: "Implementing HTTP retry with exponential backoff in spring boot is not trivial. Let's learn it in this blog post."
category: "Software Engineering"
tags:
  - "software-engineering"
  - "java"
  - "http"
---

In this blog post, we will learn to implement the HTTP retry mechanism in java and spring boot.

## Rest Template

Rest template is the popular HTTP client in spring boot. We will create a configuration and create a bean for it so that the spring boot's container picks it up.

```java
package com.abc.config;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

	@Bean
	public RestTemplate restTemplate() {
		RestTemplate restTemplate =
                new RestTemplateBuilder().setConnectTimeout(Duration.ofSeconds(30))
				.setReadTimeout(Duration.ofSeconds(90)).build();
		List<ClientHttpRequestInterceptor> interceptors = restTemplate.getInterceptors();
		if (CollectionUtils.isEmpty(interceptors)) {
			interceptors = new ArrayList<>();
		}
		restTemplate.setInterceptors(interceptors);
		restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
		return restTemplate;
	}

}
```

## Retry Config

We need to add `spring-retry` and `spring-aspects` to our dependencies.

```xml
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
    <version>1.2.5.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>5.2.8.RELEASE</version>
</dependency>
```

```java
package com.abc.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.backoff.BackOffPolicy;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.web.client.HttpServerErrorException;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RetryConfig {


    ExceptionClassifierBackoffPolicy exceptionClassifierBackoffPolicy;

    @Autowired
    public RetryConfig(ExceptionClassifierBackoffPolicy exceptionClassifierBackoffPolicy) {
        this.exceptionClassifierBackoffPolicy = exceptionClassifierBackoffPolicy;
    }

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();
        SimpleRetryPolicy simpleRetryPolicy = new SimpleRetryPolicy(5);
        ExponentialBackOffPolicy exponentialBackOffPolicy = new ExponentialBackOffPolicy();
        exponentialBackOffPolicy.setInitialInterval(5000L);
        exponentialBackOffPolicy.setMaxInterval(40000L);

        Map<Class<? extends Throwable>, BackOffPolicy> policyMap = new HashMap<>();
        policyMap.put(HttpServerErrorException.class, exponentialBackOffPolicy);
        exceptionClassifierBackoffPolicy.setPolicyMap(policyMap);
        retryTemplate.setRetryPolicy(simpleRetryPolicy);
        retryTemplate.setBackOffPolicy(exceptionClassifierBackoffPolicy);

        return retryTemplate;
    }
}
```

`ExponentialBackoffPolicy` takes the following parameters.

`initialinterval` - The initial number of seconds to wait.

`maxInterval` - The maximum number of seconds to wait.

`multiplier` - The factor to multiply the initial interval with.

We created a hashmap of the exception class and the policy to use and then we added it to our rest template. A point to note here is after setting the exponential backoff policy, the simple retry policy also needs to be set. If it is not set, by default only 3 retries will be made. So, in the above code, we set the max retires as 5 to the simple retry policy because, in the exponential back-off policy, we set 5 seconds as the initial delay. So, on the first retry, it waits for 5, then 10, 20, and 40. Totally 5 retries will be made. Make sure to adjust these numbers that works better for you.

## ExceptionClassifierBackoffPolicy

There is a default [`ExceptionClassifierRetryPolicy`](https://docs.spring.io/spring-retry/docs/api/current/org/springframework/retry/policy/ExceptionClassifierRetryPolicy.html) using which we can configure policies for exception classes. But we cannot use `ExponentialBackOffPolicy` it. Because in spring retry, `Retry` and `Backoff` are two different policies implementing different interfaces. So, we need to create our own custom `ExceptionClassifierBackoffPolicy` class for it.

```java
package com.abc.config;

import org.springframework.classify.Classifier;
import org.springframework.classify.ClassifierSupport;
import org.springframework.classify.SubclassClassifier;
import org.springframework.retry.RetryContext;
import org.springframework.retry.backoff.BackOffContext;
import org.springframework.retry.backoff.BackOffInterruptedException;
import org.springframework.retry.backoff.BackOffPolicy;
import org.springframework.retry.backoff.NoBackOffPolicy;

import java.util.HashMap;
import java.util.Map;

public class ExceptionClassifierBackoffPolicy implements BackOffPolicy {

    private static class ExceptionClassifierBackoffContext implements BackOffContext, BackOffPolicy {
        Classifier<Throwable, BackOffPolicy> exceptionClassifier;
        RetryContext retryContext;

        Map<BackOffPolicy, BackOffContext> contextMap = new HashMap<>();

        ExceptionClassifierBackoffContext(Classifier<Throwable, BackOffPolicy> exceptionClassifier, RetryContext retryContext) {
            this.exceptionClassifier = exceptionClassifier;
            this.retryContext = retryContext;
        }

        @Override
        public BackOffContext start(RetryContext context) {
            return (BackOffContext) context;
        }

        @Override
        public void backOff(BackOffContext backOffContext) throws BackOffInterruptedException {
            BackOffPolicy policy = exceptionClassifier.classify(retryContext.getLastThrowable());
            BackOffContext policyContext = contextMap.get(policy);
            if (policyContext == null) {
                policyContext = policy.start(retryContext);
                contextMap.put(policy, policyContext);
            }
            policy.backOff(policyContext);
        }
    }

    private Classifier<Throwable, BackOffPolicy> exceptionClassifier =
            new ClassifierSupport<>(new NoBackOffPolicy());

    public void setPolicyMap(Map<Class<? extends Throwable>, BackOffPolicy> policyMap) {
        this.exceptionClassifier = new SubclassClassifier<>(policyMap, new NoBackOffPolicy());
    }
    @Override
    public BackOffContext start(final RetryContext context) {
        return new ExceptionClassifierBackoffContext(exceptionClassifier, context);
    }

    @Override
    public void backOff(final BackOffContext backOffContext) throws BackOffInterruptedException {
        ExceptionClassifierBackoffContext classifierBackOffContext = (ExceptionClassifierBackoffContext) backOffContext;
        classifierBackOffContext.backOff(backOffContext);
    }
}
```

## Main class

Now combining all of it, here's the main class.

```java
package com.abc;

import com.abc.config.ExceptionClassifierBackoffPolicy;
import com.abc.config.RestTemplateConfig;
import com.abc.config.RetryConfig;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

public class main {
    public static void main(String[] args) {
        RetryConfig retryConfig = new RetryConfig(new ExceptionClassifierBackoffPolicy());
        RestTemplateConfig restTemplate = new RestTemplateConfig();
        HttpEntity<String> resp = new HttpEntity<>(null);
        ResponseEntity<String> newResp =
                retryConfig.retryTemplate().execute(context -> restTemplate.restTemplate().exchange(
                        "https://abc-test" +
                                ".free" +
                                ".beeceptor" +
                                ".com/test/abc",
                        HttpMethod.GET,
                        resp,
                        String.class));
        System.out.println(newResp.getBody());
    }
}
```
