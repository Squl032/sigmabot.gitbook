---
description: 設定自動化系統頻道
---

# /setchannel

<mark style="color:orange;">`/setchannel`</mark> 指令中，可以設定很多自動化完成的操作，下面將會一一掩飾操作，括號內的內容是接續在 <mark style="color:orange;">`/setchannel`</mark> 後面的主要指令，指令介紹內的為可操作選項

1.  防洗版頻道 (anti-spam)\
    • 用途: 防止洗版

    • 設定方式: 使用指令 <mark style="color:orange;">`/setchannel anti-spam`</mark> 可開始設置，透過 <mark style="color:orange;">`add`</mark> / <mark style="color:orange;">`remove`</mark> 新增或移除頻道\
    • 查看方式: <mark style="color:orange;">`list`</mark> 查看現有的頻道
2. 防邀請忽略頻道 (anti-invite)\
   • 用途: 防止他服邀請鏈接\
   • 設定方式: 使用指令 <mark style="color:orange;">`/setchannel anti-invite`</mark> 可開始設置，透過 <mark style="color:orange;">`add`</mark> / <mark style="color:orange;">`remove`</mark> 新增或移除忽略頻道\
   • 查看方式: <mark style="color:orange;">`list`</mark> 查看現有頻道
3. 管理日誌 (modlog) \
   • 用途: 紀錄使用本機器人的管理操作\
   • 設定方式: 使用指令 <mark style="color:orange;">`/setchannel modlog`</mark> 可開始設置，透過 <mark style="color:orange;">`set`</mark> / <mark style="color:orange;">`remove`</mark> 指定或移除日誌頻道\
   • 查看方式: <mark style="color:orange;">`show`</mark> 查看日誌頻道
4. 檢舉 (report)\
   • 用途: 當檢舉被發送時會記錄的頻道\
   • 設定方式: 使用指令 <mark style="color:orange;">`/setchannel report`</mark> 可開始設置，透過 <mark style="color:orange;">`set`</mark> / <mark style="color:orange;">`remove`</mark> 指定或移除檢舉後顯示頻道\
   • 查看方式: <mark style="color:orange;">`show`</mark> 查看檢舉後顯示頻道
5. 建議 (suggest)\
   • 用途: 讓成員提供建議\
   • 設定方式: 使用指令 <mark style="color:orange;">`/setchannel suggest`</mark> 可開始設置，透過 <mark style="color:orange;">`add`</mark> / <mark style="color:orange;">`remove`</mark> 新增或移除建議頻道\
   • 查看方式: 在非建議頻道使用建議指令 <mark style="color:orange;">`/suggest`</mark>&#x20;
6. 停權申訴 (ban-appeal)\
   • 用途: 在指定頻道發送申訴用按鈕及訊息，提供主群停權用戶申訴禁令\
   • 設定方式: 使用指令 <mark style="color:orange;">`/setchannel ban-appeal`</mark> 可開始設置，透過 <mark style="color:orange;">`send`</mark> 設定要發出按鈕訊息的頻道及公布解除禁令的訊息頻道

_**以上指令可設置系統頻道，如有出現問題請到**_ [_**支援群組**_](https://discord.gg/dnvKBk6V4y) _**尋找開發人員求助。**_
