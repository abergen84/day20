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

EtsyClient.prototype.loadTemplateFile = function(templateName) {
    return $.get('./templates/' + templateName + '.html').then(function(htmlstring) {
        return htmlstring;
    });
}

EtsyClient.prototype.putListingsOnPage = function(listingsHtml, listings) {
    document.querySelector('#templateDestination').innerHTML = listings.results.map(function(listing){ //what does listings.results.map do?
    	return _.template(listingsHtml, listing);
    }).join('');
}

EtsyClient.prototype.putOneListingOnPage = function(id){
	var listing = this.latestData.results.filter(function(listing){ //no clue what this entire thing does really
        return listing.listing_id === parseInt(id);
    });

	document.querySelector('#templateDestination').innerHTML = _.template(this.singleListingHtml, listing[0]); //listing at 0??
}

EtsyClient.prototype.setupRouting = function(){
	var self = this;

	Path.map("#/").to(function(){
		self.putListingsOnPage(self.listingHtml, self.latestData)  //where is self.latestData coming from? 
	});

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
        this.pullAllActiveListings(),
        this.loadTemplateFile('listings'),
        this.loadTemplateFile('onelisting')
    ).then(function(listings, listingsHtml, onelistingHtml) {
    //    self.putListingsOnPage(listingsHtml, listings)
     	self.latestData = listings;
        self.listingHtml = listingsHtml;
        self.singleListingHtml = onelistingHtml;

        Path.listen();

    })
}


