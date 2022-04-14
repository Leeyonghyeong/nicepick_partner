<template>
  <header>
    <div class="header">
      <div class="header-contents">
        <div class="header-top">
          <div class="header-top-box">
            <div class="top-box-item">로그인</div>
            <div class="top-box-item">기업회원 가입</div>
            <div class="top-box-item">고객센터</div>
          </div>
        </div>

        <div class="header-menu-box">
          <div class="header-logo">
            <img src="../../assets/main_logo.png" alt="logo" />
          </div>
          <div class="header-menu">
            <div class="menu-item">브랜드 관리</div>
            <div class="menu-item">고객문의</div>
            <div class="menu-item">이용서비스</div>
            <div class="menu-item">광고상품</div>
            <div class="menu-item">마이페이지</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .header {
    .header-contents {
      border-bottom: 1px solid #eee;
      box-sizing: border-box;

      .header-top {
        background-color: #f9f9f9;
        height: 40px;

        .header-top-box {
          height: 40px;
          @include pc-container();
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .top-box-item {
            font-size: 1.4rem;
            color: #777;
            cursor: pointer;

            &:hover {
              color: #333;
            }

            &:not(:first-child) {
              &::before {
                content: '|';
                margin: 0 15px;
              }
            }
          }
        }
      }

      .header-menu-box {
        @include pc-container();
        padding-bottom: 16px;
        height: 104px;
        display: flex;
        align-items: flex-end;

        .header-logo {
          margin-right: 85px;
          img {
            width: 150px;
            height: 60px;
          }
        }

        .header-menu {
          display: flex;

          .menu-item {
            font-size: 2.2rem;
            color: #191919;
            margin-right: 80px;
            cursor: pointer;

            &:hover {
              color: $primary;
            }
          }
        }
      }
    }
  }
}

@include tablet {
  .header {
    .header-contents {
      height: 110px;

      .header-top {
        padding-top: 11px;
        padding-right: 24px;
        .header-top-box {
          display: flex;
          justify-content: flex-end;

          .top-box-item {
            font-size: 1.6rem;
            color: #777;
            cursor: pointer;

            &:hover {
              color: #333;
            }

            &:not(:first-child) {
              &::before {
                content: '|';
                margin: 0 15px;
              }
            }
          }
        }
      }

      .header-menu-box {
        position: relative;

        .header-logo {
          position: absolute;
          left: 33px;
          top: -7px;

          img {
            width: 150px;
          }
        }

        .header-menu {
          display: none;
        }
      }
    }
  }
}

@include mobile {
  header {
    width: 100%;
    .header {
      height: 120px;

      .header-contents {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .header-top {
          display: none;
        }

        .header-menu-box {
          .header-logo {
            img {
              width: 200px;
            }
          }

          .header-menu {
            display: none;
          }
        }
      }
    }
  }
}
</style>
