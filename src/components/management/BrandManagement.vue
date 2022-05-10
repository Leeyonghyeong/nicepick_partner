<template>
  <MobileHeader title="브랜드 정보관리" :cart="false" :back="false" />
  <Header />
  <main>
    <div class="management" v-if="!isLoading">
      <!-- 브랜드 로고 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name required">브랜드 로고</div>
          <div class="move-product" @click="router.push('/shop')">
            광고신청
            <i class="fa-solid fa-angle-right"></i>
          </div>
        </div>
        <div class="standard-size">
          <div class="mobile">(사이즈 규격 가로250px X 세로100px)</div>
        </div>
        <div class="image">
          <div class="previewer upload-image" v-if="brand?.brandLogoImg">
            <img :src="brand.brandLogoImg" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('logoImage')">삭제</button>
            </div>
          </div>
          <div class="previewer thumbnail" v-else-if="logoImg">
            <img :src="logoImg.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('logoImage', logoImg?.key)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image" v-else>
            <input
              type="file"
              name="logoImage"
              id="logoImage"
              @change="fileUpload"
            />
            <label for="logoImage"><i class="fa-solid fa-plus"></i> 추가</label>
          </div>
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop">
        <div class="title">
          <div class="name required">브랜드 로고</div>
          <div class="size">250 X 100</div>
        </div>
        <div class="image">
          <div class="previewer upload-image" v-if="brand?.brandLogoImg">
            <img :src="brand.brandLogoImg" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('logoImage')">삭제</button>
            </div>
          </div>
          <div class="previewer thumbnail" v-else-if="logoImg">
            <img :src="logoImg.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('logoImage', logoImg?.key)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image one" v-else>
            <input
              type="file"
              name="logoImage"
              id="logoImage"
              @change="fileUpload"
            />
            <label for="logoImage">
              <div>
                <img src="../../assets/management/add_circle.png" alt="add" />
              </div>
              <div>[필수등록]</div>
            </label>
          </div>
        </div>
        <div class="standard-size">
          <div>- 가로 250px 세로 100px 이미지를 등록해주세요</div>
          <div>- jpg, png 파일만 등록이 가능합니다</div>
        </div>
      </div>
      <!-- desktop -->
      <!-- 브랜드 로고 -->

      <!-- 브랜드 대표 이미지 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name required">브랜드 대표이미지</div>
        </div>
        <div class="standard-size">
          <div class="mobile">(사이즈 규격 가로500px X 세로200px 이상)</div>
        </div>
        <div class="image">
          <div class="previewer upload-image" v-if="brand?.brandImg">
            <img :src="brand.brandImg" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('brandImage')">삭제</button>
            </div>
          </div>
          <div class="previewer thumbnail" v-else-if="brandImg">
            <img :src="brandImg.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('brandImage', brandImg?.key)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image" v-else>
            <input
              type="file"
              name="brandImage"
              id="brandImage"
              @change="fileUpload"
            />
            <label for="brandImage"
              ><i class="fa-solid fa-plus"></i> 추가</label
            >
          </div>
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop">
        <div class="title">
          <div class="name required">브랜드 대표이미지</div>
          <div class="size">500 X 250</div>
        </div>

        <div class="image">
          <div class="previewer upload-image" v-if="brand?.brandImg">
            <img :src="brand.brandImg" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('brandImage')">삭제</button>
            </div>
          </div>
          <div class="previewer thumbnail" v-else-if="brandImg">
            <img :src="brandImg.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('brandImage', brandImg?.key)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image one" v-else>
            <input
              type="file"
              name="brandImage"
              id="brandImage"
              @change="fileUpload"
            />
            <label for="brandImage">
              <div>
                <img src="../../assets/management/add_circle.png" alt="add" />
              </div>
              <div>[필수등록]</div>
            </label>
          </div>
        </div>
        <div class="standard-size">
          <div>- 가로 500px 세로 250px 이미지를 등록해주세요</div>
          <div>- jpg, png 파일만 등록이 가능합니다</div>
        </div>
      </div>
      <!-- desktop -->
      <!-- 브랜드 대표 이미지 -->

      <!-- 프로모션 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name">프로모션</div>
        </div>
        <div class="promotion-icon">
          <div class="icon-item">
            <input
              v-model="promotionIcon"
              value="가맹비할인"
              type="checkbox"
              id="icon1"
            />
            <label for="icon1">
              <img
                src="../../assets/management/가맹비할인.png"
                alt="가맹비할인"
              />
            </label>
          </div>
          <div class="icon-item">
            <input
              v-model="promotionIcon"
              value="가맹비면제"
              type="checkbox"
              id="icon2"
            />
            <label for="icon2">
              <img
                src="../../assets/management/가맹비면제.png"
                alt="가맹비면제"
              />
            </label>
          </div>
          <div class="icon-item">
            <input
              v-model="promotionIcon"
              value="교육비할인"
              type="checkbox"
              id="icon3"
            />
            <label for="icon3">
              <img
                src="../../assets/management/교육비할인.png"
                alt="교육비할인"
              />
            </label>
          </div>
          <div class="icon-item">
            <input
              v-model="promotionIcon"
              value="교육비면제"
              type="checkbox"
              id="icon4"
            />
            <label for="icon4">
              <img
                src="../../assets/management/교육비면제.png"
                alt="교육비면제"
              />
            </label>
          </div>
          <div class="icon-item">
            <input
              v-model="promotionIcon"
              value="물품지원"
              type="checkbox"
              id="icon5"
            />
            <label for="icon5">
              <img src="../../assets/management/물품지원.png" alt="물품지원" />
            </label>
          </div>
          <div class="icon-item">
            <input
              v-model="promotionIcon"
              value="장비지원"
              type="checkbox"
              id="icon6"
            />
            <label for="icon6">
              <img src="../../assets/management/장비지원.png" alt="장비지원" />
            </label>
          </div>
          <div class="icon-item">
            <input
              v-model="promotionIcon"
              value="인테리어비용지원"
              type="checkbox"
              id="icon7"
            />
            <label for="icon7">
              <img
                src="../../assets/management/인테리어비용지원.png"
                alt="인테리어비용지원"
              />
            </label>
          </div>
        </div>
        <div class="check-box">
          <input v-model="isPromotionWrite" type="checkbox" id="write" />
          <label for="write">직접입력</label>
        </div>
        <div class="text-input">
          <input
            v-model="promotion"
            type="text"
            placeholder="비용노출 최소하하여 작성"
            :disabled="!isPromotionWrite"
          />
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop promotion">
        <div class="title">
          <div class="name">프로모션</div>
        </div>
        <div class="right-input">
          <div class="promotion-icon">
            <div class="icon-item">
              <input
                v-model="promotionIcon"
                value="가맹비할인"
                type="checkbox"
                id="icon1"
              />
              <label for="icon1">
                <img
                  src="../../assets/management/가맹비할인.png"
                  alt="가맹비할인"
                />
              </label>
            </div>
            <div class="icon-item">
              <input
                v-model="promotionIcon"
                value="가맹비면제"
                type="checkbox"
                id="icon2"
              />
              <label for="icon2">
                <img
                  src="../../assets/management/가맹비면제.png"
                  alt="가맹비면제"
                />
              </label>
            </div>
            <div class="icon-item">
              <input
                v-model="promotionIcon"
                value="교육비할인"
                type="checkbox"
                id="icon3"
              />
              <label for="icon3">
                <img
                  src="../../assets/management/교육비할인.png"
                  alt="교육비할인"
                />
              </label>
            </div>
            <div class="icon-item">
              <input
                v-model="promotionIcon"
                value="교육비면제"
                type="checkbox"
                id="icon4"
              />
              <label for="icon4">
                <img
                  src="../../assets/management/교육비면제.png"
                  alt="교육비면제"
                />
              </label>
            </div>
            <div class="icon-item">
              <input
                v-model="promotionIcon"
                value="물품지원"
                type="checkbox"
                id="icon5"
              />
              <label for="icon5">
                <img
                  src="../../assets/management/물품지원.png"
                  alt="물품지원"
                />
              </label>
            </div>
            <div class="icon-item">
              <input
                v-model="promotionIcon"
                value="장비지원"
                type="checkbox"
                id="icon6"
              />
              <label for="icon6">
                <img
                  src="../../assets/management/장비지원.png"
                  alt="장비지원"
                />
              </label>
            </div>
            <div class="icon-item">
              <input
                v-model="promotionIcon"
                value="인테리어비용지원"
                type="checkbox"
                id="icon7"
              />
              <label for="icon7">
                <img
                  src="../../assets/management/인테리어비용지원.png"
                  alt="인테리어비용지원"
                />
              </label>
            </div>
          </div>
          <div class="check-box">
            <input v-model="isPromotionWrite" type="checkbox" id="write" />
            <label for="write">직접입력</label>
          </div>
          <div class="text-input">
            <input
              v-model="promotion"
              type="text"
              placeholder="비용노출 최소하하여 작성"
              :disabled="!isPromotionWrite"
            />
          </div>

          <div class="premium-modal">
            <div>프리미엄 회원 전용 서비스</div>
            <div @click="router.push('/shop')">신청하기</div>
          </div>
        </div>
      </div>
      <!-- desktop -->
      <!-- 프로모션 -->

      <!-- 홈페이지 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name">홈페이지</div>
        </div>
        <div class="text-input">
          <input v-model="webUrl" type="text" placeholder="홈페이지 URL 작성" />
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop homepage">
        <div class="title">
          <div class="name">홈페이지</div>
        </div>
        <div class="text-input">
          <input v-model="webUrl" type="text" placeholder="홈페이지 URL 작성" />
        </div>
      </div>
      <!-- desktop -->
      <!-- 홈페이지 -->

      <!-- 유튜브 영상 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name">유튜브 영상</div>
        </div>
        <div
          class="text-input"
          v-for="(youtube, i) in brand?.brandYoutube"
          :key="i"
        >
          <input
            v-model="youtube.youtubeUrl"
            type="text"
            placeholder="유튜브 URL 작성"
          />
          <div class="delete-circle">
            <img
              src="../../assets/x-circle-fill.png"
              alt="delete"
              @click="deleteYoutube(youtube.id)"
            />
          </div>
        </div>
        <div class="text-input" v-for="(youtube, i) in youtubeUrl" :key="i">
          <input
            v-model="youtube.url"
            type="text"
            placeholder="유튜브 URL 작성"
          />
          <div class="delete-circle" v-if="i > 0">
            <img
              src="../../assets/x-circle-fill.png"
              alt="delete"
              @click="youtubeUrl.splice(i, 1)"
            />
          </div>
        </div>
        <div class="add-input" @click="youtubeUrl.push({ url: '' })">
          <i class="fa-solid fa-plus"></i> 추가
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop youtube">
        <div class="title">
          <div class="name">유튜브 영상</div>
          <div class="size">영상을 자유롭게 추가해주세요</div>
        </div>
        <div class="youtube-input-zone">
          <div
            class="text-input"
            v-for="(youtube, i) in brand?.brandYoutube"
            :key="i"
          >
            <input
              v-model="youtube.youtubeUrl"
              type="text"
              placeholder="유튜브 URL 작성"
            />
            <div class="delete-circle">
              <img
                src="../../assets/x-circle-fill.png"
                alt="delete"
                @click="deleteYoutube(youtube.id)"
              />
            </div>
          </div>
          <div class="text-input" v-for="(youtube, i) in youtubeUrl" :key="i">
            <input
              v-model="youtube.url"
              type="text"
              placeholder="유튜브 URL 작성"
            />
            <div class="delete-circle" v-if="i > 0">
              <img
                src="../../assets/x-circle-fill.png"
                alt="delete"
                @click="youtubeUrl.splice(i, 1)"
              />
            </div>
          </div>
          <div class="add-input" @click="youtubeUrl.push({ url: '' })">
            <i class="fa-solid fa-plus"></i> 추가
          </div>
        </div>
      </div>
      <!-- desktop -->
      <!-- 유튜브 영상 -->

      <!-- 브랜드 소개 이미지 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name">브랜드 소개 이미지</div>
        </div>
        <div class="standard-size">
          <div class="mobile">(사이즈 규격 최소 가로840px 이상)</div>
        </div>
        <div class="image">
          <div
            class="previewer upload-image"
            v-for="item in brand?.brandIntroImg"
            :key="item.id"
          >
            <img :src="item.introImgUrl" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('introImage', item.id)">삭제</button>
            </div>
          </div>
          <div
            class="previewer thumbnail"
            v-for="(item, i) in introImg"
            :key="item.key"
          >
            <img :src="item.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('introImage', item?.key, i)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image">
            <input
              type="file"
              name="introImage"
              id="introImage"
              @change="fileUpload"
            />
            <label for="introImage"
              ><i class="fa-solid fa-plus"></i> 추가</label
            >
          </div>
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop brand-intro">
        <div class="title">
          <div class="name">브랜드 소개 이미지</div>
          <div class="size">가로 840px 이상</div>
        </div>
        <div class="image">
          <div
            class="previewer upload-image"
            v-for="item in brand?.brandIntroImg"
            :key="item.id"
          >
            <img :src="item.introImgUrl" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('introImage', item.id)">삭제</button>
            </div>
          </div>
          <div
            class="previewer thumbnail"
            v-for="(item, i) in introImg"
            :key="item.key"
          >
            <img :src="item.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('introImage', item?.key, i)">
                삭제
              </button>
            </div>
          </div>
          <div class="bottom-zone">
            <div class="add-image">
              <input
                type="file"
                name="introImage"
                id="introImage"
                @change="fileUpload"
              />
              <label for="introImage">
                <i class="fa-solid fa-plus"></i> 추가
              </label>
            </div>
          </div>
        </div>
      </div>
      <!-- desktop -->
      <!-- 브랜드 소개 이미지 -->

      <!-- 대표 메뉴 이미지 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name">대표 메뉴 이미지</div>
        </div>
        <div class="standard-size">
          <div class="mobile">(사이즈 규격 가로180px X 세로180px 이상)</div>
        </div>
        <div class="image">
          <div
            class="previewer upload-image menu"
            v-for="item in brand?.brandMenuImg"
            :key="item.id"
          >
            <div class="menu-edit">
              <img :src="item.menuImgUrl" :alt="brand?.brandName" />
              <div class="menu-input">
                <input
                  type="text"
                  :value="item.menuName"
                  readonly
                  placeholder="메뉴 이름"
                />
                <input
                  type="text"
                  :value="item.menuPrice"
                  readonly
                  placeholder="메뉴 가격"
                />
              </div>
            </div>
            <div class="img-button">
              <button @click="deleteImg('menuImage', item.id)">삭제</button>
            </div>
          </div>
          <div
            class="previewer thumbnail menu"
            v-for="(item, i) in menuImg"
            :key="item.menuImgUrlKey"
          >
            <div class="menu-edit">
              <img :src="item.menuImgUrl" :alt="brand?.brandName" />
              <div class="menu-input">
                <input
                  v-model="item.menuName"
                  type="text"
                  placeholder="메뉴 이름"
                />
                <input
                  v-model="item.menuPrice"
                  type="text"
                  placeholder="메뉴 가격"
                />
              </div>
            </div>
            <div class="img-button">
              <button
                @click="deleteThumbnail('menuImage', item?.menuImgUrlKey, i)"
              >
                삭제
              </button>
            </div>
          </div>
          <div class="add-image">
            <input
              type="file"
              name="menuImage"
              id="menuImage"
              @change="fileUpload"
            />
            <label for="menuImage"><i class="fa-solid fa-plus"></i> 추가</label>
          </div>
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop brand-menu">
        <div class="title">
          <div class="name">대표 메뉴 이미지</div>
          <div class="size">180 X 180</div>
        </div>
        <div class="image">
          <div
            class="previewer upload-image menu"
            v-for="item in brand?.brandMenuImg"
            :key="item.id"
          >
            <div class="menu-edit">
              <img :src="item.menuImgUrl" :alt="brand?.brandName" />
              <div class="menu-input">
                <input
                  type="text"
                  :value="item.menuName"
                  readonly
                  placeholder="메뉴 이름"
                />
                <input
                  type="text"
                  :value="item.menuPrice"
                  readonly
                  placeholder="메뉴 가격"
                />
              </div>
            </div>
            <div class="img-button">
              <button @click="deleteImg('menuImage', item.id)">삭제</button>
            </div>
          </div>
          <div
            class="previewer thumbnail menu"
            v-for="(item, i) in menuImg"
            :key="item.menuImgUrlKey"
          >
            <div class="menu-edit">
              <img :src="item.menuImgUrl" :alt="brand?.brandName" />
              <div class="menu-input">
                <input
                  v-model="item.menuName"
                  type="text"
                  placeholder="메뉴 이름"
                />
                <input
                  v-model="item.menuPrice"
                  type="text"
                  placeholder="메뉴 가격"
                />
              </div>
            </div>
            <div class="img-button">
              <button
                @click="deleteThumbnail('menuImage', item?.menuImgUrlKey, i)"
              >
                삭제
              </button>
            </div>
          </div>
          <div class="add-image">
            <input
              type="file"
              name="menuImage"
              id="menuImage"
              @change="fileUpload"
            />
            <label for="menuImage"><i class="fa-solid fa-plus"></i> 추가</label>
          </div>
        </div>
      </div>
      <!-- desktop -->
      <!-- 대표 메뉴 이미지 -->

      <!-- 시설 및 인테리어 이미지 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name">시설 및 인테리어 이미지</div>
        </div>
        <div class="standard-size">
          <div class="mobile">(사이즈 규격 가로840px X 세로560px 이상)</div>
        </div>
        <div class="image">
          <div
            class="previewer upload-image"
            v-for="item in brand?.brandInteriorImg"
            :key="item.id"
          >
            <img :src="item.interiorImgUrl" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('interiorImage', item.id)">삭제</button>
            </div>
          </div>
          <div
            class="previewer thumbnail"
            v-for="(item, i) in interiorImg"
            :key="item.key"
          >
            <img :src="item.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('interiorImage', item?.key, i)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image">
            <input
              type="file"
              name="interiorImage"
              id="interiorImage"
              @change="fileUpload"
            />
            <label for="interiorImage"
              ><i class="fa-solid fa-plus"></i> 추가</label
            >
          </div>
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop brand-interior">
        <div class="title">
          <div class="name">시설 및 인테리어 이미지</div>
          <div class="size">840 X 560</div>
        </div>
        <div class="image">
          <div
            class="previewer upload-image"
            v-for="item in brand?.brandInteriorImg"
            :key="item.id"
          >
            <img :src="item.interiorImgUrl" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('interiorImage', item.id)">삭제</button>
            </div>
          </div>
          <div
            class="previewer thumbnail"
            v-for="(item, i) in interiorImg"
            :key="item.key"
          >
            <img :src="item.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('interiorImage', item?.key, i)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image">
            <input
              type="file"
              name="interiorImage"
              id="interiorImage"
              @change="fileUpload"
            />
            <label for="interiorImage"
              ><i class="fa-solid fa-plus"></i> 추가</label
            >
          </div>
        </div>
      </div>
      <!-- desktop -->
      <!-- 시설 및 인테리어 이미지 -->

      <!-- 창업비용 및 절차 이미지 -->
      <!-- mobile -->
      <div class="brand-info-input input-mobile">
        <div class="title">
          <div class="name">창업비용 및 절차 이미지</div>
        </div>
        <div class="standard-size">
          <div class="mobile">(사이즈 규격 최소 가로840px 이상)</div>
        </div>
        <div class="image">
          <div
            class="previewer upload-image"
            v-for="item in brand?.brandStartCostImg"
            :key="item.id"
          >
            <img :src="item.startCostImgUrl" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('startImage', item.id)">삭제</button>
            </div>
          </div>
          <div
            class="previewer thumbnail"
            v-for="(item, i) in startImg"
            :key="item.key"
          >
            <img :src="item.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('startImage', item?.key, i)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image">
            <input
              type="file"
              name="startImage"
              id="startImage"
              @change="fileUpload"
            />
            <label for="startImage"
              ><i class="fa-solid fa-plus"></i> 추가</label
            >
          </div>
        </div>
      </div>
      <!-- mobile -->

      <!-- desktop -->
      <div class="brand-info-input input-desktop brand-start">
        <div class="title">
          <div class="name">창업비용 및 절차 이미지</div>
          <div class="size">가로 840px 이상</div>
        </div>
        <div class="image">
          <div
            class="previewer upload-image"
            v-for="item in brand?.brandStartCostImg"
            :key="item.id"
          >
            <img :src="item.startCostImgUrl" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteImg('startImage', item.id)">삭제</button>
            </div>
          </div>
          <div
            class="previewer thumbnail"
            v-for="(item, i) in startImg"
            :key="item.key"
          >
            <img :src="item.url" :alt="brand?.brandName" />
            <div class="img-button">
              <button @click="deleteThumbnail('startImage', item?.key, i)">
                삭제
              </button>
            </div>
          </div>
          <div class="add-image">
            <input
              type="file"
              name="startImage"
              id="startImage"
              @change="fileUpload"
            />
            <label for="startImage"
              ><i class="fa-solid fa-plus"></i> 추가</label
            >
          </div>
        </div>
      </div>
      <!-- desktop -->
      <!-- 창업비용 및 절차 이미지 -->

      <div class="save-button">
        <button @click="saveSubmit">저장</button>
      </div>
    </div>
  </main>
  <BottomNav />
  <Footer />
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import Header from '../common/Header.vue'
import BottomNav from '../common/BottomNav.vue'
import Footer from '../common/Footer.vue'
import api from '../../config/axios.config'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { Brand } from '../../types/brand'
import { confirmAlert, toastAlert } from '../../functions/alert'
import { SweetAlertResult } from 'sweetalert2'
import { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'

interface Image {
  key: string
  url: string
}

interface MenuImage {
  menuImgUrl: string
  menuImgUrlKey: string
  menuName?: string
  menuPrice?: number
}

interface Youtube {
  url: string
}

interface BrandYoutube {
  youtubeUrl: string
  youtubeId: string
}

const store = useStore()
const router = useRouter()

const brand = ref<Brand>()
const isLoading = ref<boolean>(true)

const logoImg = ref<Image>()
const brandImg = ref<Image>()
const promotion = ref<string>('')
const isPromotionWrite = ref<boolean>(false)
const promotionIcon = ref<string[]>([])
const webUrl = ref<string>('')
const youtubeUrl = ref<Youtube[]>([{ url: '' }])
const youtube = ref<BrandYoutube[]>([])
const introImg = ref<Image[]>([])
const menuImg = ref<MenuImage[]>([])
const interiorImg = ref<Image[]>([])
const startImg = ref<Image[]>([])

const brandId = computed(() => {
  return store.state.auth.brandId as string
})

const getBrandInfo = async () => {
  isLoading.value = true
  const result = await api.get(`/brand/ad/${brandId.value}`)

  if (result.data.success) {
    brand.value = result.data.brand

    promotion.value = brand.value?.brandPromotion
      ? brand.value.brandPromotion
      : ''

    promotionIcon.value = brand.value?.brandPromotionIcon
      ? brand.value.brandPromotionIcon.split(',')
      : []

    webUrl.value = brand.value?.webUrl ? brand.value.webUrl : ''

    isLoading.value = false
  }
}

const fileUpload = async (e: Event) => {
  const input: HTMLInputElement = e.target as HTMLInputElement
  const file = input.files
  const targetId = input.id

  if (file && file.length > 0) {
    for (let i = 0; i < file.length; i++) {
      if (file[i].type.indexOf('image') === -1) {
        toastAlert('이미지 파일만 업로드 가능합니다')
        continue
      }

      const formData = new FormData()
      formData.append('file', file[i])
      formData.append('brandId', brandId.value)

      const keyResult = await api.post('/brand/upload', formData)
      const urlResult = await api.post('/brand/upload/url', {
        key: keyResult.data.key,
      })

      if (targetId === 'logoImage') {
        logoImg.value = {
          key: keyResult.data.key,
          url: urlResult.data,
        }
      } else if (targetId === 'brandImage') {
        brandImg.value = {
          key: keyResult.data.key,
          url: urlResult.data,
        }
      } else if (targetId === 'introImage') {
        introImg.value.push({
          key: keyResult.data.key,
          url: urlResult.data,
        })
      } else if (targetId === 'menuImage') {
        menuImg.value.push({
          menuImgUrlKey: keyResult.data.key,
          menuImgUrl: urlResult.data,
        })
      } else if (targetId === 'interiorImage') {
        interiorImg.value.push({
          key: keyResult.data.key,
          url: urlResult.data,
        })
      } else {
        startImg.value.push({
          key: keyResult.data.key,
          url: urlResult.data,
        })
      }
    }
  }

  input.value = ''
}

const deleteImg = async (type: string, id?: string) => {
  const confirm: SweetAlertResult = await confirmAlert(
    '이미지를 삭제 하시겠습니까?'
  )

  if (confirm.isConfirmed) {
    let result: AxiosResponse

    if (type === 'logoImage') {
      result = await api.delete(`/brand/ad/image/${brandId.value}`)
    } else if (type === 'brandImage') {
      result = await api.delete(`/brand/ad/brand/${brandId.value}`)
    } else if (type === 'introImage') {
      result = await api.delete(`/brand/ad/intro/${id}`)
    } else if (type === 'menuImage') {
      result = await api.delete(`/brand/ad/menu/${id}`)
    } else if (type === 'interiorImage') {
      result = await api.delete(`/brand/ad/interior/${id}`)
    } else {
      result = await api.delete(`/brand/ad/start/${id}`)
    }

    if (result.data.success) {
      toastAlert('삭제 되었습니다')
      getBrandInfo()
    } else {
      toastAlert(result.data.errorMessage)
    }
  }
}

const deleteYoutube = async (id: string) => {
  const confirm: SweetAlertResult = await confirmAlert(
    '유튜브 링크를 삭제하시겠습니까?'
  )

  if (confirm.isConfirmed) {
    const result = await api.delete(`/brand/ad/youtube/${id}`)

    if (result.data.success) {
      toastAlert('삭제 되었습니다')
      getBrandInfo()
    } else {
      toastAlert(result.data.errorMessage)
    }
  }
}

const deleteThumbnail = async (
  type: string,
  key: string | undefined,
  index?: number
) => {
  const confirm: SweetAlertResult = await confirmAlert(
    '이미지를 삭제 하시겠습니까?'
  )

  if (confirm.isConfirmed) {
    const deleteFile = await api.delete(`/brand/upload/key?key=${key}`)

    if (deleteFile.data.success) {
      if (type === 'logoImage') {
        logoImg.value = undefined
      } else if (type === 'brandImage') {
        brandImg.value = undefined
      } else if (type === 'introImage') {
        if (index !== undefined) {
          introImg.value.splice(index, 1)
        }
      } else if (type === 'menuImage') {
        if (index !== undefined) {
          menuImg.value.splice(index, 1)
        }
      } else if (type === 'interiorImage') {
        if (index !== undefined) {
          interiorImg.value.splice(index, 1)
        }
      } else {
        if (index !== undefined) {
          startImg.value.splice(index, 1)
        }
      }
    }
  }
}

const saveSubmit = async () => {
  if (
    (!brand.value?.brandLogoImg && !logoImg.value) ||
    (!brand.value?.brandImg && !brandImg.value)
  ) {
    toastAlert('브랜드 로고와 대표이미지는 필수 입니다')
    return
  }

  youtubeUrl.value.forEach((url) => {
    if (url.url === '') {
      return
    }

    let findIndex: number

    if (url.url.includes('watch')) {
      findIndex = url.url.lastIndexOf('=')
    } else {
      findIndex = url.url.lastIndexOf('/')
    }

    const youtubeId = url.url.slice(findIndex + 1, url.url.length)

    youtube.value.push({
      youtubeUrl: url.url,
      youtubeId,
    })
  })

  const data = {
    brandId: brandId.value,
    brandLogoImg: logoImg.value?.url,
    brandLogoImgKey: logoImg.value?.key,
    brandImg: brandImg.value?.url,
    brandImgKey: brandImg.value?.key,
    brandPromotion: promotion.value,
    brandPromotionIcon:
      promotionIcon.value.length > 0 ? promotionIcon.value.toString() : null,
    webUrl: webUrl.value,
    brandYoutube: youtube.value,
    brandIntroImg: introImg.value,
    brandMenuImg: menuImg.value,
    brandInteriorImg: interiorImg.value,
    brandStartCostImg: startImg.value,
  }

  const saveResult = await api.put('/brand/ad/info', data)

  if (saveResult.data.success) {
    toastAlert('수정 되었습니다')

    logoImg.value = undefined
    brandImg.value = undefined
    isPromotionWrite.value = false
    promotionIcon.value = []
    youtubeUrl.value = []
    introImg.value = []
    menuImg.value = []
    interiorImg.value = []
    startImg.value = []

    getBrandInfo()
  } else {
    toastAlert(saveResult.data.errorMessage)
  }
}

getBrandInfo()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .management {
    .brand-info-input {
      @include pc-container();
      padding: 30px 0 30px 30px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      &.input-mobile {
        display: none;
      }

      .title {
        width: 267px;
        line-height: 1.3;

        .name {
          font-size: 1.6rem;
          color: #353535;

          &.required {
            &::after {
              content: '*';
              color: #fa5252;
            }
          }
        }

        .size {
          font-size: 1.2rem;
          color: #c7c7c7;
        }
      }

      .image {
        .previewer {
          display: flex;
          align-items: center;

          img {
            width: 250px;
            height: 100px;
          }

          .img-button {
            margin-left: 12px;

            button {
              width: 60px;
              height: 35px;
              background-color: #f1f1f1;
              font-size: 1.4rem;
              color: #888;
              border-radius: 10px;
              cursor: pointer;
            }
          }
        }

        .add-image {
          input[type='file'] {
            width: 0;
            height: 0;
          }
          &.one {
            label {
              display: flex;
              flex-direction: column;
              width: 250px;
              height: 100px;
              border: 1px solid $primary;
              justify-content: center;
              align-items: center;
              box-sizing: border-box;
              font-size: 1.4rem;
              color: $primary;
              cursor: pointer;
            }
          }
        }
      }

      .standard-size {
        font-size: 1.2rem;
        color: #c7c7c7;
        line-height: 1.3;
        margin-left: 94px;
      }

      .text-input {
        input {
          width: 840px;
          height: 40px;
          border: 1px solid #cfcfcf;
          background-color: #fff;
          font-size: 1.4rem;
          padding: 0 20px;

          &::placeholder {
            color: #c7c7c7;
          }
        }
      }

      .right-input {
        position: relative;
        .promotion-icon {
          width: 650px;
          display: flex;
          flex-wrap: wrap;

          .icon-item {
            display: flex;
            align-items: center;
            margin-right: 30px;
            margin-bottom: 10px;

            input[type='checkbox'] {
              width: 20px;
              height: 20px;
              margin-right: 4px;
            }

            label {
              img {
                height: 27px;
              }
            }
          }
        }

        .check-box {
          display: flex;
          align-items: center;
          margin-bottom: 9px;

          input[type='checkbox'] {
            width: 20px;
            height: 20px;
            margin-right: 4px;
          }

          label {
            font-size: 1.4rem;
            color: #353535;
          }
        }

        .premium-modal {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          line-height: 1.5;
          justify-content: center;
          align-items: center;
          top: 0;
          left: 0;
          font-size: 2.4rem;
          font-weight: bold;
          color: #fff;

          div {
            &:last-child {
              font-size: 1.8rem;
              color: red;
              cursor: pointer;
            }
          }
        }
      }
    }

    .promotion {
      align-items: flex-start;
      padding-bottom: 0;
      border-bottom: none;
    }

    .homepage,
    .youtube {
      padding-bottom: 0;
      padding-top: 30px;
      border-bottom: none;
    }

    .youtube {
      align-items: flex-start;
      padding-bottom: 60px;
      border-bottom: 1px solid #eee;

      .youtube-input-zone {
        .text-input {
          display: flex;
          align-items: center;
          position: relative;
          padding-bottom: 20px;

          .delete-circle {
            position: absolute;
            right: 20px;

            img {
              width: 20px;
              cursor: pointer;
            }
          }
        }
        .add-input {
          text-align: center;
          font-size: 1.4rem;
          color: $primary;
          cursor: pointer;
        }
      }
    }

    .brand-intro {
      flex-wrap: wrap;
      .image {
        .previewer {
          margin-bottom: 16px;

          img {
            width: 756px;
            height: 216px;
          }
        }

        .bottom-zone {
          width: 756px;
          display: flex;
          justify-content: space-between;

          .standard-size {
            margin: 0;
          }

          .add-image {
            label {
              font-size: 1.4rem;
              color: $primary;
              cursor: pointer;
            }
          }
        }
      }
    }

    .brand-menu {
      .image {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .previewer {
          margin-right: 12px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;

          .menu-edit {
            img {
              width: 180px;
              height: 180px;
            }

            .menu-input {
              display: flex;
              flex-direction: column;

              input {
                width: 100%;
                border: 1px solid #cfcfcf;
                margin-top: 10px;
                height: 32px;
                padding-left: 10px;
              }
            }
          }

          .img-button {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
            margin-left: 0;

            button {
              width: 60px;
              height: 35px;
            }
          }
        }

        .add-image {
          label {
            font-size: 1.4rem;
            color: $primary;
            cursor: pointer;
          }
        }
      }
    }

    .brand-interior,
    .brand-start {
      .image {
        flex: 1 1 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .previewer {
          display: flex;
          flex-direction: column;
          margin-right: 12px;
          margin-bottom: 20px;

          img {
            width: 372px;
            height: 216px;
          }

          .img-button {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
            margin-left: 0;
          }
        }

        .add-image {
          label {
            font-size: 1.4rem;
            color: $primary;
            cursor: pointer;
          }
        }
      }
    }

    .save-button {
      @include pc-container();
      margin-top: 38px;
      margin-bottom: 80px;
      text-align: center;

      button {
        width: 400px;
        height: 50px;
        background-color: $primary;
        color: #fff;
        font-size: 2rem;
        border-radius: 50px;
        cursor: pointer;
      }
    }
  }
}

