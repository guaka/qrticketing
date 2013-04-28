
@Tickets = new Meteor.Collection("tickets")

Template.list.tickets = Tickets.find()