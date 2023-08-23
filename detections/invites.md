---
description: 他服邀請鏈接判定及相關權限給予
---

# 防邀請

> 如伺服器有設置自訂邀請鏈接代碼 (`Custom Invite Link` , `Vanity Code`)，需要授予 `Manage Server` (`管理伺服器`) 權限才可讓機器人取得並判定，在設定忽略頻道內不進行偵測

* 訊息內如果出現 <mark style="color:blue;">`discord.gg/`</mark> 或 <mark style="color:blue;">`discord.com/invite/`</mark> 且來源並非於當前伺服器，就會判定為他服邀請鏈接，如果鏈接後方代碼為自訂代碼，需要授予相關權限才可以取得當前伺服器是否擁有自訂代碼
  * <mark style="color:yellow;">注意: 系統無法直接判定訊息內是否存在單獨出現的代碼</mark>
