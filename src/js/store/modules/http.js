export default {
    namespaced: true,

    state: {
        services: {
            'pg': 'https://www.zarinpal.com/pg/StartPay/'
        },
        requests: {},
        routes: [
            {
                name: "getVerifyWebsite",
                url: "verifyWebsite/{domain}.json"
            },
            {
                name: "postGuestAdd",
                url: "ticket/guest.json"
            },
            {
                name: "getReply",
                url: "ticket/guest/{email}/{publicId}.json"
            },
            {
                name: "oauth.postInitializeLogin",
                url: "oauth/initializeLogin.json"
            },
            {
                name: "oauth.postIssueAccessToken",
                url: "oauth/issueAccessToken.json"
            },
            {
                name: "oauth.PostRegisterUser",
                url: "oauth/registerUser.json"
            },
            {
                name: "oauth.postAccessTokenPos",
                url: "oauth/accessTokenPos.json"
            },
            {
                name: "oauth.postRegister",
                url: "oauth/register.json"
            },
            {
                name: "oauth.postAccessToken",
                url: "oauth/accessToken.json"
            },
            {
                name: "oauth.postPersonalAccess",
                url: "oauth/personalAccess.json"
            },
            {
                name: "oauth.getUserTokens",
                url: "oauth/userTokens.json"
            },
            {
                name: "oauth.postRevokeAccessToken",
                url: "oauth/revokeAccessToken.json"
            },
            {
                name: "oauth.postCheckUsername",
                url: "oauth/checkUsername.json"
            },
            {
                name: "oauth.postMobileVerification",
                url: "oauth/mobileVerification.json"
            },
            {
                name: "oauth.postOtpToken",
                url: "oauth/otpToken.json"
            },
            {
                name: "oauth.getLogout",
                url: "oauth/logout.json"
            },
            {
                name: "oauth.check",
                url: "oauth/check.json"
            },
            {
                name: "oauth.postSendMobileVerifyCode",
                url: "oauth/sendMobileVerifyCode.json"
            },
            {
                name: "app.postPreInit",
                url: "app/preInit.json"
            },
            {
                name: "app.getBasicInfo",
                url: "app/basicInfo.json"
            },
            {
                name: "app.getTranslation",
                url: "app/translation.json"
            },
            {
                name: "app.postCheckContact",
                url: "app/checkContact.json"
            },
            {
                name: "app.fees",
                url: "app/fees.json"
            },
            {
                name: "card.getList",
                url: "card.json"
            },
            {
                name: "card.getShow",
                url: "card/{cardId}.json"
            },
            {
                name: "faq",
                url: "faq.json"
            },
            {
                name: "purse.getList",
                url: "purse.json"
            },
            {
                name: "purse.getBalance",
                url: "purse/balance/{purseId}.json"
            },
            {
                name: "purse.getInfoByEmail",
                url: "purse/{email}.json"
            },
            {
                name: "purse.getInfoByMobile",
                url: "purse/{mobile}.json"
            },
            {
                name: "purse.getInfoByZp",
                url: "purse/{purseId}.json"
            },
            {
                name: "purse.postEdit",
                url: "purse/{purse_number}.json"
            },
            {
                name: "coupon.getIndex",
                url: "coupon.json"
            },
            {
                name: "coupon.getShow",
                url: "coupon/{coupon_id}.json"
            },
            {
                name: "report.purseTransactions",
                url: "report/purseTransactions.json"
            },
            {
                name: "report.webserviceTransactions",
                url: "report/webserviceTransactions.json"
            },
            {
                name: "ticket.index",
                url: "ticket.json"
            },
            {
                name: "ticket.postAdd",
                url: "ticket.json"
            },
            {
                name: "ticket.Reply",
                url: "ticket/{ticket_id}.json"
            },
            {
                name: "ticket.postClose",
                url: "ticket/close/{ticketId}.json"
            },
            {
                name: "ticket.getTicketDepartment",
                url: "ticket/department.json"
            },
            {
                name: "ticket.getSummary",
                url: "ticket/summary.json"
            },
            {
                name: "webservice.getIndex",
                url: "webservice.json"
            },
            {
                name: "webservice.getWebserviceCategory",
                url: "webservice/category.json"
            },
            {
                name: "webservice.postRequestZaringate",
                url: "webservice/requestZaringate.json"
            },
            {
                name: "webservice.postRequestInternationalGate",
                url: "webservice/requestInternationalGate.json"
            },
            {
                name: "webservice.postRequestUssd",
                url: "webservice/requestUssd.json"
            },
            {
                name: "webservice.getCheckUssd",
                url: "webservice/checkUssd/{ussdId}.json"
            },
            {
                name: "webservice.getPriceZaringate",
                url: "webservice/priceZaringate.json"
            },
            {
                name: "webservice.getPriceUssd",
                url: "webservice/priceUssd.json"
            },
            {
                name: "webservice.getShow",
                url: "webservice/{webservicId}.json"
            },
            {
                name: "webservice.postEdit",
                url: "webservice/{webservice_id}.json"
            },
            {
                name: "zarincard.getHolderName",
                url: "zarincard/holderName/{destPan}.json"
            },
            {
                name: "zarincard.postStatement",
                url: "zarincard/statement.json"
            },
            {
                name: "zarincard.postTransferShetab",
                url: "zarincard/transferShetab.json"
            },
            {
                name: "zarincard.postRequestIssue",
                url: "zarincard/requestIssue.json"
            },
            {
                name: "zarincard.cost",
                url: "zarincard/cost.json"
            },
            {
                name: "transaction.getRecents",
                url: "transaction.json"
            },
            {
                name: "transaction.getInfo",
                url: "transaction/{transactionId}.json"
            },
            {
                name: "transaction.getInfoPdf",
                url: "transaction/{transactionId}.pdf"
            },
            {
                name: "transaction.getSessions",
                url: "transaction/sessions/{webserviceId}.json"
            },
            {
                name: "transaction.postWithdraw",
                url: "transaction/withdraw.json"
            },
            {
                name: "transaction.postPurseToPurseTransfer",
                url: "transaction/p2pTransfer.json"
            },
            {
                name: "transaction.excelExport",
                url: "transaction/excel.json"
            },
            {
                name: "requestMoney.postRequestMoney",
                url: "requestMoney.json"
            },
            {
                name: "requestMoney.payRequestMoney",
                url: "requestMoney/payment/{entityId}.json"
            },
            {
                name: "requestMoney.getDemand",
                url: "requestMoney/demand.json"
            },
            {
                name: "requestMoney.getDebt",
                url: "requestMoney/debt.json"
            },
            {
                name: "requestMoney.phonebook",
                url: "user/phonebook.json"
            },
            {
                name: "easypay.getList",
                url: "easypay.json"
            },
            {
                name: "easypay.getShow",
                url: "easypay/{easypay_id}.json"
            },
            {
                name: "user.getProgress",
                url: "user/progress.json"
            },
            {
                name: "user.postUploadDocument",
                url: "user/upload.json"
            },
            {
                name: "user.postSetEmail",
                url: "user/setEmail.json"
            },
            {
                name: "user.getVerify",
                url: "user/verify/{token}/{email}.json"
            },
            {
                name: "user.postVerifyNotificationSystem",
                url: "user/verifyNotification.json"
            },
            {
                name: "user.putNotificationPreferences",
                url: "user/notificationPreferences.json"
            },
            {
                name: "user.postUsername",
                url: "user/username.json"
            },
            {
                name: "user.postAddress",
                url: "user/address.json"
            },
            {
                name: "user.getAddress",
                url: "user/address/{id}.json"
            },
            {
                name: "user.postInformation",
                url: "user/information.json"
            },
            {
                name: "user.referrer",
                url: "referrer/referredUsers.json"
            },
            {
                name: "user.referred",
                url: "referrer/users.json"
            },
            {
                name: "checkout.getAuthorityInfo",
                url: "checkout/authorityInfo/{authorityId}.json"
            },
            {
                name: "checkout.postPayAuthority",
                url: "checkout/payAuthority.json"
            },
            {
                name: "checkout.postAddFund",
                url: "checkout/addFund.json"
            },
            {
                name: "telegram.webHook",
                url: "telegram/webHook.json"
            },
            {
                name: "telegram.registerTelegramPay",
                url: "telegram/registerTelegramPay.json"
            },
            {
                name: "newsletter.postSubscribe",
                url: "newsletter/subscribe.json"
            }
        ],
    },
    mutations: {
        boot (state, vm) {
            Vue.http.interceptors.push((request, next) => {
                next((response) => {
                    if (response.status === 200) {
                        return;
                    }

                    let error = response.data.meta;

                    let checkRoute = _.find(state.routes, function(route) {
                        return route.name === 'oauth.check';
                    });

                    if (error.error_type === "OauthAccessDenied"
                        && request.url !== checkRoute.url) {

                        vm.$store.commit('app/ready');
                        vm.$router.push({name: 'auth.login'});
                    }

                    // console.log(state.requests);
                    // if (error.error_type === "InternalError") {
                    //     store.commit('flashMessage', {
                    //         text: response.data.meta.error_message,
                    //     });
                    //
                    // }

                    //Redirect to connection error page
                    if (response.status === 500) {
                        vm.$router.push({name: 'error.connection'});
                    }
                });
            });

            _.each(state.routes, function (item) {
                state.requests[item.name] = vm.$resource(item.url);
            });
        },
    },
};
