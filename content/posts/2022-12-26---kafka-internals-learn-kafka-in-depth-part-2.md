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
Let's get started by installing kafka. [Download](https://www.apache.org/dyn/closer.cgi?path=/kafka/3.3.1/kafka_2.13-3.3.1.tgz) the latest Kafka release and extract it. Open terminal and start the kafka.

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

Go to `/tmp/kafka-logs` directory and do `ls` we will see the below result.

```
cleaner-offset-checkpoint        payments-0    payments-3    payments-6     payments-9
log-start-offset-checkpoint      payments-1    payments-4    payments-7     recovery-point-offset-checkpoint
meta.properties                  payments-2    payments-5    payments-8     replication-offset-checkpoint
```

> `/tmp/kafka-logs` is the default directory where kafka stores the data. We can configure it to a different directory in `config/server.properties` for kafka and `config/zookeeper.properties` for zookeeper.

As we see from the above result, `payments-0` , `payments-1` .... `payments-10` are the partitions which are nothing but the directories in the filesystem. Topic is just a logical concept in kafka. It does not exist physically, only partitions does.

Now, let's produce some messages to the topic using the below command.

```shell
$ cd $HOME/kafka
$ bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic payments
> hello
> world
> hello world
> hey there!
```

We produced four messages to the topic. Let's see how they are stored in the filesystem. It's hard to find to which partition a message went to. The simple trick is to find the size of all partitions (directories) and pick the largest ones.

```shell
$ cd /tmp/kafka-logs
$ du -hs *
8.0K	payments-0
8.0K	payments-1
 12K	payments-2
8.0K	payments-3
 12K	payments-4
8.0K	payments-5
8.0K	payments-6
 12K	payments-7
8.0K	payments-8
 12K	payments-9
```

As we see from the above snippet, our messages went to partition 2, 4, 7 & 9. Let's see what's inside each of the partition.

```shell
$ ls payments-7

00000000000000000000.index     00000000000000000000.log
00000000000000000000.timeindex leader-epoch-checkpoint
partition.metadata
$ cat 00000000000000000000.log
=
��Mr���Mr����������������
world%
$ cat partition.metadata
version: 0
topic_id: tbuB6k_uRsuEE03FsechjA
$ cat leader-epoch-checkpoint
0
1
0 0
$ cat 00000000000000000000.index
$ cat 00000000000000000000.timeindex
```

### Log file

This is where the data written by the producers are stored in a binary format.