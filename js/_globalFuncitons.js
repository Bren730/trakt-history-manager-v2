'use strict'

$( document ).ready(function() {

	window.THMApp.initialise()

})

function getUrlParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function customEvent(eventType, detailObject) {

	if (eventType === undefined) {
		console.error('Custom event type undefined')
	}
	var event = new CustomEvent(
		eventType,
		{
			detailObject,
			bubbles: true,
			cancelable: true
		}
	)

	console.log('dispatching custom', eventType, 'event')
	document.dispatchEvent(event)
}
