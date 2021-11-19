<?php
// マスターデータ取得
include_once('./inc/functions.php');
$file = './dep.sqlite';
$masterData = fetchMasters($file);

?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>トップ | 教育旅行ポータル | 越前海岸盛り上げ隊</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <h1 class="title">越前海岸盛り上げ隊教育旅行ポータル</h1>
        <main class="main">
          <nav class="nav">
            <ul class="nav__menu">
              <li class="nav__menuItem"><a href="#" data-toggle="modal" data-target="1">盛り上げ隊とは</a></li>
              <li class="nav__menuItem"><a href="#" data-toggle="modal" data-target="2">教育旅行について</a></li>
              <li class="nav__menuItem"><a href="#" data-toggle="modal" data-target="3">地域動画再生</a></li>
              <li class="nav__menuItem"><a href="#" data-toggle="modal" data-target="4">体験動画再生</a></li>
              <li class="nav__menuItem"><a href="#" data-toggle="modal" data-target="5">体験一覧</a></li>
              <li class="nav__menuItem"><a href="./assets/studytour.pdf">体験概要</a></li>
              <li class="nav__menuItem"><a href="./assets/map.pdf">エリアマップ</a></li>
            </ul>
          </nav>
          <div class="schedule">
            <div class="schedule__header">
              <h3 class="schedule__caption">予約状況</h3>
              <div class="control">
                <select id="select" class="select" name="select">
                  <?php foreach ($masterData as $data) { ?>
                    <option value="<?php echo $data['id']; ?>"><?php echo $data['name']; ?></option>
                  <?php } ?>
                </select>
                <select id="mode" class="mode" name="mode">
                  <option value="0" selected>閲覧</option>
                  <option value="1">編集</option>
                </select>
              </div>
            </div>
            <div class="schedule__main">
              <div id="calendar" class="calendar">
                <div class="calendar__control">
                  <a id="calendarPrev" class="calendar__prev" href="#">&lt; <span id="calendarPrevText"></span></a>
                  <span id="calendarCurrentText"></span>
                  <a id="calendarNext" class="calendar__next" href="#"><span id="calendarNextText"></span> &gt;</a>
                </div>
                <table class="calendar__view --small">
                  <thead id="calendarHead"></thead>
                  <tbody id="calendarBody"></tbody>
                </table>
                <ul class="subMenu">
                  <li class="subMenu__item"><a href="./reserve/">予約一覧</a></li>
                  <li class="subMenu__item"><a href="./calendar/">大カレンダー</a></li>
                </ul>
            </div>
            </div>
            <ul class="schedule__menu">
              <li class="schedule__menuItem"><a href="https://trello.com/b/uFRivoqz/" target="_blank">管理画面</a></li>
              <li class="schedule__menuItem"><a href="https://www.facebook.com/messages/" target="_blank">メンバーとチャットする</a></li>
            </ul>
          </div>
          <div id="modal" class="modal --collapse">
            <div id="modalInner" class="modal__inner --hide"></div>
          </div>
          <a id="modalClose" class="modal__close" href="#" data-toggle="modal"><span data-icon="ei-close" data-size="l"></span></a>
          <a id="modalPrev" class="modal__prev" href="#" data-slide="-1"><span data-icon="ei-chevron-left" data-size="l"></span></a>
          <a id="modalNext" class="modal__next" href="#" data-slide="1"><span data-icon="ei-chevron-right" data-size="l"></span></a>
          <div id="modalOverlay" class="modal__overlay --collapse" data-toggle="modal"></div>
          <div id="modalContent" class="modal__content">
            <section class="section" data-index="1">
              <div class="section__inner">
                <h2 class="section__heading">越前海岸盛り上げ隊って？</h2>
                <img class="section__image --lg" src="./assets/members.jpg">
                <p class="section__content">越前海岸盛り上げ隊は、越前海岸の「いま」をできるだけ面白くしようと奮闘する大人たちのゆるやかな集まりです。海鮮料理屋、旅館や民宿、クラゲ販売店、製粉屋、製塩所、林業家、ガラス作家、お坊さん、デザイナーやプログラマー、地域おこし協力隊など、30以上の事業者と個人が名を連ね、その時々でそれぞれにできることを差し出し合いながら、日々活動を続けています。</p>
              </div>
            </section>
            <section class="section" data-index="2">
              <div class="section__inner">
                <h2 class="section__heading">越前海岸の学習プログラムで自由に研究しよう！</h2>
                <img class="section__image --md" src="./assets/island.png">
                <p class="section__content">ここで仕事をしている人は、地域の暮らしに密着して過ごしています。彼らの仕事を知ることで社会への興味、地域の色を発見し、地域の「理解と学び」につなげます。体験を通して、越前海岸で働く人々や、作家さんによる想いにぜひ触れてみてください。私たちが企画から運営、当日のお世話まですべてプランニングします。</p>
              </div>
            </section>
            <section class="section" data-index="3">
              <video src="./assets/about.mp4" controls></video>
            </section>
            <section class="section" data-index="4">
              <video src="./assets/activity.mp4" controls></video>
            </section>
          </div>
        </main>
      </div>
    </div>
    <script>
      window.masterData = <?php echo json_encode($masterData, JSON_UNESCAPED_UNICODE); ?>;
    </script>
    <script src="./init.js" type="module"></script>
  </body>
</html>
