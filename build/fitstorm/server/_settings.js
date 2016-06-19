if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  spotify: {
    service : 'spotify', 
    clientId   : 'b7eed19f6dda406f9e060a5be383d6aa',
    secret  : 'bc5766a75f9447aa8b18659fa01ffa69'
  },
});

ServiceConfiguration.configurations.update(
  { "service": Meteor.settings.spotify.service },
  {
    $set: {
      "clientId" : Meteor.settings.spotify.clientId,
      "secret"   : Meteor.settings.spotify.secret
    }
  },
  { upsert: true }
)