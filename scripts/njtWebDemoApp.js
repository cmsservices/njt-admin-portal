'use restrict';
var app = angular.module('njTransitApp', 
    ['ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ngDialog', 'ngAnimate', 'ngSanitize', 'ui.grid.autoResize']);
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
     $stateProvider
        .state('login', {
            views: {
                'header': {
                  templateUrl: 'views/components/common/header.html'
                },
/*                'header-band' : {
                    templateUrl: 'views/components/common/headerBand.html'
                },*/
                'nav' : {
                    templateUrl : 'views/components/common/login.html'
                },
                '' : {
                    templateUrl : 'views/components/common/home.html'
                },
                'footer' : {
                   // templateUrl : 'views/components/common/footer.html'
                }
            },
            url : '/login'      
        })
        
        .state('login.forgetUsername', {
            views: {
                'nav@': {
                    templateUrl: 'views/components/common/login.html'              
                },
                '@': {
                    templateUrl : 'views/components/common/forgetUserName.html' 
                }
            },
            url : '/forgetUsername'
        })

        .state('login.forgetPassword', {
            views: {
                'nav@': {
                    templateUrl: 'views/components/common/login.html'              
                },
                '@': {
                    templateUrl : 'views/components/common/forgetPassword.html' 
                }
            },
            url : '/forgetPassword'
        })
        .state('login.securityQuestions', {
            views: {
                'nav@': {
                    templateUrl: 'views/components/common/login.html'              
                },
                '@': {
                    templateUrl : 'views/components/common/securityQuestions.html' 
                }
            },
            url : '/forgetPassword'
        })
        .state('login.resetPassword', {
            views: {
                'nav@': {
                    templateUrl: 'views/components/common/login.html'              
                },
                '@': {
                    templateUrl : 'views/components/common/resetPassword.html' 
                }
            },
            url : '/forgetPassword'
        })
        .state('welcome', {
            views: {
                'header': {
                  templateUrl: 'views/components/common/header.html'
                },
               'message-container': {
                  templateUrl: 'views/components/common/messageContainer.html'
                },
/*                'header-band' : {
                    templateUrl: 'views/components/common/headerBand.html'
                },*/
                'nav@': {
                    templateUrl: 'views/components/common/siteMenuBar.html'              
                },
                '@': {
                    templateUrl : 'views/components/common/welcome.html' 
                },
                'footer' : {
                    //templateUrl : 'views/components/common/footer.html'
                }
            },
            url : '/welcome'
        })

        .state('welcome.paymentProfile', {
            url : '/PaymentProfile',
            'views' : {
                'header-band@' : {
                    
                },
                '@': {
                    templateUrl : 'views/components/user/MyAccount/paymentProfile.html'
                }
            }
        })
        .state('welcome.transactionHistory', {
            url : '/transactionHistory',
            'views' : {
                'header-band@' : {
                    
                },
                '@': {
                    templateUrl : 'views/components/user/transactions.html'
                }
            }
        })

        .state('welcome.contactUs', {
            url: '/ContactUs',
                            
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/common/faqs.html'           
                 }
             }
        })
        .state('welcome.njtDashboard', {
            url: '/njtDashboard',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/njtDashboard/njtDashboard.html'           
                 }
             }
        })

        .state('welcome.importRequests', {
            url: '/importRequests',
                            
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/requests/importRequests.html'           
                 }
             }
        })

        .state('welcome.refundRequests', {
            url: '/refundRequests',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/requests/refundRequests.html'           
                 }
             }
        })

        .state('welcome.devices', {
            url: '/devices',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/user/devices.html'           
                 }
             }
        })
        .state('welcome.terminalHealth', {
            url: '/Terminal Health',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/dashboard/terminalHealth.html'           
                 }
             }
        })
        .state('welcome.transactions', {
            url: '/transactions',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/dashboard/lastTransactions.html'           
                 }
             }
        })
        .state('welcome.alarms', {
            url: '/alarms',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/dashboard/lastAlarms.html'           
                 }
             }
        })
        .state('welcome.machines', {
            url: '/machines',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/dashboard/topMachinesNeedAttention.html'           
                 }
             }
        })

        .state('welcome.tvms', {
            url: '/TVMs',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/dashboard/tvmsNotCheckedIn.html'           
                 }
             }
        })

        .state('welcome.serviceCalls', {
            url: '/serviceCalls',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/dashboard/serviceCallsSnapShot.html'           
                 }
             }
        })

        .state('welcome.supportCalender', {
            url: '/supportCalender',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/dashboard/supportCalender.html'           
                 }
             }
        })

        .state('welcome.reports', {
            url: '/reports',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/reports/reports.html'           
                 }
             }
        })  
        .state('welcome.userDetails', {
            'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl : 'views/components/user/userDetails.html' 
                }
            },
            url : '/userDetails'
        })  
        .state('welcome.myTickets', {
            url : '/myTickets',
            'views' : {
                'header-band@' : {
                    
                },
                '@': {
                    templateUrl : 'views/components/user/myTickets.html'
                }
            }
        })   
        .state('welcome.search', {
            url : '/search',
            'views' : {
                'header-band@' : {
                    
                },
                '@': {
                    templateUrl : 'views/components/user/search.html'
                }
            }
        })  
        .state('welcome.meadowLandsTicketing', {
            url: '/purchaseTickets',
            'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/user/ticketing.html'          
                 }
             }
        })
        .state('welcome.shoppingCart', {
            'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl : 'views/components/user/shopping_cart.html' 
                }
            },
            url : '/ShoppingCart'
        })
        .state('welcome.shipping', {
            url: '/shipping',
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/user/selectShipping.html'           
                 }
             }
        })
        .state('welcome.payment', {
            url: '/Billing',
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/user/selectPayment.html'           
                 }
             }
        })
        .state('welcome.reviewOrder', {
            url: '/ReviewOrder',
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/user/review_order.html'           
                 }
             }
        })
        .state('welcome.orderConfirmation', {
            url: '/OrderConfirmation',
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/user/confirmation.html'           
                 }
             }
        })

        .state('welcome.manageUser', {
            url: '/manageUser',
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/user/manageUser.html'           
                 }
             }
        }) 
        .state('welcome.creteAlert', {
            url: '/creteAlert',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/notifications/createNotification.html'           
                 }
             }
        })
        .state('welcome.scheduleAlert', {
            url: '/scheduleAlert',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/alerts/scheduleAlerts.html'           
                 }
             }
        })
        .state('welcome.alertHistory', {
            url: '/alertHistory',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/alerts/alertHistory.html'           
                 }
             }
        })
        .state('welcome.colorConfig', {
            url: '/colorConfig',                            
             'views' : {
                'header-band@' : {                    
                },
                '@': {
                     templateUrl: 'views/components/common/colorConfig.html'           
                 }
             }
        })

        .state('welcome.autoReload', {
            url: '/autoReload',
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/user/autoReload.html'           
                 }
             }
        })   
        .state('welcome.terminals', {
            url: '/terminals',
             'views' : {
                'header-band@' : {
                    
                },
                '@': {
                     templateUrl: 'views/components/dashboard/terminals.html'           
                 }
             }
        })   
}])