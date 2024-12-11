const {Card: cardModel} = require('../models/Card');
const CustomError = require('../utils/CustomError');

async function checkEasyId (senderName, receiverName) {
    let easyId = `${senderName}-${receiverName}`.toLowerCase().replace(/\s+/g, '-');

    const cardsWithThisId = await cardModel.find(
        { senderName, receiverName}
    )
    
    if(cardsWithThisId.length !== 0) {
        easyId= `${easyId}-${cardsWithThisId.length}`;
    }
    return easyId;
}

const cardController = {

    create:async(req, res, next) => {
        try {
            let easyId = await checkEasyId(req.body.senderName, req.body.receiverName);
            const picturesSliced = req.body.pictures.slice(0,3);

            const card = {
                easyId,
                title: req.body.title,
                senderName: req.body.senderName,
                receiverName: req.body.receiverName,
                dateMet: req.body.dateMet,
                pictures: picturesSliced,
            };

            const response = await cardModel.create(card);

            res.status(200).json({
                status: 'success',
                data: {
                    easyId: response.easyId
                }
            })
        } catch (error) {
            const err =  new CustomError(error.message, 400)
            next(err);
        }
    },

    getCard:async(req, res, next) => {
        try {
            const id = req.params.id;
            const response = await cardModel.find({easyId: id});

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