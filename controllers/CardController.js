const {Card: cardModel} = require('../models/Card');
const CustomError = require('../utils/CustomError');

async function checkEasyId (senderName, receiverName, passKey) {
    let easyId = `${senderName}-${receiverName}`.toLowerCase().replace(/\s+/g, '-');

    const cardsWithThisId = await cardModel.find(
        { senderName, receiverName}
    )
    
    if(cardsWithThisId.length !== 0) {
        easyId= `${easyId}-${cardsWithThisId.length}`;
    }
    return easyId;
}

function removeNullAttributes(obj) {
    if (Array.isArray(obj)) {
      return obj.map(removeNullAttributes);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, value]) => value !== null) 
          .map(([key, value]) => [key, removeNullAttributes(value)]) 
      );
    }
    return obj; 
  }


function GeneratePassKeys(tam=5) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let senha="";

    for(let i=0; i<tam; i++) {
        let aleatorio = Math.floor(Math.random()*caracteres.length);
        console.log(aleatorio)
        senha += caracteres[aleatorio];
        console.log(caracteres[aleatorio])
    }
    return senha;
}

const cardController = {

    create:async(req, res, next) => {
        try {
            let easyId = await checkEasyId(req.body.senderName, req.body.receiverName, req.body.passKey);
            let passCreated;
            
            console.log("req.body.passKey: ", req.body.passKey)
            if(req.body.passKey) {
                
                passCreated=GeneratePassKeys();
            }

            const picturesSliced = req.body.pictures.slice(0,3);
            
            const card = {
                easyId,
                title: req.body.title,
                senderName: req.body.senderName,
                receiverName: req.body.receiverName,
                dateMet: req.body.dateMet,
                pictures: picturesSliced,
                passKey: passCreated
            };

            const cardNotNull = removeNullAttributes(card)
            console.log(cardNotNull)

            const response = await cardModel.create(cardNotNull);

            res.status(200).json({
                status: 'success',
                data: {
                    easyId: response.easyId,
                    passKey: response.passKey!=null ? response.passKey : null

                }
            })
        } catch (error) {
            console.log(error)
            const err =  new CustomError(error, 400)
            next(err);
        }
    },

    getCard:async(req, res, next) => {
        console.log("Entrou no getCard")
        try {
            const id = req.params.id;
            const ReqPassKey = req.params.passKey;
            const response = await cardModel.find({easyId: id});

            let passKey = response[0].passKey;
            console.log("passKey: ", passKey);
            console.log("ReqPassKey: ", ReqPassKey);


            if(passKey) {
                if(passKey !== ReqPassKey) {
                    console.log("passKey incorreta");
                    res.status(201).json({
                        status: 'pending',
                        data: {
                            about: "PassKey is incorrect."
                        }
                    })
                }
            } 

            if(response.length>0) {
                res.status(200).json({
                    status: 'success',
                    data: {
                        response
                    }
                })
            } else {
                const err =  new CustomError(`Card was not found: ${id}`, 404)
                next(err);
            } 
        } catch (error) {
            const err =  new CustomError(error.message, 400)
            next(err);
        }
    },

    getCardsCount:async(req, res, next) => {
        try {
            const quantity = await cardModel.countDocuments();

            res.status(200).json({
                status: 'success',
                data: {
                    quantity
                }
            })

        } catch (error) {
            const err =  new CustomError(error.message, 400)
            next(err);
        }
    }

};

module.exports = cardController;