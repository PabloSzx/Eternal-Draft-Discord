var Discordie = require('discordie');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var _ = require('lodash');


const Events = Discordie.Events;
const client = new Discordie();

var doc = new GoogleSpreadsheet('1I8dd8t7gZgA3s-E2vMhgz2jzEPk9dQ_rhkW3i0Xpb40');
var sheet;
var conversation = {};
var history = {
PabloSz: true,
EpithSlayer: true,
Licorcafe: true,
Krow: true,
Punisher232: true
};



var lastPerson = '';

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

let emotes = {
  kappa: '<:Kappa:288704373775663105>',
  kappagold: '<:kappagold:288743665889968138>',
  keepo: '<:keepo:288743731199475713>',
  kappahd: '<:kappahd:288743688547336212>',
  kappapride: '<:kappapride:288743705328877568>',
  pogchamp: '<:pogchamp:288744062679252992>',
  dududu: '<:dududu:288743426160328706>'
}

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
    sheet.getRows({
      offset: 1,
      limit: 130,
      orderby: 'col2'
    }, function( err, rows ){
      _.map(rows, (value, key) => {
        _.map(value, (name, header) => {
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
  token: process.env.eternalesptoken //Este token es para el server de Eternal-ESP
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log('Conectado como: ' + client.User.username);
});

client.Dispatcher.on(Events.TYPING_START, e => {
  const user = e.user.username;
  if (history[user] === undefined) {
    history[user] = false;
    // console.log('Registro de usuarios incrementado.');
    // console.log(history);
  }
  if (e.channel.isPrivate && (history[user] === false)) {
    console.log(user + ' ha conversado conmigo en privado por primera vez.');
    e.channel.sendMessage('Hola! :wave: Al conversar conmigo por mensaje privado ' +
    'no es necesario que me preguntes por las cartas antecediendo un \"!draft\", aqui ' +
    'puedes escribir directamente la carta y te dire la clasificacion personalmente. \n\n' +
    'Y las clasificaciones de tier para las cartas van de forma descendente desde S :scream:, ' +
    'hasta A+, A, A-, B+, B, B-, C+, C, C-, D, hasta F (Evita a toda costa elegir estas cartas :joy:)');
    history[user] = true;
  }
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  let user = e.message.author.username;
  if (user !== 'Eternal-Draft') {
    const content = e.message.content;
  if (e.message.isPrivate && (content === 'PING')) {
    console.log('PONG');
  } else if (user !== 'Eternal-Decks') {
  if (!conversation[user]) {
    conversation[user] = { bool: false };
  }
  let msg = '';
  if((e.message.content.substring(0, 6) == '!draft') || e.message.isPrivate)  {
    if (user !== lastPerson) {
      lastPerson = user;
      console.log('El usuario ' + user + ' ha interactuado conmigo.');
    }
    let name = '';
    if (e.message.content.substring(0, 6) == '!draft') {
      name = content.substring(7).trim();
    } else {
      name = content.trim();
    }
    let classification = '';
    if (conversation[user].bool) {
      let err = false;
      try {
        switch (name.trim()) {
          case '1':
            classification = conversation[user].possibilities[0].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[0].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '2':
            classification = conversation[user].possibilities[1].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[1].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '3':
            classification = conversation[user].possibilities[2].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[2].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '4':
            classification = conversation[user].possibilities[3].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[3].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '5':
            classification = conversation[user].possibilities[4].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[4].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '6':
            classification = conversation[user].possibilities[5].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[5].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '7':
            classification = conversation[user].possibilities[6].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[6].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '8':
            classification = conversation[user].possibilities[7].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[7].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '9':
            classification = conversation[user].possibilities[8].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[8].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          case '10':
            classification = conversation[user].possibilities[9].classification
            msg = "La clasificacion de la carta \'" + conversation[user].possibilities[9].card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            break;
          default:
            if (e.message.isPrivate) {
              msg = 'ERROR, Debes escoger una alternativa de las dadas anteriormente, por ejemplo \"1\".'
            } else {
              msg = 'ERROR, Debes escoger una alternativa de las dadas anteriormente, por ejemplo \"!draft 1\".'
            }
            err = true;
        }
      } catch (e) {
        msg = 'La alternativa ingresada no coincide con ninguna de las alternativas.'
        err = true;
      }
      msg = extraClassification(classification, msg);
      e.message.channel.sendMessage(msg);
      if (!err) {
        conversation[user].bool = false;
      }
    } else {
    if (!name) {
        e.message.channel.sendMessage('Buenas, soy el bot :robot: Tier-Draft para Eternal, puedes preguntar la clasificación de cualquier carta escribiendo \"!draft torch\" por ejemplo.' +
        '\n\nLas clasificación de tier para las cartas van de forma descendente desde S :scream:, hasta A+, A, A-, B+, B, B-, C+, C, C-, D, hasta F (Evita a toda costa elegir estas cartas :joy:)'
      );
    } else {

    let possibilities = {};

    var p1 = new Promise(
        function(resolve, reject) {
          _.map(tier, (array, classification) => {
            _.map(array, (card) => {
              if (card.toLowerCase().indexOf(name.trim().toLowerCase()) !== -1) {
                if (Object.keys(possibilities).length < 10) {
                  possibilities[Object.keys(possibilities).length] = { card, classification };
                }
              }
            });
          });
          if (Object.keys(possibilities).length === 1) {
            let card = possibilities[0].card;
            let classification = possibilities[0].classification;
            msg = "La clasificacion de la carta \'" + card + "\' es: " + classification.replace(/1/gi,'+').replace(/2/gi,'').replace(/3/gi,'-').toUpperCase();
            msg = extraClassification(classification, msg);
            resolve(msg);
          }
          else if (Object.keys(possibilities).length > 1) {
            if (e.message.isPrivate) {
              msg = 'Hay ' + Object.keys(possibilities).length + ' coincidencias con la palabra indicada, elige entre las siguientes opciones escribiendome el numero correspondiente, por ejemplo, \"1\".\n\n';
            } else {
              msg = 'Hay ' + Object.keys(possibilities).length + ' coincidencias con la palabra indicada, elige entre las siguientes opciones escribiendome el numero correspondiente, por ejemplo, \"!draft 1\".\n\n';
            }
            _.map(possibilities, (value, key) => {
                msg = msg + (parseInt(key) + 1).toString() + '.- ' + value.card + '\n';
            });
            conversation[user].bool = true;
            conversation[user].possibilities = possibilities;
            resolve(msg);
          }
          else {
            reject('No se encontró ninguna carta que coincida con \'' + name + '\'')
          }
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

} else if(content.trim() === emotes.kappa) {
  const rng = Math.floor((Math.random() * 5));
  let emote = emotes.pogchamp;
  switch (rng) {
    case 0:
      emote = emotes.kappa;
      break;
    case 1:
      emote = emotes.kappagold;
      break;
    case 2:
      emote = emotes.keepo;
      break;
    case 3:
      emote = emotes.kappahd;
      break;
    case 4:
      emote = emotes.kappapride;
      break;
    default:
      //empty
  }
  e.message.channel.sendMessage(emote);
}
if (content.trim().toLowerCase().indexOf('kappa') !== -1) {
  e.message.addReaction({id: '288704373775663105', name: 'Kappa'});
}

}
}
});

function extraClassification(classification, msg) {
  let extra = msg;
  switch (classification) {
    case 's':
      extra = extra + '\n\n:ok_hand: Mas te vale que elijas esa carta :ok_hand:'
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
      extra = extra + '\n\n:poop: Evita elegir esta carta :poop:'
      break;
    default:
    //empty
  }

  return extra;
}
