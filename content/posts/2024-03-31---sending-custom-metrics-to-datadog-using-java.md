---
template: post
title: Sending custom metrics to datadog using java
slug: sending-custom-metrics-to-datadog-java
socialImage: /media/sending-custom-metrics-to-datadog.png
draft: false
date: 2024-03-31T08:29
description: Datadog is an application monitoring software. It instruments the
  application code and shows different metrics and charts to the developer.
  There can be usecases to send custom metrics data to datadog.
category: software engineering
---
Datadog is an application monitoring software. It instruments the application code and shows different metrics and charts to the developer. Sometimes, there can be instances to send custom metrics. First of all, what is a metric? metric is anything that can be measurable. There are 4 types of metrics in OpenMetrics i.e. counter, gauge, histogram, and summary. Learn more about them in [prometheus documentation](https://prometheus.io/docs/tutorials/understanding_metric_types/).

Datadog provides different kinds of agents for the operating system and application code supporting many languages.