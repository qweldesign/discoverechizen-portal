<?php

function fetchMasters($file) {
  // DB接続
  $pdo = new PDO('sqlite:' . $file);

  // 設定
  // SQL実行時、エラーの代わりに例外を投げる
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  // fetchAll時、カラム名をキーとする連想配列で取得
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

  try {
    // SELECT文発行
    $sql = "SELECT * FROM v_masters";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();

    return $result;

  } catch(PDOException $error) {
    // エラー処理
    echo $error->getMessage() . PHP_EOL;

  }
}
