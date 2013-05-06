this.Tickets = new Meteor.Collection("tickets");

// inserting tickets is not allowed on the client side!
Tickets.allow({
  insert: function (userId, party) {
    return !Meteor.isClient;
  }
});

Meteor.methods({
	checkIn: function (ticketId) {
    var ticket = Tickets.findOne({_id:ticketId});
    if (!ticket)
      throw new Meteor.Error(404, "Ticket not found");
    if (ticket.checkedIn)
      throw new Meteor.Error(400,
                             "This ticket was already checked in.");
    Tickets.update({_id:ticketId}, { $set: {checkedIn: true }});
    }
});

// On server startup, we delete all data and preload stuff
if (Meteor.isServer) {
  Meteor.startup(function () {
    Tickets.remove({$isolated: 1 });
    Tickets.insert({_id:"1",firstname:"Thomas",lastname:"Goorden",employer:"Ensemblage",location:"DB"});
    Tickets.insert({_id:"2",firstname:"Liesbeth",lastname:"Baeten",employer:"Fietsdag",location:"PSN"});
  });
}