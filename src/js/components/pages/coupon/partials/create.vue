<template lang="pug">
  div.inner-content
    div.row.nav-page-header
      div.col-lg-6.col-md-6.col-sm-6.col-xs-6
        p.page-title {{ $i18n.t('coupon.createCoupon') }}
        p.page-description {{ $i18n.t('coupon.createCouponDescription') }}

    form(autocomplete="on" onsubmit="event.preventDefault();")
      div.row.section.nav-create-coupon
        div.row.box
          <!--Right box-->
          div.right-box.col-lg-6.col-md-6.col-sm-12.col-xs-12
            div.row
              div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                span.label {{ $i18n.t('coupon.offCode') }}
              div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                input(v-focus="" v-validate="'required'" :class="{'input-danger': errors.has('code')}" v-bind:data-vv-as="$i18n.t('coupon.offCode')" type="text"  id="code" v-model="code" name="code"  :placeholder="$i18n.t('coupon.sampleCode')" autofocus tabindex="1"  )
                div.ta-right(v-if="validation('code')")
                  span.text-danger {{ errors.first('code') }}

            div.row
              div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                input(name="coupon-type" v-model="type" value="webservice" type="radio" id="rdoWebservice")
                label.dis-ib.m-t-5(for="rdoWebservice")
                  span
                  | {{ $i18n.t('coupon.webservice') }}
              div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12.no-margin(v-on:select="selectedWebservice" id="webservice_id" name="webservice_id" v-bind:data="webserviceSelection" v-bind:class="{'disable' : type == 'easypay', 'input-danger': errors.has('webservice_id')}" :placeholder="$i18n.t('webservice.selectWebservice')" tabindex="2" )
                div.ta-right(v-if="validation('webservice_id')")
                  span.text-danger {{ errors.first('webservice_id') }}

            div.row
              div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                input(name="coupon-type" v-model="type" value="easypay" type="radio" id="rdoEasypay")
                label.dis-ib.m-t-5(for="rdoEasypay")
                  span
                  | {{ $i18n.t('coupon.easypay') }}
              div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                zarin-link.no-margin(v-on:select="selectedEasypay" v-bind:class="{'disable' : type == 'webservice', 'input-danger': errors.has('easypay_id')}"  :placeholder="$i18n.t('easypay.selectEasypay')")
                div.ta-right(v-if="validation('easypay_id')")
                  span.text-danger {{ errors.first('easypay_id') }}

            div.row
              div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                span.label {{ $i18n.t('coupon.expirationDate') }}
              div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                date-picker.persian-num(v-model="expired_at" :min="today")
                div.ta-right(v-if="validation('expired_at')")
                  span.text-danger {{ errors.first('expired_at') }}

          <!--Left box-->
          div.right-box.col-lg-6.col-md-6.col-sm-12.col-xs-12
            div.row
              div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                input( type="checkbox" v-model="visibleLimit" id="chkLimit"  name="limit" tabindex="5")
                label(for="chkLimit")
                  span
                  | {{ errors.first('coupon.limit') }}

              div.col-lg-8.col-md-8.col-sm-12.col-xs-12(v-bind:class="{'disable' : !visibleLimit}")
                input.ltr-input(v-validate="'numeric'"  id="limit" name="limit" v-bind:data-vv-as="$i18n.t('coupon.limit')" :class="{'input-danger':errors.has('limit')}" type="text" v-model="limit" :placeholder="$i18n.t('coupon.limitPlaceHolder')")
                div.ta-right(v-if="validation('limit')")
                  span.text-danger {{ errors.first('limit') }}

            div.row
              div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                span.label {{ $i18n.t('coupon.minAmount') }}
              div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                span.text-help {{ $i18n.t('coupon.minAmountDescription') }}
                vue-numeric.ltr-input(v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('coupon.minAmount')" :class="{'input-danger': errors.has('min_amount')}" :currency="$i18n.t('webservice.toman')" separator="," v-model="min_amount" name="min_amount" id="min_amount" :placeholder="$i18n.t('coupon.minAmountPlaceHolder')" tabindex="6")
                div.ta-right(v-if="validation('min_amount')")
                  span.text-danger {{ errors.first('min_amount') }}

            div.row
              div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                span.label {{ $i18n.t('coupon.offPercent') }}
              div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                input.ltr-input(v-validate="'required|numeric|min_value:1|max_value:99'" maxlength="3"  v-bind:data-vv-as="$i18n.t('coupon.offPercent')" :class="{'input-danger': errors.has('percent')}" type="text" v-model="percent" name="percent" id="percent" :placeholder="$i18n.t('coupon.offPercentPlaceHolder')" tabindex="8")
                div.ta-right(v-if="validation('percent')")
                  span.text-danger {{ errors.first('percent') }}

            div.row
              div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                span.label {{ $i18n.t('coupon.maxAmount') }}
              div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                span.text-help {{ $i18n.t('coupon.maxAmountDescription') }}
                vue-numeric.ltr-input(v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('coupon.maxAmount')" :class="{'input-danger': errors.has('max_amount')}" :currency="$i18n.t('webservice.toman')" separator="," v-model="max_amount" name="max_amount" id="max_amount"  :placeholder="$i18n.t('coupon.maxAmountPlaceHolder')" tabindex="7")
                div.ta-right(v-if="validation('max_amount')")
                  span.text-danger {{ errors.first('max_amount') }}

            div.row.nav-button
              div.col-xs
                button.btn.success.pull-left(@click="validateForm" tabindex="9") {{$i18n.t('coupon.createCoupon')}}
                  svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
  import selectbox from '../../partials/selectbox.vue';
  import zarinLink from '../../partials/zarinlinks';
  import VueNumeric from 'vue-numeric';

  export default {
    name: 'pages-coupon-partials-create',
    data() {
      return {
        loading: false,
        today: moment().add(1, 'd').format('jYYYY/jMM/jDD'),
        visibleLimit: false,

        code: '',
        max_amount: '',
        min_amount: '',
        webservice_id: '',
        easypay_id: '',
        expired_at: moment().add(1, 'd').format('jYYYY/jMM/jDD'),
        limit: '',
        type: 'webservice',
        percent: '',
      }
    },
    computed: {
      webserviceSelection() {
        if (this.$store.state.auth.user.webservices) {
          let webservices = this.$store.state.auth.user.webservices.filter(
              function(webservice) {
                return webservice.status;
              }).map(function(webservice) {
            return {
              'title': webservice.name,
              'value': webservice.entity_id
            }
          });

          let webserviceAll = {
            'title': 'همه',
            'value': 'all'
          };

          webservices.unshift(webserviceAll);
          return webservices;
        }
      },
      validationErrors() {
        return this.$store.state.alert.validationErrors;
      },
    },
    created() {
      store.commit('clearValidationErrors');
    },
    methods: {
      selectExpiredDate(day) {
        this.expired_at = day;
      },
      validateForm() {
        this.$validator.validateAll({
          code: this.code,
          min_amount: this.min_amount,
          limit: this.limit,
          max_amount: this.max_amount,
          percent: this.percent

        }).then((result) => {
          if (result) {
            this.createCoupon();
          }
        });
      },
      selectedWebservice(entityId) {
        this.webservice_id = entityId;
        this.easypay_id = '';
      },
      selectedEasypay(entityId) {
        this.easypay_id = entityId;
        this.webservice_id = '';
      },
      createCoupon() {
        this.loading = true;

        let couponData = {
          code: this.code,
          discount: {
            max_amount: this.max_amount,
            percent: this.percent
          },
          webservice_id: this.webservice_id,
          easypay_id: this.easypay_id,
          expired_at: moment(this.expired_at, 'jYYYY/jMM/jDD').
              format('YYYY-MM-DD'),
          limit: this.limit,
          min_amount: this.min_amount,
          type: this.type,
        };

        this.$store.state.http.requests['coupon.getIndex'].save(couponData).
            then(
                () => {
                  this.loading = false;
                  this.$router.push({name: 'coupon.index'})
                },
                (response) => {
                  this.loading = false;
                  store.commit('setValidationErrors',
                      response.data.validation_errors);
                  store.commit('flashMessage', {
                    text: response.data.meta.error_type,
                    type: 'danger'
                  });
                }
            )
      }
    },
    components: {
      selectbox,
      zarinLink,
      datePicker: VuePersianDatetimePicker,
      VueNumeric
    }
  }

</script>
