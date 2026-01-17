# 越前海岸盛り上げ隊教育旅行ポータル

越前海岸エリアでの教育旅行受入のための管理システム  
PHP / JS によるフルスクラッチ  

2022年4月から運用を開始していたが, 現在は諸事情により運用を休止中  
ソースコードの開示許可を得て, 閲覧目的のために公開  

---

## 主な機能

- 各種体験予約管理 (メイン機能)
- メインカレンダー表示 (APIを使用し、様々な情報を集約)
- 年間予約内容レポート作成
- 越前海岸盛り上げ隊の紹介コンテンツ
- 越前海岸盛り上げ隊の紹介動画
- 体験・農家民宿の紹介文
- 体験一覧・概要
- エリアマップ表示

---

## 実装内容

- Calendar をスクラッチ
- Trello とのAPI連携でカレンダーに予定を出力
- 体験ごとの月別予約状況 / 月別の各種体験予約状況 を切替可能
- SQLiteで体験/日付ごとの状態を管理
- APIをスクラッチし、体験/日付ごとのデータの取得・更新を行う
- Router / Modal をスクラッチ
- hash の変更を検知してコンテンツを切替
- GoogleスプレッドシートとのAPI連携でレポートを出力

---

## 著作権 | Copyright (C)

Copyright (C) 2026 QWEL.DESIGN  
All rights reserved.  

このリポジトリは閲覧目的のために公開されています。  
コードの改変、再配布、再利用は、明示的な許可なしには認められていません。  

This repository is published for viewing purposes only.  
Modification, redistribution, or reuse of any part of this code is not permitted without explicit permission.  

---

## 制作者 | Author

[QWEL.DESIGN](https://qwel.design)  
福井を拠点に活動するフロントエンド開発者  
Front-end developer based in Fukui, Japan  
