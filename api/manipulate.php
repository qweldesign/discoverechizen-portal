<?php
// DB接続
$file = '../status.sqlite';
$pdo = new PDO('sqlite:' . $file);

// 設定
// SQL実行時、エラーの代わりに例外を投げる
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// fetchAll時、カラム名をキーとする連想配列で取得
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

try {
  // SELECT文で日にちとアイテムが一致するレコードの有無を確認
  $sql = "SELECT date, item FROM status WHERE date = :date AND item = :item";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ':date' => $_POST['date'],
    ':item' => $_POST['item']
  ]);
  $result = $stmt->fetch();

  if ($result) {
    // 有り: UPDATE文
    $sql = "UPDATE status SET state = :state WHERE date = :date AND item = :item";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':date' => $_POST['date'],
      ':item' => $_POST['item'],
      ':state' => $_POST['state']
    ]);
  } else {
    // 無し: INSERT文
    $sql = "INSERT INTO status(date, item, state) VALUES (:date, :item, :state)";
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
