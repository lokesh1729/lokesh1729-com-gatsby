---
template: post
title: My personal finance journey
slug: my-personal-finance-journey
socialImage: /media/my-personal-finance-journey.png
draft: true
date: 2024-03-30T03:20:43.096Z
description: Managing finances is a hard job. You need to know how you are
  spending and investing money. I have used several methods since the beginning
  of my career such as the Walnut app, spreadsheets and databases, and metabase.
  I migrated to a different solution each time I found disadvantages in the
  existing solution.
category: personal finance
tags:
  - finance
---
Managing finance is a hard job. If you are working at a company or self-employed, you need to be aware of the inflows and outflows of your money. Because you have done a lot of hard work at the job and earned that money. I will be discussing my personal finance journey.

### Walnut App

I started my career in 2015. I used to get a small cheque every month. I kept some money myself and sent some to the home. My uncle had suggested investing in local chit funds in my hometown, so I used to invest in it. I used [Walnut app](https://axio.co.in/walnut/) (now Axio) to track the expenses. It auto-tracks the transactions and gives me nice analytics too. It was not tracking the income at that time, so I used to have a dilemma as to whether to mark investments as expenses or not.

Walnut wasn't answering all the questions I had. It only displays the transactions and a bar chart. If I want to create a custom view or dashboard, it doesn't support it. Also, I moved from Android to iPhone. Walnut doesn't support auto-tracking transactions as the iPhone doesn't allow reading messages. So, I need to look for another solution.

### Spreadsheets

I created a [spreadsheet template](https://docs.google.com/spreadsheets/d/107jTWsyzDal5dUOaaP8rXidnaolxMn0WzVgKuCIYzME/edit#gid=1090004693) to track the expenses. It solved the problems that I had with walnut. I can create a pivot table to view the summary, create charts for the analytics. But, then I faced one problem. Editing experience in mobile app is not great. I found [appsheet.com](https://about.appsheet.com/home/) which gives us the UX layer on top of google sheets. It has a mobile app too.[](https://about.appsheet.com/home/)

After a few months, something is irking me alot. I felt the editing experience in web is also not that great. Also, the querying capabilities are not great. I want[](https://about.appsheet.com/home/) to query my data with multiple filters but we can't do that easily unless using functions. But, I am not an expert in excel. And also, google sheets cannot handle bulk data. I imported all my bank transactions which are of thousand rows, the navigation, filtering was very slow.

### Databases

As google sheets is not working well, I thought of using a database itself. They solve the problems with sheets. I can write complex queries to visualise the data. Editing would be as easy as writing SQL queries or we can use database UI tools. And, databases can handle bulk data.

So, the question was where to host this database. Should I host in my personal computer or cloud? well, I want it to be in cloud because I need mobile access. So, I bought a 4GB RAM, 2 vCPU machine through [hetzner](https://www.hetzner.com) — they provide cloud machines at 50% lower prices than others like digitalocean, vultr etc... — It costed me Rs. 600 per month.

I installed postgresql in it and opened the port 5432 to the public. Voila! I am able to connect to the database. I imported my custom spreadsheet and all my bank transactions as well.

Then, I installed [metabase](https://www.metabase.com/docs/latest/configuring-metabase/setting-up-metabase) in it — as they said in their github README, it just took only 5 minutes to setup — I quickly created some dashboards in it. Wohooo! 🥳 this is what I wanted. I have created dashboards for all the questions I wanted answers for. If I started with database and metabase at the beginning, it would have been a overkill. Since I tried other options and came here, never thought I am complicating it. In fact, it solved my problem.
