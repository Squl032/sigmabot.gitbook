---
description: 設定自動化系統偵測字詞
---

# /setword

<mark style="color:orange;">`/setword`</mark> 指令中，可以設定很多自動化完成的操作，下面將會一一掩飾操作，括號內的內容是接續在 <mark style="color:orange;">`/setword`</mark> 後面的主要指令，指令介紹內的為可操作選項

1. 自動停權 (autoban)\
   • 用途: 自動停權發送禁止字詞的用戶\
   • 設定方式: 使用指令 <mark style="color:orange;">`/setword autoban`</mark> 可開始設置，透過 <mark style="color:orange;">`add`</mark> / <mark style="color:orange;">`remove`</mark> 可新增或移除禁止字詞\
   • 查看方式: `list` 可查看現有的禁止字眼
2. 黑名單 (blacklist)\
   • 用途: 自動刪除並警告發送黑名單字詞的用戶\
   • 設定方式: 使用指令 <mark style="color:orange;">`/setword blacklist`</mark> 可開始設置，透過 <mark style="color:orange;">`add`</mark> / <mark style="color:orange;">`remove`</mark> 可新增或移除黑名單字詞\
   • 查看方式: <mark style="color:orange;">`list`</mark> 可查看現有的黑名單字眼
3. 自動管理 (automod)\
   • 用途: 設定Discord內建自動管理 (AutoMod)\
   • 設定方式: 使用指令 <mark style="color:orange;">`/setword automod`</mark> 可開始設置，透過 <mark style="color:orange;">`flagged-words`</mark> / <mark style="color:orange;">`keyword`</mark> / <mark style="color:orange;">`mention-spam`</mark> / <mark style="color:orange;">`spam-messages`</mark> 添加自動管理規則\
   • 查看方式: 到 <mark style="color:blue;background-color:blue;">伺服器設定</mark> 查看 <mark style="color:red;background-color:red;">AutoMod</mark> 設定
