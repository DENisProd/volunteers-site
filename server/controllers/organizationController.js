const Organization = require("../models/Organization")

class organizationController {
    async getAllByUser(req, res) {
        try {
            Organization.find({contactUser: {_id: req.user.id}}, {
                isEmailConfirmed: 0,
                isTelegramConfirmed: 0
            }).exec(function (err, orgs) {
                if (err) {
                    console.log(err);
                    return res.status(400).send(err);
                } else {
                        return res.status(200).json({
                            orgs
                        })
                }
            })

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Ошибка'})
        }
    }

    async getById(req, res) {
        try {
            if (req.params.id) {
                const orgs = await Organization.findOne({_id: req.params.id}).populate('createdEvents', {
                    presenseLink: 0,
                    fullInfo: 0,
                    helperInfo: 0,
                    isModerated: 0,
                    subscribers: 0
                })
                if (req?.user?.id === orgs.contactUser.toString()) {
                    return res.status(200).json({
                        orgs,
                        isOwner: true
                    })
                }
                return res.status(200).json({
                    orgs
                })
            } else {
                return res.status(400).json({message: "Некорректный запрос"})
            }
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Ошибка'})
        }
    }

    async create(req, res) {
        try {
            const {name, description, location, email, telegram, phone, img} = req.body
            const organizationCandidate = await Organization.findOne({name})
            if (organizationCandidate)
                return res.status(400).json({message: 'Организация с таким названием уже существует'})

            const organization = new Organization({
                name,
                description,
                location,
                email,
                telegram,
                phoneNumber: phone,
                contactUser: req.user.id,
                img: req.file ? req.file.path.replace('uploads\\', '') : ''
            })

            await organization.save()

            return res.status(201).json({message: 'Организация создана'})

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Ошибка'})
        }
    }
}

module.exports = new organizationController()