'use strict'

angular.module('myWeb.lib.service.asyncService',[
  ]);

angular.module('myWeb.lib.service.asyncService').provider('asyncService',{
  $get:['storageService' , 'spaService','hobbySetting',function(storageService ,spaService,hobbySetting){

    var unique = function(arr){
      var res = [];
      var json = {};
      for(var i = 0; i < arr.length; i++){
        if(!json[arr[i]]){
          res.push(arr[i]);
          json[arr[i]] = 1;
        }
      }
      return res;
    }

    function getData_home(params){
      console.log('asyncService:change state to book list',params)
      if(!storageService.checkData('books')){
        spaService.getBooks();
      }
    }
    function getData_detail(params){
      console.log('ddddddddddddddddddddasyncService:change state to book detail',params)

      spaService.getBooks({id:params.bookId}).then(function(){
        spaService.getComments(params.bookId);
      });

    }
    function getData_order(params){
      spaService.getOrderForm({
        criteria: {
          order_account: params.orderFormId
        }
      });
      spaService.getConsignees();
    }
    function getData_admin(params){
      spaService.getOrderForm({type:'admin'});
      spaService.getBooks();
      spaService.getUsers();
    }

    function _asyncPage(state,params,fromState){
      if(!fromState.name){
        //shuaxin
      }
      if(state !=='order' &&state !=='admin_index' && !storageService.checkData('current_carts')){
        spaService.getCarts();
      }
      if(state !=='order' &&state !=='admin_index'&& !storageService.checkData('current_consignees')){
        console.log('ssssssssss')
        setTimeout(function(){
          spaService.getConsignees();
        },0)
      }
      if((state !=='order' &&state !=='admin_index' && !storageService.checkData('orderForm'))|| fromState =='order'){
        spaService.getOrderForm({type:'All'}).then(function(){
          if(!storageService.checkData('buyed_books')){
            var order = storageService.getData('orderForm');
            var buyed_books =[];
            angular.forEach(order,function(o){
              if(o.status==2){
                angular.forEach(o.books,function(b){
                  buyed_books.push(b.id);
                })
              }
            });
            storageService.saveData('buyed_books',unique(buyed_books));
          }
        });
      }
      switch(state){
        case 'hobby_index.home':
          getData_home(params);
          break;
        case 'hobby_index.home.detail':
          getData_detail(params);
          break;
        case 'admin_index':
          getData_admin(params);
          break;
        case 'order':
          getData_order(params);
          break;
        default :
          return false;
      }
    }

    return {
      asyncPage: _asyncPage
    };
  }]
});