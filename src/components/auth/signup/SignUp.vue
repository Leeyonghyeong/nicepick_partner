<template>
  <main>
    <div class="company-register">
      <MobileHeader title="브랜드 관리자 회원가입" :back="true" :cart="false" />
      <Header />
      <div class="company-register-body">
        <div class="register-top">회원가입</div>
        <!-- 사업자 번호 -->
        <div class="register-item">
          <div class="item-top">
            <div class="title">사업자등록번호</div>
            <div class="noti">(사업자번호로 검색 후 브랜드 선택)</div>
          </div>
          <div class="input-zone">
            <input
              v-model="bizNumber"
              type="text"
              placeholder="사업자번호 예시. (123-12-12345)"
            />
            <button @click="getBrandInfo">검색</button>
          </div>
          <!--사업자 번호 검색 브랜드 목록 -->
          <div v-if="brandInfo.length > 0" class="brand-check-list">
            <label v-for="brand in brandInfo" :for="brand.id" :key="brand.id">
              <div class="check-box">
                <input
                  type="checkbox"
                  :id="brand.id"
                  @change="changeBrandCheck"
                  :brand-name="brand.brandName"
                />
                <div class="brand-name">{{ brand.brandName }}</div>
                <div class="brand-category">{{ brand.category }}</div>
              </div>
            </label>
          </div>
          <!--사업자 번호 검색 브랜드 목록 -->
        </div>
        <!-- 사업자 번호 -->
        <!-- 브랜드 -->
        <div class="register-item">
          <div class="item-top">
            <div class="title">브랜드</div>
            <div class="noti">(직접입력시 1개의 브랜드 명만 입력)</div>
          </div>
          <div class="input-zone">
            <input
              v-model="selectBrandName"
              ref="checkBrandNameEl"
              type="text"
              placeholder="브랜드명"
              :disabled="inputBrandAuto"
            />
            <button @click="changeDisabled">직접입력</button>
          </div>
        </div>
        <!-- 브랜드 -->
        <!-- 회사명 -->
        <div class="register-item no-button" v-if="!inputBrandAuto">
          <div class="item-top">
            <div class="title">회사명</div>
          </div>
          <div class="input-zone">
            <input
              v-model="companyName"
              type="text"
              placeholder="사업자등록증에 표기된 회사명"
            />
          </div>
        </div>
        <!-- 회사명 -->
        <!-- 대표자명 -->
        <div class="register-item no-button" v-if="!inputBrandAuto">
          <div class="item-top">
            <div class="title">대표자명</div>
          </div>
          <div class="input-zone">
            <input
              v-model="ownerName"
              type="text"
              placeholder="대표자가 2인 이상일 경우 ,로 구분"
            />
          </div>
        </div>
        <!-- 대표자명 -->
        <!-- 사업자등록증 -->
        <div class="register-item">
          <div class="item-top">
            <div class="title">사업자등록증</div>
            <div class="noti">(이미지 파일만 첨부)</div>
          </div>
          <div class="input-zone">
            <input
              id="fileUpload"
              type="file"
              placeholder="브랜드명"
              ref="fileEl"
              @change="getFileName"
            />
            <input
              type="text"
              disabled
              v-model="fileName"
              placeholder="파일을 첨부해주세요."
            />
            <label for="fileUpload">파일첨부</label>
          </div>
        </div>
        <!-- 사업자등록증 -->
        <!-- 업종 선택 -->
        <div class="register-item no-button">
          <div class="item-top">
            <div class="title">업종선택</div>
            <div class="noti">(사업자번호로 검색 후 브랜드 선택)</div>
          </div>
          <div class="input-zone">
            <select v-model="largeCategory" @change="changeLargeCategory">
              <option :value="undefined">1차 선택</option>
              <option
                v-for="category in largeCategoryArr"
                :key="category.id"
                :value="category"
              >
                {{ category.categoryName }}
              </option>
            </select>
            <select v-model="smallCategory">
              <option :value="''">2차 선택</option>
              <option
                v-for="category in smallCategoryArr"
                :key="category.id"
                :value="category.categoryName"
              >
                {{ category.categoryName }}
              </option>
            </select>
          </div>
        </div>
        <!-- 업종 선택 -->
        <div class="line"></div>
        <!-- 담당자 명 -->
        <div class="register-item no-button">
          <div class="item-top">
            <div class="title">담당자 명</div>
          </div>
          <div class="input-zone">
            <input v-model="rName" type="text" placeholder="이름 입력" />
          </div>
        </div>
        <!-- 담당자 명 -->
        <!-- 이메일 -->
        <div class="register-item no-button">
          <div class="item-top">
            <div class="title">이메일</div>
            <div class="noti">(이메일 주소는 ID로 사용됩니다)</div>
          </div>
          <div class="input-zone">
            <input
              v-model="rEmail"
              type="text"
              placeholder="아이디@도메인으로 입력"
            />
          </div>
        </div>
        <!-- 이메일 -->
        <!-- 비밀번호 -->
        <div class="register-item no-button">
          <div class="item-top">
            <div class="title">비밀번호</div>
          </div>
          <div class="input-zone">
            <input
              v-model="rPassword"
              type="password"
              placeholder="비밀번호 입력(영문+숫자+특수문자 8~16자)"
              @keyup="checkPasswordImg"
            />
            <div class="validation-password">
              <img
                v-if="rPasswordImgName === 'default'"
                src="../../../assets/signup/default_password.png"
                alt="default_password"
              />
              <img
                v-else-if="rPasswordImgName === 'danger'"
                src="../../../assets/signup/danger_password.png"
                alt="danger_password"
              />
              <img
                v-else
                src="../../../assets/signup/safe_password.png"
                alt="safe_password"
              />
            </div>
          </div>
          <div class="input-zone rePassword">
            <input
              v-model="rRePassword"
              type="password"
              placeholder="비밀번호 재확인(영문+숫자+특수문자 8~16자)"
            />
          </div>
        </div>
        <!-- 비밀번호 -->
        <!-- 연락처 -->
        <div class="register-item no-button">
          <div class="item-top">
            <div class="title">휴대폰 번호</div>
          </div>
          <div class="input-zone">
            <input
              v-model="rPhone"
              type="text"
              placeholder="'-'제외한 휴대폰 번호"
            />
          </div>
        </div>
        <!-- 연락처 -->
      </div>
      <div class="big-line"></div>
      <div class="register-agree-zone agree-mobile">
        <div class="agree-zone-top">
          <div class="title">서비스 이용 약관에 동의해 주세요</div>
        </div>
        <div class="agree-all-check">
          <input
            v-model="isAllCheck"
            type="checkbox"
            id="allCheck"
            @change="allCheck"
          />
          <label for="allCheck">네, 모두 동의합니다</label>
        </div>
        <div class="agree-item">
          <div class="check-box-zone">
            <input
              type="checkbox"
              id="isService"
              v-model="isService"
              @change="allCheckStatus"
            />
            <label for="isService">(필수) 서비스 이용 약관 동의</label>
          </div>
          <a
            href="https://nicepick.notion.site/112ba598e8d34c39b6b3ab29d6c9e34a"
            target="_blank"
            class="more-view"
            >자세히 보기</a
          >
        </div>
        <div class="agree-item">
          <div class="check-box-zone">
            <input
              type="checkbox"
              id="isPrivacy"
              v-model="isPrivacy"
              @change="allCheckStatus"
            />
            <label for="isPrivacy">(필수) 개인정보 수집 이용 동의</label>
          </div>
          <a
            href="https://nicepick.notion.site/b92941c41e6e4986b60a197ac607f1da"
            target="_blank"
            class="more-view"
            >자세히 보기</a
          >
        </div>
        <div class="agree-item">
          <div class="check-box-zone">
            <input
              type="checkbox"
              id="isMarketing"
              v-model="isMarketing"
              @change="allCheckStatus"
            />
            <label for="isMarketing"
              >(선택) 창업 정보 및 이벤트 정보 수신 동의</label
            >
          </div>
          <a
            href="https://nicepick.notion.site/e5db5ba7dd064fea86a0a0057d042654"
            target="_blank"
            class="more-view"
            >자세히 보기</a
          >
        </div>
      </div>

      <div class="register-agree-zone agree-desktop">
        <div class="agree-all-check">
          <div class="title">약관동의</div>
          <div class="agree-check">
            <label for="allCheck">전체 동의합니다.</label>
            <input
              v-model="isAllCheck"
              type="checkbox"
              id="allCheck"
              @change="allCheck"
            />
          </div>
        </div>
        <div class="agree-item">
          <label for="isService">[필수] 서비스 이용 약관 동의</label>
          <div class="check-box-zone">
            <a
              href="https://nicepick.notion.site/112ba598e8d34c39b6b3ab29d6c9e34a"
              target="_blank"
              class="more-view"
              >자세히 보기</a
            >
            <input
              type="checkbox"
              id="isService"
              v-model="isService"
              @change="allCheckStatus"
            />
          </div>
        </div>
        <div class="agree-item">
          <label for="isPrivacy">[필수] 개인정보 수집 이용 동의</label>
          <div class="check-box-zone">
            <a
              href="https://nicepick.notion.site/b92941c41e6e4986b60a197ac607f1da"
              target="_blank"
              class="more-view"
              >자세히 보기</a
            >
            <input
              type="checkbox"
              id="isPrivacy"
              v-model="isPrivacy"
              @change="allCheckStatus"
            />
          </div>
        </div>
        <div class="agree-item">
          <label for="isMarketing"
            >[선택] 창업 정보 및 이벤트 정보 수신 동의</label
          >
          <div class="check-box-zone">
            <a
              href="https://nicepick.notion.site/e5db5ba7dd064fea86a0a0057d042654"
              target="_blank"
              class="more-view"
              >자세히 보기</a
            >
            <input
              type="checkbox"
              id="isMarketing"
              v-model="isMarketing"
              @change="allCheckStatus"
            />
          </div>
        </div>
      </div>
      <div class="register-submit-button">
        <button @click="rSubmit">가입하기</button>
      </div>
      <div class="close-register">
        이미 가입하셨나요? <span @click="router.push('/')">로그인하기</span>
      </div>
    </div>
  </main>
  <Footer v-if="!checkMobile" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MobileHeader from '../../common/MobileHeader.vue'