@include mobile {
  .management {
    padding: 24px;

    input[type='file'] {
      display: none;
    }

    .brand-info-input {
      &:not(:first-child) {
        margin-top: 40px;
      }

      &.input-desktop {
        display: none;
      }
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.8rem;
        color: #353535;

        .name {
          &.required::after {
            content: '*';
            color: #fa5252;
          }
        }

        .move-product {
          font-size: 1.6rem;
          color: #767676;
          cursor: pointer;
        }
      }

      .standard-size {
        font-size: 1.4rem;
        color: #999;
        margin-top: 4px;
      }

      .image {
        .previewer {
          margin-top: 12px;

          img {
            width: 100%;
            border: 1px solid #ededed;
            border-radius: 5px;
            overflow: hidden;
          }

          .img-button {
            margin-top: 12px;
            display: flex;
            justify-content: space-between;

            button {
              height: 40px;
              width: 100%;
              border-radius: 5px;
              font-size: 1.4rem;
              color: #191919;
              background-color: #ededed;
              cursor: pointer;
            }
          }

          &.menu {
            .menu-edit {
              display: flex;

              img {
                flex-grow: 0.5;
                width: 112px;
                height: 112px;
                margin-right: 12px;
              }

              .menu-input {
                flex-grow: 0.5;
                display: flex;
                flex-direction: column;

                input {
                  width: 100%;
                  height: 50px;
                  border: 1px solid #ededed;
                  border-radius: 5px;
                  padding: 0 12px;
                  font-size: 1.6rem;

                  &:last-child {
                    margin-top: 12px;
                  }
                }
              }
            }
          }
        }
        .add-image {
          label {
            width: 100%;
            margin-top: 12px;
            border: 1px solid #ededed;
            color: $primary;
            font-size: 1.6rem;
            @include flex-center();
            height: 40px;
            cursor: pointer;
          }
        }
      }

      .text-input {
        position: relative;
        margin-top: 12px;
        @include flex-center();

        input[type='text'] {
          width: 100%;
          height: 50px;
          border: 1px solid #ededed;
          border-radius: 5px;
          background-color: #fff;
          font-size: 1.6rem;
          color: #999;
          padding: 0 12px;

          &:not(:first-child) {
            margin-top: 12px;
          }
        }

        .delete-circle {
          position: absolute;
          right: 14px;

          img {
            cursor: pointer;
            width: 16px;
          }
        }
      }

      .add-input {
        width: 100%;
        margin-top: 12px;
        border: 1px solid #ededed;
        color: $primary;
        font-size: 1.6rem;
        @include flex-center();
        height: 40px;
        cursor: pointer;
      }

      .promotion-icon {
        margin-top: 12px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .icon-item {
          flex: 1 1 0;
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          input[type='checkbox'] {
            width: 25px;
            height: 25px;
            margin-right: 6px;
          }

          label {
            img {
              height: 29px;
            }
          }
        }
      }

      .check-box {
        display: flex;
        align-items: center;

        input[type='checkbox'] {
          width: 25px;
          height: 25px;
        }

        label {
          font-size: 1.4rem;
          color: #353535;
          margin-left: 7px;
        }
      }
    }

    .save-button {
      margin-top: 40px;
      button {
        cursor: pointer;
        width: 100%;
        height: 50px;
        background-color: $primary;
        color: #fff;
        font-size: 1.6rem;
        font-weight: bold;
        border-radius: 5px;
      }
    }
  }

  footer {
    display: none;
  }
}
</style>
