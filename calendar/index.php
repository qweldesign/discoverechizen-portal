<?php
// マスターデータ取得
include_once('../inc/functions.php');
$file = '../dep.sqlite';
$masterData = fetchMasters($file);

?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カレンダー | 教育旅行ポータル | 越前海岸盛り上げ隊</title>
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <h1 class="title">越前海岸盛り上げ隊教育旅行ポータル</h1>
        <ul class="subMenu">
          <li class="subMenu__item"><a href="../">トップ</a></li>
          <li class="subMenu__item"><a href="../reserve/">予約一覧</a></li>
        </ul>
        <main class="main --calendar">
          <div class="control">
            <select id="mode" class="mode" name="mode">
              <option value="0" selected>閲覧</option>
              <option value="1">編集</option>
            </select>
          </div>
          <div id="calendar" class="calendar">
            <div class="calendar__control">
              <a id="calendarPrev" class="calendar__prev" href="#">&lt; <span id="calendarPrevText"></span></a>
              <span id="calendarCurrentText"></span>
              <a id="calendarNext" class="calendar__next" href="#"><span id="calendarNextText"></span> &gt;</a>
            </div>
            <div class="calendar__viewWrap">
              <table class="calendar__view --large">
                <thead id="calendarHead"></thead>
                <tbody id="calendarBody"></tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    <script>
      window.masterData = <?php echo json_encode($masterData, JSON_UNESCAPED_UNICODE); ?>
    </script>
    <script src="./init.js" type="module"></script>
  </body>
</html>