import Header from '../../common/Header.vue'
import Footer from '../../common/Footer.vue'
import { LargeCategory, SmallCategory } from '../../../types/category'
import api from '../../../config/axios.config'
import { toastAlert } from '../../../functions/alert'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

interface BrandInfo {
  id: string
  brandName: string
  category: string
}

const store = useStore()
const router = useRouter()

const checkMobile = ref<boolean>(false)

const bizNumber = ref<string>('')
const brandInfo = ref<BrandInfo[]>([])
const selectBrand = ref<string[]>([])
const selectBrandNameArr = ref<string[]>([])
const selectBrandName = ref<string>('')
const inputBrandAuto = ref<boolean>(true)
const companyName = ref<string>('')
const ownerName = ref<string>('')

const checkBrandNameEl = ref<HTMLInputElement>()

const fileEl = ref<HTMLInputElement>()
const fileName = ref<string>('')

const largeCategoryArr = ref<LargeCategory[]>([])
const largeCategory = ref<LargeCategory>()
const smallCategoryArr = ref<SmallCategory[]>([])
const smallCategory = ref<string>('')

const rName = ref<string>('')
const rEmail = ref<string>('')
const rPassword = ref<string>('')
const rRePassword = ref<string>('')
const rPhone = ref<string>('')

const rPasswordImgName = ref<string>('default')

