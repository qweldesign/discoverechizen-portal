<?php
// DB接続
$file = '../dep.sqlite';
$pdo = new PDO('sqlite:' . $file);

// 設定
// SQL実行時、エラーの代わりに例外を投げる
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// fetchAll時、カラム名をキーとする連想配列で取得
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

try {
  if (isset($_POST['date']) && isset($_POST['item']) && isset($_POST['state'])) {
    // INSERT文発行
    $sql = "INSERT INTO t_status(date, item, state) VALUES (:date, :item, :state)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':date' => $_POST['date'],
      ':item' => $_POST['item'],
      ':state' => $_POST['state']
    ]);
  }

} catch(PDOException $error) {
  // エラー処理
  echo $error->getMessage() . PHP_EOL;

}
