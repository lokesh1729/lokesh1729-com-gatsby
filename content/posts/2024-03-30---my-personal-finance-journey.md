---
template: post
title: My personal finance journey
slug: my-personal-finance-journey
socialImage: /media/my-personal-finance-journey.png
draft: false
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
![cover image](/media/my-personal-finance-journey.png "cover image")

Managing finance is a hard job. If you are working at a company or self-employed, you need to be aware of the inflows and outflows of your money. Because you have done a lot of hard work at the job and earned that money, I will be discussing my personal finance journey.

### Walnut App

I started my career in 2015. I used to get a small cheque every month. I kept some money myself and sent some to the home. My uncle had suggested investing in local chit funds in my hometown, so I used to invest in it. I used [Walnut app](https://axio.co.in/walnut/) (now Axio) to track the expenses. It auto-tracks the transactions and gives me nice analytics too. It was not tracking the income at that time, so I used to have a dilemma as to whether to mark investments as expenses or not.

Walnut wasn't answering all the questions I had. It only displays the transactions and a bar chart. If I want to create a custom view or dashboard, it doesn't support it. Also, I moved from Android to iPhone. Walnut doesn't support auto-tracking transactions as the iPhone doesn't allow reading messages. So, I need to look for another solution.

### Spreadsheets

I created a [spreadsheet template](https://docs.google.com/spreadsheets/d/107jTWsyzDal5dUOaaP8rXidnaolxMn0WzVgKuCIYzME/edit#gid=1090004693) to track the expenses. It solved the problems that I had with walnut. I can create a pivot table to view the summary and create charts for the analytics. But, then I faced one problem. Editing experience in mobile apps is not great. I found [appsheet.com](https://about.appsheet.com/home/) which gives us the UX layer on top of Google Sheets. It has a mobile app too.[](https://about.appsheet.com/home/)

After a few months, something irked me a lot. I felt the editing experience on the web was also not that great. Also, the querying capabilities are not great. I want[](https://about.appsheet.com/home/) to query my data with multiple filters but we can't do that easily unless using functions. But, I am not an expert in Excel. Also, Google Sheets cannot handle bulk data. I imported all my bank transactions of thousand rows; the navigation and filtering were very slow.

### Databases

As Google Sheets is not working well, I thought of using a database itself. They solve the problems with sheets. I can write complex queries to visualize the data. Editing would be as easy as writing SQL queries or we can use database UI tools. And, databases can handle bulk data.

So, the question was where to host this database. Should I host on my personal computer or the cloud? well, I want it to be in the cloud because I need mobile access. So, I bought a 4GB RAM, 2 vCPU machine through [hetzner](https://www.hetzner.com) — they provide cloud machines at 50% lower prices than others like Digitalocean, vultr, etc... — It cost me Rs. 600 per month.

I installed Postgresql in it and opened port 5432 to the public. Voila! I can connect to the database. I imported my custom spreadsheet and all my bank transactions as well.

Then, I installed [metabase](https://www.metabase.com/docs/latest/configuring-metabase/setting-up-metabase) in it — as they said in their GitHub README, it just took only 5 minutes to set up — I quickly created some dashboards in it. Woohoo! 🥳 this is what I wanted. I have created dashboards for all the questions I wanted answers to. If I started with database and metabase at the beginning, it would have been an overkill. Since I tried other options and came here, never thought I was complicating it. It solved my problem.

Then, I wanted a UI layer on top of my database so that I could add the transactions on the go. I found some no-code tools like [appsmith](https://www.appsmith.com?ref=lokesh1729.com), [retool](https://retool.com?ref=lokesh1729.com), etc... I went ahead with Appsmith and set up my database. It has presets of default data tables and forms. I just had to make some customizations like adding dropdown values via SQL queries.

## Creating a personal finance system

Well, After setting up the database, I have created a table for tracking the transactions manually. The schema of the table would look like this.

```
CREATE TABLE public.transactions (

txn_date date NOT NULL,

account public."account_type" NOT NULL,

txn_type public."txn_enum_type" NOT NULL,

txn_amount float8 NOT NULL,

category public."txn_category_type" NOT NULL,

tags text DEFAULT ''::text NOT NULL,

notes text DEFAULT ''::text NOT NULL,

created_at timestamptz DEFAULT now() NOT NULL,

updated_at timestamptz NULL,

id serial4 NOT NULL,

CONSTRAINT transactions_pk PRIMARY KEY (id),

CONSTRAINT transactions_unique UNIQUE (txn_date, account, txn_type, txn_amount, category, tags, notes)
);
```



Then, I went to my bank's net banking, exported the data into CSV, and imported it into the database. Similarly, I did this for credit cards. There's a caveat. Not all credit cards give the data in CSV, only HDFC Bank via mobile app gives it. For others, converting from PDF to CSV is a challenge. So, I found this software called [tabula](https://github.com/tabulapdf/tabula). When you run this, it will open a UI at port 8080. We need to upload the PDF, select the table we want to capture manually, select stream or lattice in the extraction method, and export it to CSV.

Then, I went to investments. Downloaded mutual funds transaction data from [CAMS](https://www.camsonline.com/Investors/Statements/Transaction-Details-Statement) and [Kfintech](https://mfs.kfintech.com/investor/General/AccountStatement). There's a caveat. The CSV format is not uniform for both. So, I have written a [Python script](https://gist.github.com/lokesh1729/675468e1ae98e6e4dde3d9119573c67a) for converting Kfintech data to CAMS. Similarly, I downloaded and imported the capital gains data from [CAMS](https://www.camsonline.com/Investors/Statements/Capital-Gain&Capital-Loss-statement) and [Kfintech](https://mfs.kfintech.com/investor/General/CapitalGainsLossAccountStatement). Also, I downloaded my stock transaction data, and dividends data from Zerodha and imported them into my database.

The next question is, how often do I update this data? well, I do a quick review of my finances every 2-3 months by downloading my primary bank statements, and credit card statements. I enter the important transactions, and expenses into my \`transactions\` table by category and tags. Then, I import the data into the database. I import my investment data every 6 months or so.

 Here are some of the screenshots from my metabase.

![Image showing line chart of credit card transactions](/media/metabase-credit-cards.png "HDFC and SBI credit card spend trend by month")

HDFC and SBI credit card spend trend by month

![An image showing pivot table in metabase](/media/metabase-pivot-table.png "Pivot table on transactions table that I track manually")

Pivot table on transactions table that I track manually.

![An image showing fastag transactions](/media/metabase-fastag.png "I even imported the fastag transaction data 😂")

I even imported the fastag transaction data 😂

Unfortunately, I cannot disclose more information than this. Of course, I have so many dashboards.

That's all folks! hope you have enjoyed reading this blog. Please comment on how you manage your finances. Thanks for reading!