const isAllCheck = ref<boolean>(false)
const isService = ref<boolean>(false)
const isPrivacy = ref<boolean>(false)
const isMarketing = ref<boolean>(false)

const getBrandInfo = async () => {
  brandInfo.value = []
  selectBrand.value = []
  selectBrandNameArr.value = []
  selectBrandName.value = ''
  if (checkBizNumber()) {
    const result = await api.get(`brand/biz/${bizNumber.value}`)
    brandInfo.value = result.data

    if (brandInfo.value?.length === 0) {
      toastAlert(
        '브랜드정보가 조회되지 않습니다. </br>브랜드명을 직접 입력해 주시기 바랍니다.'
      )
    }
  }
}

const checkBizNumber = (): boolean => {
  const regBizNumber = /^([0-9]{3})*-([0-9]{2})*-([0-9]{5})$/

  if (!bizNumber.value) {
    brandInfo.value = []
    toastAlert('사업자 등록번호를 입력해 주세요')
    return false
  } else if (!regBizNumber.test(bizNumber.value)) {
    brandInfo.value = []
    toastAlert('사업자 번호가 올바르지 않습니다')
    return false
  } else {
    return true
  }
}

const changeBrandCheck = (e: Event) => {
  const checkBoxEl: HTMLInputElement = e.composedPath()[0] as HTMLInputElement
  const divEl: HTMLDivElement = e.composedPath()[1] as HTMLDivElement
  const brandName: string = checkBoxEl.getAttribute('brand-name') as string

  if (checkBoxEl.checked) {
    inputBrandAuto.value = true
    companyName.value = ''
    ownerName.value = ''

    selectBrand.value.push(checkBoxEl.id)
    selectBrandNameArr.value.push(brandName)
    divEl.setAttribute('style', 'background-color: rgb(21, 105, 255, 0.1)')

    selectBrandName.value = selectBrandNameArr.value.toString()
  } else {
    for (let i = 0; i < selectBrand.value.length; i++) {
      if (selectBrand.value[i] === checkBoxEl.id) {
        selectBrand.value.splice(i, 1)
      }
      if (selectBrandNameArr.value[i] === brandName) {
        selectBrandNameArr.value.splice(i, 1)
      }
    }
    selectBrandName.value = selectBrandNameArr.value.toString()
    divEl.removeAttribute('style')
  }
}

