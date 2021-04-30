
---
title: AWS Glue のローカル開発環境をセットアップする
date: 2021-04-25
---

この手順です→ https://aws.amazon.com/jp/blogs/big-data/developing-aws-glue-etl-jobs-locally-using-a-container/ 。

AWS Glue はDatalake アーキテクチャにおいてETLに位置づけられる、AWS Glue の紹介についてはBlack Beltの動画がわかりやすいです。

あと本もあります。

（私はBoothで買いました）

[AWS Glue コンソール](https://ap-northeast-1.console.aws.amazon.com/glue/home?region=ap-northeast-1#) からぽちぽちやってもできるのですがお金かかるし、
今回は[公式のdocker image](https://hub.docker.com/r/amazon/aws-glue-libs/tags?page=1&ordering=last_updated)を利用してローカル開発環境を構築してみます。

こちらは以下のツールがこみこみになっています。インストールが必要なくて便利ですな。
- JDK, Python Spark
- [AWS Glue SDK](https://github.com/awslabs/aws-glue-libs)
- [Jupyter Notebook](https://jupyter.org/) [Zeppelin](https://zeppelin.apache.org/)

とりあえず、`Jupyter Notebook` を起動してみます。

```
docker pull amazon/aws-glue-libs:glue_libs_1.0.0_image_01
docker run -itd -p 8888:8888 -p 4040:4040 -v ~/.aws:/root/.aws:ro --name glue_jupyter amazon/aws-glue-libs:glue_libs_1.0.0_image_01 /home/jupyter/jupyter_start.sh
```

（図）

なんか動いた！ Notebook開いてみるか…。[notebook1.ipynb]()。

```
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("sample").getOrCreate()

text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
words = spark.sparkContext.parallelize(text.split(" "))
wc = words.map(lambda w: (w, 1)).reduceByKey(lambda a,b:a +b)
print(wc.collect())
```

お、Spark(Scala)も動かしてみる。こちらはファイルから。

```
import org.apache.spark.SparkContext._

import org.apache.spark.SparkFiles
spark.sparkContext.addFile("https://s3.amazonaws.com/amazon-reviews-pds/tsv/amazon_reviews_multilingual_JP_v1_00.tsv.gz")

val df = spark.read.option("delimiter", "\t").option("header", true).csv("file://"+SparkFiles.get("amazon_reviews_multilingual_JP_v1_00.tsv.gz"))

df.head(1)

val grouped = df.groupBy("product_id")
grouped.agg(avg($"star_rating").alias("avg_rating")).show()
```

AWS Glue 由来のものも動くのを確認。S3からとってきて、[Dynamic Frame](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/aws-glue-api-crawler-pyspark-extensions-dynamic-frame.html)とかが使える。

```
from pyspark import SparkContext
from awsglue.context import GlueContext

glueContext = GlueContext(SparkContext.getOrCreate()) 
inputDF = glueContext.create_dynamic_frame_from_options(connection_type = "s3", connection_options = {"paths": ["s3://awsglue-datasets/examples/us-legislators/all/memberships.json"]}, format = "json")
inputDF.toDF().show()
```

