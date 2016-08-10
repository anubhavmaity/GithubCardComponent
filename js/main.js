var cards = {


  configUrl: {

    apiUrl: "https://api.github.com/users/"

  },


  el:{

    main: $("main"),
    mainLayout: $("#main-layout"),
    cardLayout: $(".card-layout"),
    cardLayoutRender: $(".card-layout-reRender")

  },
  

  init: function() {
    
    this.render();
    this.bindUIActions();
    this.dataList = []
  },


  bindUIActions: function() {

    console.log("helo");
    console.log(this.el.addUser);
    $("#add-github-user-btn").on("click", function(e){
      cards.addGithubUser(e);
    });
    $(".sort-by-name").on("click", function(e){
      cards.sortByName(e);
    });
    $(".sort-by-location").on("click", function(e) {
      cards.sortByLocation(e);
    });
    $(".sort-by-followers").on("click", function(e) {
      cards.sortByFollowers(e);
    });
  
  },


  addClassHideToArrowDown: function(){

    var arrowDownList = $( ".arrow-down" );
    for ( var i = 0; i< arrowDownList.length; i++ ) {
      if ( !$(arrowDownList[i] ).hasClass( "hide" ) ) {
        $( arrowDownList[i] ).addClass( "hide" );
      }
    }

  },


  sortByName: function(e) {
    
    function compare(a,b) {
      if (a.name < b.name)
        return -1;
      if (a.name >= b.name)
        return 1;
    }
    $(".sort-by span").removeClass("sort-by-clicked");
    $(".sort-by-name").addClass("sort-by-clicked");
    this.addClassHideToArrowDown()
    if ( $(".sort-by-name .arrow-down").hasClass("hide") ) {
      $(".sort-by-name .arrow-down").removeClass("hide");
    }
    this.dataList.sort(compare);
    console.log("dataList", this.dataList );
    this.reRenderCards(this.dataList);
  },


  sortByLocation: function(e) {
    
    function compare(a,b) {
      if (a.location < b.location)
        return -1;
      if (a.location >= b.location)
        return 1;
    }
    $(".sort-by span").removeClass("sort-by-clicked");
    $(".sort-by-location").addClass("sort-by-clicked");
    this.addClassHideToArrowDown()
    if ( $(".sort-by-location .arrow-down").hasClass("hide") ) {
      $(".sort-by-location .arrow-down").removeClass("hide");
    }
    this.dataList.sort(compare);
    console.log("dataList", this.dataList );
    this.reRenderCards(this.dataList);

  },


  sortByFollowers: function(e) {
    
    function compare(a,b) {
      if (a.followers < b.followers)
        return -1;
      if (a.followers >= b.followers)
        return 1;
    }
    $(".sort-by span").removeClass("sort-by-clicked");
    $(".sort-by-followers").addClass("sort-by-clicked");
    this.addClassHideToArrowDown()
    if ( $(".sort-by-followers .arrow-down").hasClass("hide") ) {
      $(".sort-by-followers .arrow-down").removeClass("hide");
    }
    this.dataList.sort(compare);
    console.log("dataList", this.dataList );
    this.reRenderCards(this.dataList);

  },


  bindUIActionsForCard: function(){
     $(".card-close").on("click", function(e){
          console.log("hepp");
          cards.removeGithubUser(e);
      });
     $(".card").on("click", function(e){
        cards.viewUserProfile(e);
     })
  }, 

  removeObjectFromArr: function( objects, val ){
      this.dataList = objects.filter( function( obj ){
        return obj.username != val;
      });
  },

  checkPresenceOfObjectInArr: function( objects, val ) {

    var exists = objects.some(function(el) { return el.username === val });
    return exists;
  
  },

  
  viewUserProfile: function(e) {

    var currentTarget = $(e.currentTarget);
    var profileUrl = $(currentTarget).attr("data-url");
    location.href =  profileUrl;
  },


  removeGithubUser: function(e) {

    var currentTarget = $(e.currentTarget);
    console.log("currentTarget", currentTarget);
    var cardContainer = $(currentTarget).closest(".card-container");
    var username = cardContainer.attr("data-username");
    cardContainer.remove();
    this.removeObjectFromArr( this.dataList, username );

  },


  addGithubUser: function(e){

    var self = this;
    var username = $("#github-username").val();
    console.log("username", username);
    
    $.ajax({
     
      url: this.configUrl.apiUrl + username
    
    }).done( function( response ){
     
      var context = {
        username: username,
        html_url: response["html_url"],
        imageUrl: response["avatar_url"],
        name: response["name"],
        location: response["location"],
        followers: response["followers"]
      }
      console.log( self.checkPresenceOfObjectInArr(self.dataList, username) );
      if( !self.checkPresenceOfObjectInArr(self.dataList, username) ) {

        var theTemplateScript = self.el.cardLayout.html();
        var theTemplate = Handlebars.compile(theTemplateScript);
        var theCompiledHtml = theTemplate(context);
        self.el.main.find(".card-body").append(theCompiledHtml);
        self.dataList.push(context);  
        self.bindUIActionsForCard();
       
      
      } else {
        alert("The username is already added");
      }
      
    
    });

  },
  
  reRenderCards: function(dataList) {

    var theTemplateScript = this.el.cardLayoutRender.html();
    var theTemplate = Handlebars.compile( theTemplateScript );
    var theCompiledHtml = theTemplate({dataList: dataList});
    this.el.main.find(".card-body").html(theCompiledHtml);

  },

  render: function(){

    var theTemplateScript = this.el.mainLayout.html();
    var theTemplate = Handlebars.compile( theTemplateScript );
    var theCompiledHtml = theTemplate();

    this.el.main.html( theCompiledHtml );
  
  }


};




$(document).ready(function() {
  cards.init();
});