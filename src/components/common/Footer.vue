<template>
  <footer>
    <div class="footer-zone">
      <div class="info-zone">
        <div class="footer-menu-zone">
          <a
            href="https://nicepick.notion.site/b92941c41e6e4986b60a197ac607f1da"
            target="_blank"
            class="footer-menu"
            >개인정보 수집 및 이용동의</a
          >
          <a
            href="https://nicepick.notion.site/112ba598e8d34c39b6b3ab29d6c9e34a"
            target="_blank"
            class="footer-menu"
            >서비스 이용약관</a
          >
          <a
            href="https://nicepick.notion.site/e5db5ba7dd064fea86a0a0057d042654"
            target="_blank"
            class="footer-menu"
            >마케팅 정보 수신동의</a
          >
        </div>
        <div class="company-info">
          <div class="company-owner-name">(주)삼화이노랩 대표이사 : 원용철</div>
          <div class="biz-number">사업자등록번호 : 242-87-02414</div>
          <div class="company-address">
            서울특별시 강남구 테헤란로 82길15 디아이타워 6층 686
          </div>
          <div class="company-email">이메일 : nice1pick@gmail.com</div>
          <div class="company-biz-type">
            통신판매업 제2022 - 서울강남 - 00663호
          </div>
          <div class="copyright">
            Copyright © nicepick.co.kr. All rights reserved.
          </div>
        </div>
      </div>

      <div class="cs-center">
        <div class="cs-info-zone">
          <div>고객센터</div>
          <div>031-889-0142</div>
          <div class="working-time">
            평일 : 10시 ~ 20시 점심시간 : 12시 ~ 14시
            <span>토요일,일요일,공휴일 : 휴무</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  footer {
    width: 100%;
    border-top: 1px solid #dcdcdc;
    padding: 50px 0 67px 0;
    background-color: #fcfcfc;

    .footer-zone {
      @include pc-container();
      display: flex;
      justify-content: space-between;

      .info-zone {
        .footer-menu-zone {
          display: flex;
          margin-bottom: 40px;

          .footer-menu {
            font-size: 12px;
            color: #888;
            cursor: pointer;
            text-decoration: none;

            &:hover {
              color: #353535;
            }

            &:not(:first-child):before {
              content: '';
              border-left: 1px solid #888;
              margin: 0 20px;
            }
          }
        }

        .company-info {
          font-size: 12px;
          color: #888;
          line-height: 1.33;

          .company-address {
            margin-bottom: 20px;
          }

          .company-biz-type {
            margin-bottom: 40px;
          }
        }
      }

      .cs-center {
        display: flex;
        justify-content: center;
        align-items: center;

        .cs-info-zone {
          padding: 30px 40px;
          background-color: #f2f4f6;

          div {
            font-size: 24px;
            color: #222;
            font-weight: bold;

            &:nth-child(2) {
              margin-top: 20px;
              margin-bottom: 15px;
            }

            &.working-time {
              font-size: 12px;
              color: #888;
              font-weight: normal;
            }
          }
        }
      }
    }
  }
}

@include tablet {
  footer {
    height: 136px;
    overflow: hidden;
    background-color: #fcfcfc;
    .footer-zone {
      height: 100%;
      display: flex;

      .info-zone {
        width: 50%;
        height: 100%;
        padding: 18px 34px;
        font-size: 0.8rem;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        .footer-menu-zone {
          a {
            text-decoration: none;
            color: #777;

            &:nth-child(2) {
              margin: 0 15px;
            }
          }
        }

        .company-info {
          flex: 1 1 0;
          margin-top: 12px;
          color: #777;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      }

      .cs-center {
        width: 50%;
        background-color: #f2f4f6;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1.5;

        div {
          font-size: 2.2rem;
          color: #353535;
          font-weight: bold;

          &:last-child {
            font-size: 1rem;
            color: #777;
          }
        }
      }
    }
  }
}

@include mobile {
  footer {
    background-color: #fcfcfc;
    .footer-zone {
      display: flex;
      flex-direction: column-reverse;
      padding: 24px;

      .cs-center {
        .cs-info-zone {
          font-size: 1.6rem;
          color: #191919;
          font-weight: bold;
          padding-bottom: 24px;
          border-bottom: 1px solid #ededed;
          margin-bottom: 24px;

          div {
            margin-bottom: 4px;
          }

          .working-time {
            margin-bottom: 0;
            line-height: 1.6;
            font-size: 1.2rem;
            color: #767676;
            font-weight: normal;

            span {
              display: block;
            }
          }
        }
      }

      .info-zone {
        .footer-menu-zone {
          display: flex;

          a {
            text-decoration: none;
            font-size: 1rem;
            color: #767676;

            &:not(:first-child) {
              &::before {
                content: '|';
                margin: 0 8px;
              }
            }
          }
        }

        .company-info {
          margin-top: 24px;
          font-size: 1rem;
          color: #767676;
          line-height: 1.5;

          .company-email {
            margin-top: 12px;
          }

          .copyright {
            margin-top: 12px;
          }
        }
      }
    }
  }
}
</style>
