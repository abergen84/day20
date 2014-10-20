_.templateSettings.interpolate = /{([\s\S]+?)}/g;


//setting up the constructor
function EtsyClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
    }
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = options.api_version || "v2/";
    this.api_key = options.api_key;
    this.complete_api_url = this.etsy_url + this.version;
}

EtsyClient.prototype.PullAllActiveListings = function(){
	var model = 'listings'
	var filter = 'active';

	return $.getJSON(this.complete_api_url + model + filter + ".js?api_key=" + this.api_key + "&callback=?").then(function(data){
		console.log(data);
	});
}

EtsyClient.prototype.loadTemplateFile = function(templateName){
	return $.get('./templates' + templateName + '.html').then(function(htmlstring){
		return htmlstring;
	});
}

EtsyClient.prototype.putListingsOnPage = function(listingsHtml, listings){
	document.querySelector('.large-4 small-6 columns').innerHTML = _.template(listingsHtml, listings);
}

EtsyClient.prototype.init = function(){
	var self = this;

	$.when(
		this.PullAllActiveListings(),
		this.loadTemplateFile('listings')
		).then(
		function(listings, listingsHtml){
			self.putListingsOnPage(listingsHtml, listings)
		})
}

window.onload = app;

function app(){
	var Etsy = new EtsyClient("4jls0ietsf4fdx1hkkdghcie");
}