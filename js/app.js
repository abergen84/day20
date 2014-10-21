_.templateSettings.interpolate = /{([\s\S]+?)}/g;

window.onload = app;

function app() {
    
var options = {api_key: "4jls0ietsf4fdx1hkkdghcie"}

var Etsy = new EtsyClient(options);

}



//setting up the constructor
function EtsyClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
    }
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = options.api_version || "v2/";
    this.api_key = options.api_key;
    this.complete_api_url = this.etsy_url + this.version;

    this.init();
}

EtsyClient.prototype.pullAllActiveListings = function() {
    var model = 'listings/'
    var filter = 'active';

    return $.getJSON(this.complete_api_url + model + filter + ".js?api_key=" + this.api_key + "&includes=Images&callback=?").then(function(data) {
        //console.log(data);
        return data;
    });
}

EtsyClient.prototype.pullOneActiveListing = function(id){
	var model = 'listings/';

	return $.getJSON(this.complete_api_url + model + id + "js?api_key" + this.api_key + "&inludes=Images&callback=?").then(function(data){
		return data;
	});
}

EtsyClient.prototype.loadTemplateFile = function(templateName) {
    return $.get('./templates/' + templateName + '.html').then(function(htmlstring) {
        return htmlstring;
    });
}

EtsyClient.prototype.putListingsOnPage = function(listingsHtml, data) {
    document.querySelector('#templateDestination').innerHTML = data.results.map(function(listing){ 
    	return _.template(listingsHtml, listing);
    }).join('');
}

EtsyClient.prototype.putOneListingOnPage = function(id){
	var listing = this.latestData.results.filter(function(listing){ //going to run this thing 25 times, and only one will be true. when it returns 
																	//true, return the entire object for it
        return listing.listing_id === parseInt(id);					//parseInt puts it into a number
    });

	document.querySelector('#templateDestination').innerHTML = _.template(this.singleListingHtml, listing[0]); //listing at 0??
}

EtsyClient.prototype.setupRouting = function(){
	var self = this;

	Path.map("#/").to(function(){
		self.putListingsOnPage(self.listingHtml, self.latestData)   //when Path #/ runs, the "to" means it'll run the putListingsOnPage function
	});																//why do you need to put self.putListingsOnPage, and self.listingHtml and self.latestData?
																	//reason is, putListingsOnPage belongs to EtsyClient ,so you need to access that here to draw it
																	//putting "this." wont work because youre inside this specific function "to", so you need to
																	//creat ethe specific variable self = this to access it. but you if you were to just put 
																	//putLIstingsOnPage without the "self", it wouldnt know what to access, you need to give it access
																	//to EtsyClient outside the scope.

	Path.map("#/message/:anymessage").to(function(){
        alert(this.params.anymessage);
    })

    Path.map("#/listing/:id").to(function() {
        self.putOneListingOnPage(this.params.id);
    });

    Path.root("#/");

}



EtsyClient.prototype.init = function() {
    var self = this;
    this.setupRouting();

    $.when(
        this.pullAllActiveListings(),				//getting the results
        this.loadTemplateFile('listings'),
        this.loadTemplateFile('onelisting')
    ).then(function(listings, listingsHtml, onelistingHtml) {
    //    self.putListingsOnPage(listingsHtml, listings)
     	self.latestData = listings;					//storing them on the instance
        self.listingHtml = listingsHtml;
        self.singleListingHtml = onelistingHtml;

        //console.log(self);

        Path.listen();

    })
}


