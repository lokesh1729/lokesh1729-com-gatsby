---
template: "post"
title: Database Migrations in Django
slug: "/migrations-in-django"
socialImage: "/media/django-migrations.png"
draft: false
date: "2023-02-08T17:54:21.570Z"
description: "Django gives a powerful framework to manage database migrations. We will deep dive into Django migrations and how they work under the hood"
category: "Software Engineering"
tags:
  - "software-engineering"
  - "python"
  - "django"
---
## Introduction

Django gives a powerful framework to manage database migrations. Without this, managing schema and data changes would be hectic work. Every schema change to the database can be managed through Django. You make a change to your Django model, create a migration and apply that migration to the database. If you want to reverse it, you can do that too. All this is irrespective of the underlying database technology. How simple, beautiful, and declarative isn't it? do you feel it? I can feel it. In this blog post, we will learn how Django migrations work under the hood, and Django's data migrations

## Why Migrations Are Required?

So, why are migrations required? what will happen without it? Let's say you are working on a Django application, and you make changes to your model but they are not synced to the database.

1. **Track SQL queries manually:** You need to execute them manually. But, what if you missed executing a query in between and caused a whole chaos? So, you need to track them in some place in a sequential manner. Where do you store it? maybe create a folder and add all `.sql` files there.
2. **Deploy in multiple environments:** Assume you want to deploy your app on multiple environments such as dev, QA, staging and production, etc... So, you need to execute all these queries manually on each machine in sequential order.

Django's migrations framework solved all the above problems and made it so convenient for users to manage them.

## Basics

In the below code, we have added a new field called `about` which is a type of `TextField` . So, After making this change in our models, we need to propagate this change to the database.

![Image showing migrations](/media/scr-20230208-h0m.png)

We need to create a migration and apply it. The commands are

```bash
python manage.py makemigrations # creates a migration file in `migrations` folder
python manage.py migrate # applies the migration to the database by exeucting SQL query
```

`makemigrations` command creates a migration file in `migrations` the folder. `migrate` the command applies that migration to the database through SQL. If we take a look at the migration file, it looks like this

```python
from django.db import migrations, models
class Migration(migrations.Migration):
    dependencies = [
        ('job', '0002_jobapplication'),
    ]
    operations = [
        migrations.AddField(
            model_name='company',
            name='about',
            field=models.TextField(
                    _("About Company"),
                    help_text=_(
                        "Write about the company. It will be displayed on the web page to the users."
                    ),
                  ),
    ]
```
Let's dissect the above code.
**Migration Class**: `Migration` is a class inherited `migrations.Migration` base class which has the mechanism to apply migrations.
**Dependencies:** It has an array `dependencies` where each item is a tuple of the app name and migration file name. It means that in order for this migration to be executed, the dependencies should be executed first.
*Why do dependencies are required? Imagine there are no dependencies, say you have a migration to delete or alter a field. Django connects to the database and tries to execute the SQL query but it will fail with* ``field `xyz` does not exist`` *error. Because you may have not run the query to add that column. So, dependencies are important to maintain the consistency of the database.*
**Operations:** is an array of operations. Adding a column, modifying a column and deleting a column, Adding a new table are common operations. Django's migration framework has these methods for each operation. Under the hood, those methods have the logic to generate SQL queries.
## Django Migrations 🤝 Graph Data Structure
In order for Django to apply migrations, it needs to know already applied migrations. So, it needs to store the state somewhere. Django stores the data in a table called `django_migrations` table with `app` , `name` and `applied` timestamp. Every time a migration is applied, it adds a new entry to the table in order. Also, Django uses [the graph data structure to check the consistency](https://sourcegraph.com/github.com/django/django@69069a443a906dd4060a8047e683657d40b4c383/-/blob/django/db/migrations/loader.py?L307) of the migrations. [It builds the graph of applied migrations and their dependencies](https://sourcegraph.com/github.com/django/django@69069a443a906dd4060a8047e683657d40b4c383/-/blob/django/db/migrations/loader.py?L222) (remember? we give `dependencies` for each migration) where each node is the migration name and the directed edge is the dependency. It [checks for any conflicts](https://sourcegraph.com/github.com/django/django@69069a4/-/blob/django/db/migrations/loader.py?L338&subtree=true) and raises an error if any.
### Conflicting migrations detected; multiple leaf nodes in the migration graph
The above error is a common error while applying migrations. It occurs when an app has multiple leaf nodes. This commonly happens when you are working in a team and multiple people create the migration simultaneously. Refer to the below diagram.
![Image showing migration conflicts in django](/media/scr-20230208-vux.png)
Assume that migration "22" is already applied, Person A had added a migration that adds location to the user model and Person B adds an avatar. Both of the migrations have "22" as the dependency. When Django tries to apply a migration, it doesn't know which one to apply first. What if one migration deletes a field and another migration alters the same field? So, it is impossible to choose a migration. So, that's how the conflict occurs for Django. How does this conflict get resolved? Simple, we need to merge them using the below command and create a single migration.
```bash
python manage.py makemigrations --merge
```
![Image showing conflict resolution of django migrations](/media/scr-20230208-w1k.png)
## Data Migrations
Along with database schema changes, we can create migrations for data too. First, we need to create a migration file with the below command.
```bash
python manage.py makemigrations job --empty --name load_job_data
```
We are creating an empty data migration which looks like below
```python
# Generated by Django 3.2.10 on 2023-02-08 17:39
from django.db import migrations
class Migration(migrations.Migration):
    dependencies = [
        ('job', '0004_alter_job_location'),
    ]
    operations = [
    ]
```
We need to add our custom function to seed data in the `operations` list. The function's name can be anything but it should have the following structure. We need to use Django's app registry API to access the models and operate on them as we see below.
```python
def load_job_data(apps, schema_editor):
    Job = apps.get_model("job", "Job")
    resp = requests.get("https://jobs.abc.com/api/v1/jobs")
    for datum in resp.data:
        Job.objects.create(url=datum.url, location=datum.location)
```