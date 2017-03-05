var Discordie = require('discordie');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var _ = require('lodash');


const Events = Discordie.Events;
const client = new Discordie();

var doc = new GoogleSpreadsheet('1I8dd8t7gZgA3s-E2vMhgz2jzEPk9dQ_rhkW3i0Xpb40');
var sheet;
var conversation = false;

let tier = {
s: [],
a1: [],
a2: [],
a3: [],
b1: [],
b2: [],
b3: [],
c1: [],
c2: [],
c3: [],
d: [],
f: []
};

async.series([
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();
    });
  },
  function workingWithRows(step) {
    // google provides some query options
    sheet.getRows({
      offset: 1,
      limit: 130,
      orderby: 'col2'
    }, function( err, rows ){
      _.map(rows, (value, key) => {
        // console.log(key);
        _.map(value, (name, header) => {
          // console.log(header);
          if (name) {
            switch (header) {
              case 's':
                tier['s'] = [...tier['s'], name];
                break;
              case 'a1':
                tier['a1'] = [...tier['a1'], name];
                break;
              case 'a2':
                tier['a2'] = [...tier['a2'], name];
                break;
              case 'a3':
                tier['a3'] = [...tier['a3'], name];
                break;
              case 'b1':
                tier['b1'] = [...tier['b1'], name];
                break;
              case 'b2':
                tier['b2'] = [...tier['b2'], name];
                break;
              case 'b3':
                tier['b3'] = [...tier['b3'], name];
                break;
              case 'c1':
                tier['c1'] = [...tier['c1'], name];
                break;
              case 'c2':
                tier['c2'] = [...tier['c2'], name];
                break;
              case 'c3':
                tier['c3'] = [...tier['c3'], name];
                break;
              case 'd':
                tier['d'] = [...tier['d'], name];
                break;
              case 'f':
                tier['f'] = [...tier['f'], name];
                break;
              default:
              //Empty
            }
          }
        });

      })
      step();
    });
  }
]);

client.connect({
  // token: 'Mjg3NzczODQ0OTMwODIyMTQ0.C50J1g.Ghuj21Hqv36Wk3HcWXQ2I9U5aUo'   //Este token es para el server de test
  token: 'Mjg3OTc0MzMzNTU5ODY1MzQ1.C53Ehg.GWkRXKlmZguYZ6MbA6Ga0WS3ncg'    //Este token es para eternal-esp
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log('Conectado como: ' + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  const content = e.message.content;
  let msg;
  if((e.message.content.substring(0, 6) == '!draft')) {
    if (!content.substring(7).trim()) {
        e.message.channel.sendMessage('Buenas, soy el bot :robot: Tier-Draft para Eternal, puedes preguntar la clasificación de cualquier carta escribiendo \"!draft torch\" por ejemplo.' +
        '\n\nLas clasificación de tier para las cartas van de forma descendente desde S :scream:, hasta A+, A, A-, B+, B, B-, C+, C, C-, D, hasta F (Evita a toda costa elegir estas cartas :joy:)'
      );
    } else {
    const name = content.substring(7).trim();

    var p1 = new Promise(
        function(resolve, reject) {
          _.map(tier, (array, classification) => {
            _.map(array, (card) => {
              if (card.toLowerCase().indexOf(name.trim().toLowerCase()) !== -1) {
                msg = "La clasificacion de la carta \'" + card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
                switch (classification) {
                  case 's':
                    msg = msg + '\nMas te vale que eligas esa carta :ok_hand:'
                    break;
                  case 'a1':

                    break;
                  case 'a2':

                    break;
                  case 'a3':

                    break;
                  case 'b1':

                    break;
                  case 'b2':

                    break;
                  case 'b3':

                    break;
                  case 'c1':

                    break;
                  case 'c2':

                    break;
                  case 'c3':

                    break;
                  case 'd':

                    break;
                  case 'f':

                    break;
                  default:

                }
                resolve(msg);
              }
            });
          });
          reject('No se encontró ninguna carta que coincida con \'' + name + '\'')
        }
        );
        p1.then(
        (val) => {
          e.message.channel.sendMessage(val);
        }
      )
    .catch(
        function(reason) {
            e.message.channel.sendMessage(reason);
        });
  }
  }
});

// function cardSearch(name) {
//   _.map(tier, (array, classification) => {
//     // console.log(classification);
//     _.map(array, (card) => {
//       if (card.toLowerCase().indexOf(name.trim().toLowerCase()) !== -1) {
//         console.log(classification);
//         return classification;
//       }
//     });
//   });
// }