const changeDisabled = () => {
  if (checkBrandNameEl.value) {
    if (selectBrand.value.length === 0) {
      inputBrandAuto.value = false
      setTimeout(() => {
        if (checkBrandNameEl.value) checkBrandNameEl.value.focus()
      }, 100)
      if (checkBrandNameEl.value) checkBrandNameEl.value.focus()
    }
  }
}

const getFileName = () => {
  fileName.value = fileEl.value?.files?.item(0)?.name as string
}

const checkEmail = async (): Promise<boolean> => {
  if (!rEmail.value) {
    toastAlert('이메일을 입력해 주세요')
    return false
  } else {
    const regEmail =
      /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/

    if (!regEmail.test(rEmail.value)) {
      toastAlert('올바른 이메일 형식이 아닙니다')
      return false
    } else {
      const result = await api.get(`/auth/user/${rEmail.value}`)
      const resultString = result.data

      if (resultString === 'Not Exist') {
        return true
      } else if (resultString === 'Exist') {
        toastAlert('이메일이 이미 존재합니다.')
        return false
      } else {
        toastAlert(`${resultString}로 소셜가입 되어있는 이메일입니다.`)
        return false
      }
    }
  }
}

const checkPasswordImg = () => {
  const regPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~$@$!%^*#?&()<>_=+])[A-Za-z\d~$@$!%^*#?&()<>_=+]{8,16}$/

  if (!regPassword.test(rPassword.value)) {
    rPasswordImgName.value = 'danger'
  } else {
    rPasswordImgName.value = 'safe'
  }
}

const checkPhone = (): boolean => {
  if (!rPhone.value) {
    toastAlert('휴대폰 번호를 입력해 주세요.')
    return false
  } else {
    const regPhone = /^01([0|1|6|7|8|9]{1})([0-9]{3,4})([0-9]{4})$/
    if (!regPhone.test(rPhone.value)) {
      toastAlert('휴대폰 번호가 올바르지 않습니다.')
      return false
    } else {
      return true
    }
  }
}

