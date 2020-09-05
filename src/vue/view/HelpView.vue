<template>
  <section class="help-view">
    <div class="container">
      <section class="help-section">
        <h2 class="title">작동 환경</h2>
        <p>
          본 사이트는 <strong>2020년 이후에 출시된 최신 버전</strong>의 Mozilla Firefox, Google Chrome, Microsoft Edge, Apple Safari 등의 브라우저를 지원합니다.<br>
          본 사이트는 <strong>디스플레이 너비 1280px</strong> 이상의 환경에서 원활하게 사용 가능하도록 최적화되어 있습니다.
        </p>
        <p></p>
      </section>

      <section class="help-section">
        <h2 class="title">스킬포인트란 무엇인가요?</h2>
        <p>
          스킬포인트란 <a href="https://gall.dcinside.com/board/lists?id=ez2djmax" target="_blank">디시인사이드 디제이맥스 갤러리</a>에서 유저에 의해 만들어진 DJMAX RESPECT V 실력 측정 중 하나입니다.<br>
          본 사이트에서 제공하는 스킬포인트 기능은 <a href="https://gall.dcinside.com/board/view/?id=ez2djmax&no=168704">DJMAX RESPECT V 스킬포인트 1.4</a>를 기반으로 제작되었습니다.
        </p>
      </section>

      <section class="help-section">
        <h2 class="title">스킬포인트는 어떻게 계산하나요?</h2>
        <ol>
          <li>상단에 위치한 <strong>SCORE INPUT</strong>을 클릭하여 점수 입력 페이지로 이동합니다.</li>
          <li>데이터를 입력하고자 하는 버튼과 곡의 카테고리를 클릭합니다.</li>
          <li>표시되는 표에 각 패턴의 정확도, MAX COMBO 여부를 체크합니다.</li>
          <li>공식에 따라 각 곡에서 가장 높은 스킬포인트를 획득한 패턴의 스킬포인트가 가장 오른쪽에 표시됩니다.</li>
          <li>상단에 위치한 <strong>RANK CHECK</strong>를 클릭하여 랭크 확인 페이지로 이동합니다.</li>
          <li>가장 높은 스킬포인트를 획득한 곡 중 상위 50개의 스킬포인트가 합산됩니다.</li>
          <li>합산된 스킬포인트를 바탕으로 랭크가 표시됩니다.</li>
        </ol>
      </section>

      <section class="help-section">
        <h2 class="title">랭크의 목록과 기준은 어떻게 되나요?</h2>
        <p>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#rank-list-modal">
            이 버튼을 눌러서 랭크 목록과 기준을 확인할 수 있습니다.
          </button>
        </p>
      </section>

      <rank-list-modal id="rank-list-modal"></rank-list-modal>

      <section class="help-section">
        <h2 class="title">구글 스프레드시트를 이용하여 입력한 데이터는 어떻게 가져오나요?</h2>
        <ol>
          <li>본인의 구글 스프레드시트로 이동합니다. (1.2, 1.3, 1.4 버전의 데이터를 가져올 수 있습니다.)</li>
          <li>페이지 하단에서 데이터를 가져오고자 하는 버튼의 시트를 클릭합니다.</li>
          <li>
            시트 데이터 중에서 <strong>A열부터 R열까지</strong> 선택하여 복사합니다.<br>
            <img src="../../images/help/spreadsheet_copy.png">
          </li>
          <li>상단에 위치한 <strong>SCORE INPUT</strong>을 클릭하여 점수 입력 페이지로 이동합니다.</li>
          <li>데이터를 가져오고자 하는 버튼을 클릭합니다.</li>
          <li>표 상단에 있는 <strong>IMPORT</strong> 버튼을 클릭합니다.</li>
          <li>팝업의 입력창에 복사한 데이터를 붙여넣고 <strong>가져오기</strong> 버튼을 클릭합니다.</li>
          <li>데이터를 확인하고 가져오는데에 시간이 오래 걸릴 수도 있습니다.</li>
        </ol>
      </section>

      <section class="help-section">
        <h2 class="title">입력한 데이터는 어디에 저장되나요?</h2>
        <p>
          입력한 데이터는 브라우저에 저장됩니다.<br>
          다른 브라우저나 다른 컴퓨터에서는 저장된 데이터를 불러올 수 없고, 브라우저 데이터를 삭제하거나 브라우저 업데이트, 또는 시스템 환경에 따라 저장된 데이터가 삭제될 수 있습니다.<br>
          이를 방지하기 위해서 <strong>데이터 내보내기</strong> 기능이 존재합니다.<br>
          점수 입력 페이지 표 상단의 <strong>EXPORT</strong> 버튼을 클릭하여 사용할 수 있습니다.
        </p>
      </section>

      <section class="help-section">
        <h2 class="title">Contact &amp; Links</h2>
        <ul>
          <li><a href="https://github.com/Snack-X/dmrv-skillpoint" target="_blank">GitHub - Snack-X/dmrv-skillpoint</a></li>
          <li><a href="https://twitter.com/Snack_X" target="_blank">Twitter - @Snack_X</a></li>
          <li><a href="mailto:korsnack@korsnack.kr" target="_blank">Mail - korsnack@korsnack.kr</a></li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script>
import RankListModal from '/vue/components/help/RankListModal';

export default {
  components: { RankListModal },
};
</script>

<style lang="scss" scoped>
.help-view {
  margin: 2rem 0;
}

.help-section {
  margin: 2rem 0;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

ol, ul {
  padding-left: 1rem;
}

li {
  img {
    margin: .5rem 0;
    width: 100%;
    border: 1px solid #000;
  }
}
</style>

