# 問題2

家族を意味する次の情報をJSONで表現してください。

- 居住地(address):東京都品川区北品川4-7-35 御殿山トラストタワー7F
- 父親(father):
   - 姓(family_name):びーのす
   - 名(first_name):太郎
   - 生年月日(birth_date):1999-11-25
   - 性別(gender):男
- 母親(mother):
   - 姓(family_name):びーのす
   - 名(first_name):花子
   - 生年月日(birth_date):1999-12-31
   - 性別(gender):女
- 子(children):
   - 姓(family_name):びーのす
   - 名(first_name):洋子
   - 生年月日(birth_date):2015-12-19
   - 性別(gender):女
   - ---見やすくするために区切り。子は配列で表現すること。本項目はコメントとして無視すること---
   - 姓(family_name):びーのす
   - 名(first_name):一郎
   - 生年月日(birth_date):2017-04-01
   - 性別(gender):男

# 回答

```
{
  "address"  : "東京都品川区北品川4-7-35 御殿山トラストタワー7F",
  "father"   : {
    "family_name" : "びーのす",
    "first_name"  : "太郎",
    "birth_date"  : "1999-11-25",
    "gender"      : "男"
  },
  "mother"   : {
    "family_name" : "びーのす",
    "first_name"  : "花子",
    "birth_date"  : "1999-12-31",
    "gender"      : "女"
  },
  "children" : [
    {
      "family_name" : "びーのす",
      "first_name"  : "洋子",
      "birth_date"  : "2015-12-19",
      "gender"      : "女"
    },
    {
      "family_name" : "びーのす",
      "first_name"  : "一郎",
      "birth_date"  : "2017-04-01",
      "gender"      : "男"
    }
  ]
}
```