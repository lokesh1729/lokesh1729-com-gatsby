---
template: post
title: Kafka Internals - Learn kafka in-depth (Part-2)
slug: kafka-internals-learn-kafka-in-depth-part-2
socialImage: /media/learn-kafka-in-depth.png
draft: true
date: 2022-03-15T04:55:02.399Z
description: In my previous post, we learned about the basics of kafka. In this
  post, let's deep dive into the internals of kafka. How it is designed in such
  a way that it is highly scalable.
category: software engineering
tags:
  - kafka
  - message-queues
  - distributed-systems
  - system-design
---
Let's get started by installing kafka. [Download](https://www.apache.org/dyn/closer.cgi?path=/kafka/3.3.1/kafka_2.13-3.3.1.tgz) the latest Kafka release and extract it. Open your terminal and start the kafka.

```shell
$ cd $HOME
$ tar -xzf kafka_<version>.tgz
$ cd kafka_<version>
$ bin/zookeeper-server-start.sh config/zookeeper.properties
# open another terminal session and start kafka
$ bin/kafka-server-start.sh config/server.properties
# Open another terminal and create a topic.
$ bin/kafka-topics.sh --create --topic payments --partitions 10 --replication-factor 1 \
 --bootstrap-server localhost:9092
```

Now let's see what happens under the hood. 

Go to `/tmp/kafka-logs` directory and do `ls` you will see the below result.

```
cleaner-offset-checkpoint        payments-0    payments-3    payments-6     payments-9
log-start-offset-checkpoint      payments-1    payments-4    payments-7     recovery-point-offset-checkpoint
meta.properties                  payments-2    payments-5    payments-8     replication-offset-checkpoint
```

> `/tmp/kafka-logs` is the default directory where kafka stores the data. You can configure it to a different directory in `config/server.properties` for kafka and `config/zookeeper.properties` for zookeeper.

As we see from the above result, `payments-0` , `payments-1` .... `payments-10` are the partitions which are nothing but the directories in the filesystem. Topic does not exist physically in kafka, only partitions does. Topic is a logical concept combining all the partitions.