const allCheck = () => {
  if (isAllCheck.value) {
    isService.value = true
    isPrivacy.value = true
    isMarketing.value = true
  } else {
    isService.value = false
    isPrivacy.value = false
    isMarketing.value = false
  }
}

const allCheckStatus = () => {
  if (!isService.value || !isPrivacy.value || !isMarketing.value) {
    isAllCheck.value = false
  } else {
    isAllCheck.value = true
  }
}

const rSubmit = async () => {
  if (!checkBizNumber()) {
    return
  } else if (!selectBrandName.value) {
    toastAlert('브랜드 명을 입력해 주세요')
    return
  } else if (!inputBrandAuto.value && !companyName.value) {
    toastAlert('회사명을 입력해 주세요')
    return
  } else if (!inputBrandAuto.value && !ownerName.value) {
    toastAlert('대표자명을 입력해 주세요')
    return
  } else if (!largeCategory.value || !smallCategory.value) {
    toastAlert('업종을 선택해 주세요')
    return
  } else if (!rName.value) {
    toastAlert('담당자명을 입력해 주세요')
    return
  } else if (!(await checkEmail())) {
    return
  } else if (!rPassword.value) {
    toastAlert('비밀번호를 입력해 주세요')
    return
  } else if (rPasswordImgName.value !== 'safe') {
    toastAlert('비밀번호가 안전하지 않습니다')
    return
  } else if (!rRePassword.value || rPassword.value !== rRePassword.value) {
    toastAlert('비밀번호가 맞지 않습니다')
    return
  } else if (!checkPhone()) {
    return
  } else if (!isService.value || !isPrivacy.value) {
    toastAlert('필수 항목에 체크해 주시기 바랍니다')
    return
  }

  let certificateImg = ''
  let imgKey = ''

  if (fileEl.value) {
    if (fileEl.value.files) {
      if (fileEl.value.files.length === 0) {
        toastAlert('사업자 등록증을 등록해 주세요')
        return
      } else {
        const formData: FormData = new FormData()
        formData.append('file', fileEl.value.files[0])

        const result = await api.post('/auth/signup/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        const key = result.data.key
        imgKey = key

        const imgURL = await api.post('/auth/signup/upload/url', {
          key: imgKey,
        })
        certificateImg = imgURL.data
      }
    }
  }

  const payload = {
    bizNumber: bizNumber.value,
    brandInfo: selectBrand.value,
    brandName: selectBrandName.value,
    companyName: companyName.value,
    ownerName: ownerName.value,
    certificateImg,
    certificateImgkey: imgKey,
    largeCategoryName: largeCategory.value?.categoryName,
    smallCategoryName: smallCategory.value,
    email: rEmail.value,
    password: rPassword.value,
    rePassword: rRePassword.value,
    userName: rName.value,
    phoneNumber: rPhone.value,
    role: 'COMPANY',
    isMarketing: isMarketing.value,
    isActive: true, // 나중에 바꿔야 됨
  }

  const result = await api.post('/auth/signup', payload)

  if (result.data.success) {
    const accessToken = result.data.accessToken
    const user = result.data.user
    const brandId = result.data.brandId

    localStorage.setItem('accessToken', accessToken)

    const userData = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    }

    store.commit('auth/updateState', {
      user: userData,
      isLogin: true,
      brandId,
    })

    router.push('/management')
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const getAllCategory = async () => {
  const result = await api.get('/category')
  largeCategoryArr.value = result.data.largeCategory
}

const changeLargeCategory = () => {
  if (largeCategory.value) {
    smallCategoryArr.value = largeCategory.value.smallCategory
    smallCategory.value = ''
  }
}

getAllCategory()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .company-register {
    .company-register-body {
      @include pc-container();

      .register-top {
        margin-top: 32px;
        border-bottom: 1px solid #eee;
        font-size: 1.8rem;
        color: #353535;
        padding-bottom: 11px;
        padding-left: 15px;
        /*margin-bottom: 30px;*/
      }

      .register-item {
        background-color: #f9f9f9;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-left: 55px;
        padding-right: 329px;
        padding-top: 26px;

        .brand-check-list {
          width: 400px;
          height: 300px;
          margin-top: 10px;
          margin-left: 390px;
          border: 1px solid #dcdcdc;
          background-color: #fff;
          box-sizing: border-box;
          overflow-y: scroll;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */

          &::-webkit-scrollbar {
            display: none;
          }

          label {
            width: 100%;
            height: 50px;
            cursor: pointer;
          }

          .check-box {
            font-size: 1.6rem;
            padding: 0 20px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;

            input {
              width: 0px;
              height: 0px;
              position: absolute;
              top: 0;
              left: 0;
            }

            .brand-category {
              color: #888;
              font-size: 1.4rem;
            }
          }
        }

        &.no-button {
          padding-right: 435px;
        }

        &:last-child {
          padding-bottom: 50px;
        }

        .item-top {
          line-height: 1.3;
          .title {
            font-size: 1.6rem;
            color: #353535;

            &::after {
              content: '*';
              color: #fe3d3d;
            }
          }

          .noti {
            font-size: 1.2rem;
            color: #888;
          }
        }

        .input-zone {
          display: flex;
          align-items: center;
          position: relative;

          &.rePassword {
            margin-top: 7px;
            margin-left: 390px;
          }

          input {
            width: 400px;
            height: 40px;
            border: 1px solid #cfcfcf;
            background-color: #fff;
            font-size: 1.4rem;
            padding: 0 20px;

            &::placeholder {
              color: #c7c7c7;
            }
          }

          button,
          label {
            width: 95px;
            height: 40px;
            font-size: 1.4rem;
            color: #fff;
            background-color: $primary;
            border-radius: 10px;
            margin-left: 11px;
            cursor: pointer;
          }

          #fileUpload {
            display: none;
          }

          label {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          select {
            width: 195px;
            height: 40px;
            border: 1px solid #cfcfcf;

            &:first-child {
              margin-right: 10px;
            }
          }

          .validation-password {
            position: absolute;
            right: 13px;

            img {
              width: 100%;
            }
          }
        }
      }
    }
    .register-agree-zone {
      @include pc-container();
      border-top: 1px solid #eee;
      padding-top: 40px;
      padding-left: 445px;
      box-sizing: border-box;

      &.agree-mobile {
        display: none;
      }

      .agree-all-check {
        width: 400px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .title {
          font-size: 1.8rem;
          color: #353535;
          font-weight: bold;
        }

        .agree-check {
          display: flex;
          align-items: center;
          font-size: 1.2rem;
          color: #353535;

          input {
            margin-left: 8px;
          }
        }
      }
      .agree-item {
        margin-top: 10px;
        width: 400px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        label {
          font-size: 1.2rem;
          color: #888;
        }

        .check-box-zone {
          display: flex;
          align-items: center;

          a {
            color: #353535;
            text-decoration: none;
            margin-right: 9px;
          }
        }
      }
    }

    .register-submit-button {
      @include pc-container();
      margin-top: 70px;
      margin-bottom: 80px;
      text-align: center;

      button {
        width: 400px;
        background-color: $primary;
        color: #fff;
        font-size: 2rem;
        height: 50px;
        border-radius: 50px;
        cursor: pointer;
      }
    }

    .close-register {
      display: none;
    }
  }
}

@include mobile {
  .company-register {
    width: 100%;
    background: #fff;

    .company-register-body {
      margin-top: 24px;
      padding: 0 24px;

      .register-top {
        display: none;
      }

      .register-item {
        margin-bottom: 16px;
        .item-top {
          display: flex;
          font-size: 1.4rem;

          .title {
            color: #191919;

            &::after {
              content: '*';
              color: #ff0000;
              margin-right: 5px;
            }
          }

          .noti {
            color: #999;
          }
        }

        .input-zone {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          position: relative;

          input {
            padding: 0;
            border: none;
            height: 50px;
            font-size: 1.6rem;
            background: #f9fcff;
            flex-grow: 1;
            padding-left: 12px;
            display: flex;

            &::placeholder {
              color: #999;
            }

            &:disabled {
              color: #999;
              background: #f9fcff;
            }
          }

          button,
          label {
            padding: 0;
            border: 1px solid $primary;
            height: 50px;
            width: 64px;
            margin-left: 4px;
            display: flex;
            color: $primary;
            justify-content: center;
            align-items: center;
            font-size: 1.4rem;
            font-weight: bold;
            background: #fff;
            border-radius: 5px;
          }

          #fileUpload {
            display: none;
          }

          select {
            width: calc(50% - 3.5px);
            height: 50px;
            background: #f9fcff;
            border: none;
            color: #191919;
            font-size: 1.6rem;
          }

          .validation-password {
            position: absolute;
            height: 20px;
            right: 12px;
            top: 16px;

            img {
              width: 100%;
            }
          }
        }

        .brand-check-list {
          margin-top: 5px;
          width: 100%;
          height: 150px;
          display: flex;
          flex-direction: column;
          border-radius: 5px;
          border: solid 1px #dcdcdc;
          background-color: #fff;
          margin-bottom: 5px;
          overflow-y: scroll;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */

          &::-webkit-scrollbar {
            display: none;
          }

          label {
            width: 100%;
            height: 50px;
          }

          .check-box {
            font-size: 1.6rem;
            padding: 0 20px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;

            input {
              width: 0px;
              height: 0px;
              position: absolute;
              top: 0px;
              left: 0px;
            }

            .brand-category {
              color: gray;
              font-size: 1.4rem;
            }
          }
        }
      }

      .line {
        border-bottom: 1px solid #ededed;
        margin-bottom: 24px;
      }
    }

    .big-line {
      width: 100%;
      height: 12px;
      background: #f8f8fa;
      margin-bottom: 24px;
    }

    .register-agree-zone {
      padding: 0 24px;

      &.agree-desktop {
        display: none;
      }

      input[type='checkbox'] {
        position: absolute;
        width: 0px;
        height: 0px;
      }

      label {
        height: 14px;
        display: flex;
        align-items: center;
      }

      input[type='checkbox'] + label:before {
        content: '\2713';
        color: #fff;
        font-weight: bold;
        width: 2rem;
        height: 2rem;
        background: #dcdcdc;
        text-align: center;
        line-height: 2rem;
        border-radius: 50%;
        font-size: 1.6rem;
        display: inline-block;
        margin-right: 12px;
      }

      input[type='checkbox']:checked + label:before {
        content: '\2713';
        color: #fff;
        font-weight: bold;
        background: $primary;
      }

      .agree-zone-top {
        margin-bottom: 25px;
        .title {
          font-size: 1.6rem;
          color: #191919;
          font-weight: bold;
        }
      }

      .agree-all-check {
        font-size: 1.4rem;
        color: #191919;
        font-weight: bold;
        padding-bottom: 22px;
        border-bottom: solid 1px #ededed;
        margin-bottom: 13px;
      }

      .agree-item {
        font-size: 1.2rem;
        color: #191919;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;

        .more-view {
          color: #999;
          padding-bottom: 2px;
          border-bottom: solid 1.5px #dbdbdb;
          text-decoration: none;
        }
      }
    }

    .register-submit-button {
      padding: 11px 24px 0 24px;
      display: flex;
      justify-content: center;
      margin-bottom: 16px;

      button {
        width: 100%;
        border: none;
        height: 50px;
        @include flex-center();
        border-radius: 5px;
        color: #fff;
        background: $primary;
        font-size: 2rem;
        font-weight: bold;
      }
    }

    .close-register {
      display: flex;
      justify-content: center;
      font-size: 1.4rem;
      color: #767676;
      margin-bottom: 50px;

      span {
        color: #191919;
        font-weight: bold;
        margin-left: 4px;
      }
    }
  }

  footer {
    display: none;
  }
}
</style>
