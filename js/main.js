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


  sortByName: function(e) {
    
    function compare(a,b) {
      if (a.name < b.name)
        return -1;
      if (a.name >= b.name)
        return 1;
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

    this.dataList.sort(compare);
    console.log("dataList", this.dataList );
    this.reRenderCards(this.dataList);
  },


  bindUIActionsForCard: function(){
     $(".card-close").on("click", function(e){
          console.log("hepp");
          cards.removeGithubUser(e);
      });
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