<?php
// APIのアクセス許可
header("Access-Control-Allow-Origin: *");

// DB接続
$file = '../status.sqlite';
$pdo = new PDO('sqlite:' . $file);

// 設定
// SQL実行時、エラーの代わりに例外を投げる
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// fetchAll時、カラム名をキーとする連想配列で取得
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

try {
  // 問い合わせ分岐
  $result;
  if (isset($_GET['year']) && isset($_GET['month'])) {
    // 通常のクエリ: 年月で日にちの登録状況を問い合わせ

    // SELECT文発行
    $sql = "SELECT * FROM status WHERE substr(date, 1, 7) = :date";
    // SQL実行
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':date' => $_GET['year'] . '-' . $_GET['month']
    ]);
    $result = $stmt->fetchAll();

  } else {
    // アイテム一覧を問い合わせ
    
    // SELECT文発行
    $sql = "SELECT * FROM items";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();
  }
    
  // JSON出力
  echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch(PDOException $error) {
  // エラー処理
  echo $error->getMessage() . PHP_EOL;

}
