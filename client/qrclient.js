Meteor.subscribe("tickets");

Session.setDefault("currentTicket","");

Template.page.showDetails = function () {
  return Session.get("currentTicket") != "";
};

Template.page.showList = function () {
  return (Session.get("firstname") != "") || (Session.get("lastname") != "")|| (Session.get("employer") != "");
};

Template.listing.searchResults = function () {
  return Tickets.find({$or: [{"firstname": Session.get("firstname")}, {"lastname": Session.get("lastname")}, {"employer":Session.get("employer")}]},{limit: 5});
};

Template.prompt.currentSearch = function () {
  return Session.get("currentTicket");
};

Template.details.ticket = function () {
  return Tickets.findOne({_id: Session.get("currentTicket")});
};

Template.prompt.events({
  'click .search': function (event, template) {
    var id = extractId(template.find(".id").value);
    if (id) {
    	Session.set("currentTicket", id);
    	Session.set("firstname","");
    	Session.set("lastname","");
    	Session.set("employer","");
    } else {
    	Session.set("currentTicket", "");
    	Session.set("firstname",template.find(".firstname").value);
    	Session.set("lastname",template.find(".lastname").value);
    	Session.set("employer",template.find(".employer").value);
    }
    },
     'click .scan': function (event, template) {
 	   alert("Scanning");
  	}
});

Template.details.events({
  'click .checkIn': function (event, template) {
  	  Meteor.call('checkIn', Session.get("currentTicket"));
  },
  'click .scan': function (event, template) {
    var result = "";
    // this is where the bridge is made to the Barcode scanner
    if (window && window.plugins && window.plugins.barcodeScanner) {
      window.plugins.barcodeScanner.scan( function(result) {
        alert("We got a barcode\n" +
                  "Result: " + result.text + "\n" +
                  "Format: " + result.format + "\n" +
                  "Cancelled: " + result.cancelled);
   		 }, function(error) {
       		 alert("Scanning failed: " + error);
    	 });
    } else {
       // fall back to a silly prompt:
  	   result = prompt("ID to search","");
  	}
  	Session.set("currentTicket", extractId(result));
  },
  'click .reset': function (event, template) {
    Session.set("currentTicket", "");
    Session.set("firstname","");
    Session.set("lastname","");
    Session.set("employer","");
  }
});

Template.listing.events({
   'click .scan': function (event, template) {
    var result = "";
    // this is where the bridge is made to the Barcode scanner
    if (window && window.plugins && window.plugins.barcodeScanner) {
      window.plugins.barcodeScanner.scan( function(result) {
        alert("We got a barcode\n" +
                  "Result: " + result.text + "\n" +
                  "Format: " + result.format + "\n" +
                  "Cancelled: " + result.cancelled);
   		 }, function(error) {
       		 alert("Scanning failed: " + error);
    	 });
    } else {
       // fall back to a silly prompt:
  	   result = prompt("ID to search","");
  	}
  	Session.set("currentTicket", extractId(result));
  },
  'click .reset': function (event, template) {
    Session.set("currentTicket", "");
    Session.set("firstname","");
    Session.set("lastname","");
    Session.set("employer","");
  }
});

Template.listing.events({
	'click .ticket': function (event, template) {
		Session.set("currentTicket", this._id);
	}
});


// gets the ID from the supplied input String
// input can be a straight ID, or a list of one or more fields in the style of "fields1:value1;field2:value2;...", 
// in which case the first field is assumed the ID
var extractId = function (input) {
	if (input == "")
	 return "";
	var fields = input.split(";");
	var field1 = fields[0].split(":");
	if (field1.length == 1) {
		// no field label
		return field1[0];
	} else {
		return field1[1];
	}
};
