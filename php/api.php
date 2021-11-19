<?php
include_once('./functions.php');

$file = '../dep.sqlite';
$method = $_GET['method'];
$target = $_GET['target'];

// ステータスの問い合わせ
if ($method === 'fetch') {
  // APIのアクセス許可
  header("Access-Control-Allow-Origin: *");
  
  $result;

  if ($target === 'status') {
    // SQL文発行
    $year = isset($_GET['year']) ? $_GET['year'] : date('Y');
    $month = isset($_GET['month']) ? $_GET['month'] : date('n');
    // 実行
    $result = fetchStatus($file, $year, $month);

  } else if ($target === 'master' || $target === 'activities' || $target === 'facilities') {
    // SQL文発行
    if ($target === 'master') {
      $target = 'v_' . $target;
    } else {
      $target = 'm_' . $target;
    }
    $sql = "SELECT * FROM $target";
    // 実行
    $result = executeQuery($file, $sql);

  }
  
  // JSON出力
  echo json_encode($result, JSON_UNESCAPED_UNICODE);
  return;
}

// ステータスの挿入
if ($method === 'insert' && $target === 'status') {
  if (isset($_POST['date']) && isset($_POST['item']) && isset($_POST['state'])) {
    insertState($file, $_POST['date'], $_POST['item'], $_POST['state']); 
  }

  return;
}

// マスターの挿入
if ($method === 'insert' && $target === 'master') {
  if (isset($_POST['item'])) {
    insertMaster($file, $_POST['item']);
  }

  echo 'success';
  return;
}

// マスターの更新
if ($method === 'update' && $target === 'master') {
  if (isset($_POST['item'])) {
    updateMaster($file, $_POST['item']);
  }

  echo 'success';
  return;
}
