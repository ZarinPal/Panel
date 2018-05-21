<template lang="pug">
  div.inner-content
    div.row.nav-page-header
      div.col-lg-6.col-md-6.col-sm-12.col-xs-12
        p.page-description {{ $i18n.t('easypay.createEasypayDescription') }}

    div.col-xs-12.col-sm-12.col-md-12.col-lg-12.section.create-easypay
      form(autocomplete="on" onsubmit="event.preventDefault();")
        div.box
          <!--1-->
          div.body(v-bind:class="{'inactive-step' : step !== 1}")
            div.row
              div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                div.row
                  div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                    div.step-number(v-ripple="" v-bind:class="{'active-step-number' : step == 1}") ۱
                    div.step-line(v-bind:class="{'active-step-line' : step == 1}")

                  div.col-lg-11.col-md-11.sm-11.col-xs-11
                    p.form-title.ta-right {{$i18n.t('easypay.firstInfo')}}
                    p.form-message.ta-right {{$i18n.t('easypay.firstInfoMessage')}}

                    div.row.no-margin
                      span.input-icon.home-icon
                      input(v-focus="" v-validate="'required|min:3'" :class="{'input-danger': errors.has('title')}"  v-bind:data-vv-as="$i18n.t('easypay.title')" type="text" v-model="title" name="title" id="title" :placeholder= "$i18n.t('easypay.title')" tabindex="1")
                      div.ta-right(v-if="validation('title')")
                        span.text-danger {{ errors.first('title') }}

                    div.row.no-margin
                      span.input-icon.amount-icon
                      vue-numeric.ltr-input(v-validate="{ rules: {required: true}}" v-bind:data-vv-as="$i18n.t('transaction.amount')" :class="{'input-danger': errors.has('price')}" :currency="$i18n.t('webservice.toman')" separator="," v-model="price" name="price" :placeholder="$i18n.t('card.transferAmountTitle')")
                      div.ta-right(v-if="validation('price')")
                        span.text-danger {{ errors.first('price') }}

                    div.row.no-margin
                      textarea.col-lg-12.col-md-12.col-sm-12.col-xs-12(v-validate="'max:128'" :class="{'input-danger': errors.has('description')}" v-bind:data-vv-as="$i18n.t('easypay.description')" v-model="description" id="description" name="description" :placeholder= "$i18n.t('easypay.description')" tabindex="3")
                      div.ta-right(v-if="validation('description')")
                        span.text-danger {{ errors.first('description') }}
                    div.row.no-margin.nav-pay-to
                      div.col-lg-4.col-md-4.col-sm-12.col-xs-12.no-margin
                        input(name="easypay-type" v-model="payTo" value="purse" type="radio" @click="selectPayType" id="rdoPurse")
                        label(for="rdoPurse")
                          span
                          | {{ $i18n.t('user.purse') }}

                      div.col-lg-8.col-md-8.col-sm-12.col-xs-12.no-margin
                        purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" :class="{'disable' : payTo == 'webservice', 'input-danger': errors.has('purse')}" v-on:select="selectedPurse" :placeholder="$i18n.t('easypay.selectPurse')" tabindex="4")
                        div.ta-right(v-if="validation('purse')")
                          span.text-danger {{ errors.first('purse') }}

                    div.row.nav-pay-to
                      div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                        input(name="easypay-type" v-model="payTo" value="webservice" type="radio" @click="selectPayType" id="rdoWebservice")
                        label(for="rdoWebservice")
                          span
                          | {{ $i18n.t('coupon.webservice') }}

                      div.col-lg-8.col-md-8.col-sm-12.col-xs-12
                        selectbox.selectbox.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-on:select="selectedWebservice" v-bind:data="webserviceSelection" :class="{'disable' : payTo == 'purse', 'input-danger': errors.has('webservice_id')}" :placeholder="$i18n.t('easypay.selectWebservice')")
                        <!--div.ta-right(v-if="validation('webservice_id')")-->
                        <!--span.text-danger {{ errors.first('webservice_id') }}-->
                      div.col-lg-11.col-md-11.sm-11.col-xs-11
                        p.form-message.ta-right {{$i18n.t('easypay.firstInfoHelp')}}

                    div.cb
                    div.row.nav-buttons
                      button.btn.success.pull-right(v-ripple=""  @click="validateForm" tabindex="5") {{$i18n.t('easypay.createEasypay')}}
                        svg.material-spinner(v-if="isLoading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                          circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

              div.col-lg-5.col-md-5.col-sm-12.col-xs-12
          div.body
            <!--2-->
            div.row(v-bind:class="{'inactive-step' : step !== 2}")
              div.col-lg-12.col-md-12.col-sm-12.col-xs-12
                div.row
                  div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                    div.step-number(v-ripple=""  v-bind:class="{'active-step-number' : step == 2}") ۲
                    div.step-line(v-bind:class="{'active-step-line' : step == 2}")

                  div.col-lg-11.col-md-11.col-sm-11.col-xs-11
                    p.form-title.ta-right {{$i18n.t('easypay.orderForm')}}
                    p.form-message.ta-right {{$i18n.t('easypay.orderFormMessage')}}
                    <!--2-1-->
                    div.row.f-row
                      div.col-lg-3.col-md-3.col-sm-3.col-xs-12.nav-required-fields.m-t-15
                        div.ta-right
                          input(name="email-optional" v-model="requiredFields.email.checkbox" type="checkbox" id="chkEmail")
                          label(for="chkEmail")
                            span
                            | {{ $i18n.t('common.email')}}

                      div.nav-optional-radios.col-lg-9.col-md-9.col-sm-9.col-xs-12(v-if="requiredFields.email.checkbox")
                        div.row
                          div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                            input(name="email-optional" v-model="requiredFields.email.status" value="optional" type="radio" id="rdoEmailOptional")
                            label(for="rdoEmailOptional")
                              span
                              | {{ $i18n.t('easypay.optional') }}

                          div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                            input(name="email-optional" v-model="requiredFields.email.status" value="required" type="radio" id="rdoEmailMandatory")
                            label(for="rdoEmailMandatory")
                              span
                              | {{ $i18n.t('easypay.mandatory')}}

                          div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(name="emailPlaceholder" id="emailPlaceholder" v-model="emailPlaceholder" v-bind:data-vv-as="$i18n.t('webservice.description')" v-validate="'max:40'" :class="{'input-danger': errors.has('emailPlaceholder')}" type="text" :placeholder="$i18n.t('easypay.descriptionInHere')" )
                            div.ta-right(v-if="validation('emailPlaceholder')")
                              span.text-danger {{ errors.first('emailPlaceholder') }}

                    <!--2-2-->
                    div.row.f-row(v-bind:class="{'inactive-step' : step > 3}")
                      div.col-lg-3.col-md-3.col-sm-3.col-xs-12.nav-required-fields.m-t-15
                        div.ta-right
                          input(name="usernameOptional" v-model="requiredFields.name.checkbox" type="checkbox" id="chkUserName")
                          label(for="chkUserName")
                            span
                            | {{ $i18n.t('easypay.username')}}

                      div.nav-optional-radios.col-lg-9.col-md-9.col-sm-9.col-xs-12(v-if="requiredFields.name.checkbox")
                        div.row
                          div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                            input(name="usernameOptional" v-model="requiredFields.name.status" value="optional" type="radio" id="rdoUsernameOptional")
                            label(for="rdoUsernameOptional")
                              span
                              | {{ $i18n.t('easypay.optional')}}

                          div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                            input(name="usernameOptional" v-model="requiredFields.name.status" value="required" type="radio" id="rdoUsernameMandatory")
                            label(for="rdoUsernameMandatory")
                              span
                              | {{ $i18n.t('easypay.mandatory')}}

                          div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(name="usernamePlaceholder" id="usernamePlaceholder" v-model="usernamePlaceholder"  v-bind:data-vv-as="$i18n.t('webservice.description')" v-validate="'max:40'" :class="{'input-danger': errors.has('usernamePlaceholder')}" type="text" :placeholder="$i18n.t('easypay.descriptionInHere')" )
                            div.ta-right(v-if="validation('usernamePlaceholder')")
                              span.text-danger {{ errors.first('usernamePlaceholder') }}
                    <!--2-3-->
                    div.row.f-row
                      div.col-lg-3.col-md-3.col-sm-3.col-xs-12.nav-required-fields.m-t-15
                        div.ta-right
                          input(name="mobileOptional" v-model="requiredFields.mobile.checkbox" type="checkbox" id="chkMobile")
                          label(for="chkMobile")
                            span
                            | {{ $i18n.t('easypay.mobile') }}

                      div.nav-optional-radios.col-lg-9.col-md-9.col-sm-9.col-xs-12(v-if="requiredFields.mobile.checkbox")
                        div.row
                          div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                            input(name="mobileOptional" v-model="requiredFields.mobile.status" value="optional" type="radio" id="rdoMobileOptional")
                            label(for="rdoMobileOptional")
                              span
                              | {{ $i18n.t('easypay.optional')}}

                          div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                            input(name="mobileOptional" v-model="requiredFields.mobile.status" value="required" type="radio" id="rdoMobileMandatory")
                            label(for="rdoMobileMandatory")
                              span
                              | {{ $i18n.t('easypay.mandatory')}}

                          div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(name="mobilePlaceholder" id="mobilePlaceholder" v-model="mobilePlaceholder" v-bind:data-vv-as="$i18n.t('webservice.description')" v-validate="'max:40'" :class="{'input-danger': errors.has('mobilePlaceholder')}" type="text" :placeholder="$i18n.t('easypay.descriptionInHere')" )
                            div.ta-right(v-if="validation('mobilePlaceholder')")
                              span.text-danger {{ errors.first('mobilePlaceholder') }}

                    <!--2-4-->
                    div.row.f-row
                      div.col-lg-3.col-md-3.col-sm-3.col-xs-12.nav-required-fields.m-t-15
                        div.ta-right
                          input(name="mobileOptional" v-model="requiredFields.description.checkbox" type="checkbox" id="chkDescription")
                          label(for="chkDescription")
                            span
                            | {{ $i18n.t('easypay.description') }}

                      div.nav-optional-radios.col-lg-9.col-md-9.col-sm-9.col-xs-12(v-if="requiredFields.description.checkbox")
                        div.row
                          div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                            input(name="descriptionOptional" v-model="requiredFields.description.status" value="optional" type="radio" id="rdoDescriptionOptional")
                            label(for="rdoDescriptionOptional")
                              span
                              | {{ $i18n.t('easypay.optional')}}

                          div.col-lg-4.col-md-4.col-sm-6.col-xs-6.ta-right.m-t-15
                            input(name="descriptionOptional" v-model="requiredFields.description.status" value="required" type="radio" id="rdoDescriptionMandatory")
                            label(for="rdoDescriptionMandatory")
                              span
                              | {{ $i18n.t('easypay.mandatory')}}

                          div.col-lg-4.col-md-4.col-sm-12.col-xs-12
                            input(name="descriptionPlaceholder" id="descriptionPlaceholder" v-model="descriptionPlaceholder"  v-bind:data-vv-as="$i18n.t('webservice.description')" v-validate="'max:40'" :class="{'input-danger': errors.has('descriptionPlaceholder')}" type="text" :placeholder="$i18n.t('easypay.descriptionInHere')" )
                            div.ta-right(v-if="validation('descriptionPlaceholder')")
                              span.text-danger {{ errors.first('descriptionPlaceholder') }}

                    div.row
                      div.col-xs.nav-buttons
                        button.btn.success.pull-right(v-ripple=""  @click="validateFormStepTwo") {{$i18n.t('purse.nextStep')}}

          div.body
            <!--3-->
            div.row
              div.col-lg-7.col-md-7.col-sm-12.col-xs-12
                transition(name="fade"
                enter-active-class="fade-in"
                leave-active-class="fade-out")

                  div.row(v-bind:class="{'inactive-step' : step !== 3}")
                    div.col-lg-1.col-md-1.col-sm-1.col-xs-1
                      div.step-number(v-bind:class="{'active-step-number' : step == 3}") ۳
                      div.step-line(v-bind:class="{'active-step-line' : step == 3}")

                    div.col-lg-11.col-md-11.col-sm-11.col-xs-11
                      p.form-title.ta-right {{$i18n.t('easypay.limits')}}
                      p.form-message.ta-right {{$i18n.t('easypay.limitsMessage')}}

                      div.row
                        div.col-lg-7.col-md-7.col-sm-12.col-xs-12.nav-limit-checkbox
                          div.ta-right
                            input(name="optional"  v-model="limited" value='true' type="checkbox" id="chkLimitNumber")
                            label(for="chkLimitNumber")
                              span
                              | {{ $i18n.t('easypay.limitInNumber')}}

                          div.ta-right
                            input(name="optional" v-model="showReceipt" type="checkbox" id="chkEasypayReceipt")
                            label(for="chkEasypayReceipt")
                              span
                              | {{ $i18n.t('easypay.showEasypayReceipt')}}

                        div.no-margin.nav-optional-radios.col-lg-5.col-md-5.col-sm-12.col-xs-12
                          input(v-validate="'numeric'" v-show="limited" type="text" v-model="limit" :placeholder="$i18n.t('common.count')")

                        div.col-lg-12.col-md-12.col-xs-12.nav-urls
                          <!--Success redirect url-->
                          div.row.no-margin
                            input.input.ltr-input(v-validate="'url'"  :class="{'input-danger': errors.has('successfulRedirectUrl')}"   v-bind:data-vv-as="$i18n.t('easypay.successfulRedirectUrl')" type="text" v-model="successfulRedirectUrl"  name="successfulRedirectUrl" id="successfulRedirectUrl"  :placeholder= "$i18n.t('easypay.successfulRedirectUrl')" )
                            div.ta-right(v-if="validation('successfulRedirectUrl')")
                              span.text-danger {{ errors.first('successfulRedirectUrl') }}

                          <!--Failed redirect url-->
                          div.row.no-margin
                            input.input.ltr-input( v-validate="'url'"  :class="{'input-danger': errors.has('failedRedirectUrl')}"   v-bind:data-vv-as="$i18n.t('easypay.failedRedirectUrl')" type="text" v-model="failedRedirectUrl" id="failedRedirectUrl" name="failedRedirectUrl"  :placeholder= "$i18n.t('easypay.failedRedirectUrl')" )
                            div.ta-right(v-if="validation('failedRedirectUrl')")
                              span.text-danger {{ errors.first('failedRedirectUrl') }}

            div.row(v-bind:class="{'inactive-step' : step == 1}")
              div.col-xs.nav-buttons
                button.btn.success.pull-right.button(v-ripple="" @click="editAfterCreate") {{$i18n.t('common.save')}}
                  svg.material-spinner(v-if="editLoading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                    circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")

</template>

<script>
  import selectbox from '../../partials/selectbox.vue';
  import purse from '../../partials/purses.vue';
  import VueNumeric from 'vue-numeric';
  export default {
    name: 'pages-easypay-partials-create',
    data() {
      return {
        isLoading: false,
        editLoading: false,
        easypayEntityId: null, // value fill after create
        step: 1,
        fileHover: '',
        visibleEmail: '',   //  visible email options
        visibleName: '',    //  "   name    "
        visiblePhone: '',   //  "   phone   "
        messages: {},
        title: '',
        description: '',
        price: '',
        emailPlaceholder: '',
        usernamePlaceholder: '',
        mobilePlaceholder: '',
        descriptionPlaceholder: '',
        payTo: 'purse',
        purse: null,
        webservice_id: null,
        purse_name: null,
        requiredFields: {
          email: {
            checkbox: false,
            status: 'optional',
            placeholder: null
          },
          name: {
            checkbox: false,
            status: 'optional',
            placeholder: null
          },
          mobile: {
            checkbox: false,
            status: 'optional',
            placeholder: null
          },
          description: {
            checkbox: false,
            status: 'optional',
            placeholder: null
          },
        },
        showReceipt: false,
        successfulRedirectUrl: null,
        failedRedirectUrl: null,
        limited: false,
        limit: 0,
      }
    },
    computed: {
      webserviceSelection() {
        if (this.$store.state.auth.user.webservices) {
          return this.$store.state.auth.user.webservices.filter(
              function(webservice) {
                return webservice.status;
              }).map(function(webservice) {
            return {
              'title': webservice.name,
              'value': webservice.entity_id
            }
          });
        }
      },
      pursesSelection() {
        if (this.$store.state.auth.user.purses) {
          return this.$store.state.auth.user.purses.map(function(purse) {
            return {
              'title': '<span class="wallet-color color-' + purse.purse +
              '"></span>' + purse.name,
              'value': purse.purse
            }
          });
        }
      },
    },
    methods: {
      validateForm() {
        this.$validator.validateAll({
          title: this.title,
          price: this.price,
          description: this.description
        }).then((result) => {
          if (result) {
            this.stepTwo();
          }
        });
      },
      validateFormStepTwo() {
        console.log(this.emailPlaceholder);
        this.$validator.validateAll({
          emailPlaceholder: this.emailPlaceholder,
          usernamePlaceholder: this.usernamePlaceholder,
          mobilePlaceholder: this.mobilePlaceholder,
          descriptionPlaceholder: this.descriptionPlaceholder,

        }).then((result) => {
          if (result) {

            this.stepThree();
          }
        });
      },
      removeErrors(field) {
        !!this[field] && this.errors.remove(field);
      },
      selectPayType() {
        this.webservice_id = null;
        this.purse = null;
        this.purse_name = null;
      },
      selectedPurse(purseId) {
        this.purse = purseId;
        this.purse_name = this.getPurseName(purseId);
        this.webservice_id = null;
      },
      selectedWebservice(entityId) {
        this.webservice_id = entityId;
        this.purse = null;
      },
      stepTwo() {
        if ((this.payTo === 'purse' && !this.purse) ||
            (this.payTo === 'webservice' && !this.webservice_id)) {
          this.errors.add(
              'purse',
              this.$i18n.t('easypay.selectPurseOrWebserviceId'),
              'api'
          );
          return;
        }
        if (this.purse || this.webservice_id) {
          //create easypay here
          this.createEasypay();
        } else {
          if (this.payTo == 'purse') {
            let purseValidationError = [
              {
                input: 'purse',
                message: 'The purse field is required.',
                translation_key: 'validation.required',
              }];
            store.commit('setValidationErrors', purseValidationError);
          } else if (this.payTo == 'webservice') {
            let webserviceValidationError = [
              {
                input: 'webservice_id',
                message: 'The webservice is required.',
                translation_key: 'validation.required',
              }];
            store.commit('setValidationErrors', webserviceValidationError);
          }
        }
      },
      stepThree() {
        this.step++;
      },
      createEasypay() {
        this.isLoading = true;
        let purseName = null;
        if (this.purse_name) {
          purseName = this.purse_name.name
        }
        let easyPayData = {
          title: this.title,
          description: this.description,
          price: this.price,
          purse: this.purse,
          emailPlaceholder: this.emailPlaceholder,
          usernamePlaceholder: this.usernamePlaceholder,
          mobilePlaceholder: this.mobilePlaceholder,
          descriptionPlaceholder: this.descriptionPlaceholder,
          webservice_id: this.webservice_id,
          purse_name: purseName,
          requiredFields: {
            email: {
              status: 'hidden',
              placeholder: null
            },
            name: {
              status: 'hidden',
              placeholder: null
            },
            mobile: {
              status: 'hidden',
              placeholder: null
            },
            description: {
              status: 'hidden',
              placeholder: null
            },
          },
        };
        this.$store.state.http.requests['easypay.getList'].save(easyPayData).
            then(
                (response) => {
                  this.easypayEntityId = response.data.data.entity_id;
                  this.addEasypayToState(response.data.data);
                  this.step++;
                  this.isLoading = false;
                },
                (response) => {
                  this.isLoading = false;
                  store.commit('setValidationErrors',
                      response.data.validation_errors);
                  store.commit('flashMessage', {
                    text: response.data.meta.error_type,
                    important: false,
                    type: 'danger'
                  });
                }
            );
      },
      editAfterCreate() {
        this.editLoading = true;
        this.handleShowReceipt();
        if (!this.limited) {
          this.limit = 0;
        }
        let easyPayData = {
          isLoading: false,
          title: this.title,
          description: this.description,
          price: this.price,
          purse: this.purse,
          emailPlaceholder: this.emailPlaceholder,
          usernamePlaceholder: this.usernamePlaceholder,
          mobilePlaceholder: this.mobilePlaceholder,
          descriptionPlaceholder: this.descriptionPlaceholder,
          webservice_id: this.webservice_id,
          required_fields: {
            email: this.handleOrderOptionsSave('email'),
            name: this.handleOrderOptionsSave('name'),
            mobile: this.handleOrderOptionsSave('mobile'),
            description: this.handleOrderOptionsSave('description')
          },
          show_receipt: this.showReceipt,
          successful_redirect_url: this.successfulRedirectUrl,
          failed_redirect_url: this.failedRedirectUrl,
          limited: this.limited,
          limit: this.limit,
        };
        this.$store.state.http.requests['easypay.getShow'].update(
            {easypay_id: this.easypayEntityId}, easyPayData).then(
            () => {
              this.changeEasypayStateAfterEdit();
              this.editLoading = false;
              this.$router.push({name: 'easypay.index'});
            },
            (response) => {
              this.editLoading = false;
              store.commit('setValidationErrors',
                  response.data.validation_errors);
              store.commit('flashMessage', {
                text: response.data.meta.error_type,
                important: false,
                type: 'danger'
              });
            }
        );
      },
      addEasypayToState(easypayData) {
        let purseName = null;
        if (this.purse_name) {
          purseName = this.purse_name.name;
        }
        let easyPayData = {
          created_at: easypayData.created_at,
          description: this.description,
          entity_id: easypayData.entity_id,
          failed_redirect_url: null,
          limit: 0,
          price: this.price,
          public_id: easypayData.public_id,
          purse: this.purse,
          purse_name: purseName,
          required_fields: {
            email: 'hidden',
            name: 'hidden',
            mobile: 'hidden'
          },
          show_receipt: false,
          status: false,
          successful_redirect_url: null,
          title: this.title,
          emailPlaceholder: this.emailPlaceholder,
          usernamePlaceholder: this.usernamePlaceholder,
          mobilePlaceholder: this.mobilePlaceholder,
          descriptionPlaceholder: this.descriptionPlaceholder,
          updated_at: easypayData.updated_at,
          webservice_id: this.webservice_id,
        };
        this.$store.state.auth.user.easypays.unshift(easyPayData);
      },
      changeEasypayStateAfterEdit(){
        let vm = this;
        let easypayIndex = _.findIndex(this.$store.state.auth.user.easypays,
            function(easypay) {
              return easypay.entity_id === vm.easypayEntityId;
            });
        this.$store.state.auth.user.easypays[easypayIndex].required_fields.email = this.requiredFields.email;
        this.$store.state.auth.user.easypays[easypayIndex].required_fields.name = this.requiredFields.name;
        this.$store.state.auth.user.easypays[easypayIndex].required_fields.mobile = this.requiredFields.mobile;
        this.$store.state.auth.user.easypays[easypayIndex].required_fields.description = this.requiredFields.description;
        this.$store.state.auth.user.easypays[easypayIndex].show_receipt = this.showReceipt;
        this.$store.state.auth.user.easypays[easypayIndex].successful_redirect_url = this.successfulRedirectUrl;
        this.$store.state.auth.user.easypays[easypayIndex].failed_redirect_url = this.failedRedirectUrl;
        this.$store.state.auth.user.easypays[easypayIndex].failed_redirect_url = this.failedRedirectUrl;
        this.$store.state.auth.user.easypays[easypayIndex].limited = this.limited;
        this.$store.state.auth.user.easypays[easypayIndex].limit = this.limit;
      },
      handleOrderOptionsSave(requireFieldName) {
        if (this.requiredFields[requireFieldName].checkbox) {
          this.requiredFields['email'].placeholder = this.emailPlaceholder;
          this.requiredFields['mobile'].placeholder = this.mobilePlaceholder;
          this.requiredFields['name'].placeholder = this.usernamePlaceholder;
          this.requiredFields['description'].placeholder = this.descriptionPlaceholder;
          return {
            status: this.requiredFields[requireFieldName].status,
            placeholder: this.requiredFields[requireFieldName].placeholder,
          }
        }
        return {
          status: 'hidden',
          placeholder: null,
        };
      },
      handleShowReceipt() {
        if (this.showReceipt === false) {
          this.showReceipt = 0;
        } else {
          this.showReceipt = 1;
        }
      },
      getPurseName(purseId) {
        return _.find(this.$store.state.auth.user.purses, function(purse) {
          return purse.purse === purseId;
        });
      }
    },
    components: {
      selectbox,
      purse,
      VueNumeric
    }
  }
</script>