<?php

function executeQuery($file, $sql, $options = []) {
  // DB接続
  $pdo = new PDO('sqlite:' . $file);

  // 設定
  // SQL実行時、エラーの代わりに例外を投げる
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  // fetchAll時、カラム名をキーとする連想配列で取得
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

  try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($options);

    $result = $stmt->fetchAll();

    return $result;

  } catch(PDOException $error) {
    // エラー処理
    echo $error->getMessage() . PHP_EOL;

  }
}

function fetchStatus($file, $year, $month) {
  $sql = "SELECT * FROM v_status WHERE substr(date, 1, 7) = :date";
  $options = [
    ':date' => $year . '-' . sprintf('%02d', $month)
  ];

  return executeQuery($file, $sql, $options);
}

function insertState($file, $date, $item, $state) {
  $sql = "INSERT INTO t_status(date, item, state) VALUES (:date, :item, :state)";
  $options = [
    ':date' => $date,
    ':item' => $item,
    ':state' => $state
  ];

  return executeQuery($file, $sql, $options);
}

function insertMaster($file, $item) {
  // アイテムIDにより、照会分岐
  $target = $item < 1000 ? 'activities' : 'facilities';
  $table = 'm_' . $target;
  $id = $item < 1000 ? $item : $item - 1000;

  $arr = makeFieldNameArr($target);
  // INTO句、VALUES句
  $into = '';
  $vals = '';
  forEach ($arr as $key) {
    $into .= isset($_POST[$key]) ? $key . ', ' : '';
    $vals .= isset($_POST[$key]) ? '"' . $_POST[$key] . '", ' : '';
  }
  $into = substr($into, 0, -2);
  $vals = substr($vals, 0, -2); // ', '除去

  // SQL文発行
  $sql = "INSERT INTO $table ($into) VALUES ($vals)";

  return executeQuery($file, $sql);
}

function updateMaster($file, $item) {
  // アイテムIDにより、照会分岐
  $target = $item < 1000 ? 'activities' : 'facilities';
  $table = 'm_' . $target;
  $id = $item < 1000 ? $item : $item - 1000;
  
  // SET句
  $arr = makeFieldNameArr($target);
  $vals = '';
  forEach ($arr as $key) {
    $vals .= isset($_POST[$key]) ? $key . ' = "' . $_POST[$key] . '", ' : '';
  }
  $vals = substr($vals, 0, -2); // ', '除去

  // SQL文発行
  $sql = "UPDATE $table SET $vals WHERE id = :id";
  $options = [
    ':id' => $id
  ];

  return executeQuery($file, $sql, $options);
}

function makeFieldNameArr($target) {
  $arr1 = [
    'activities' => [
      'name',
      'fullname',
      'company',
      'type',
      'sdgs_summary',
      'capacity',
      'duration',
      'message'
    ],
    'facilities' => [
      'name',
      'fullname',
      'capacity',
      'message'
    ]
  ];

  $arr2 = [];
  for ($i = 0; $i < 12; $i++) {
    array_push($arr2, 'reception_month_' . str_pad($i, 2, '0', STR_PAD_LEFT));
  }
  for ($i = 0; $i < 7; $i++) {
    array_push($arr2, 'reception_week_' . $i);
  }

  $arr = array_merge($arr1[$target], $arr2);
  return $arr;
}
