import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import express, { query, response, Router } from 'express'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'
import { convertMinutesToHourString } from './utils/convert-minutes-to-hours-string'

const app = express().use(express.json())
app.use(cors())

const prisma = new PrismaClient(
    { log: ['query'] }
)

/**
 * Query:...coisas nao sensiveis, persistir informaćão (sao nomeados)
 * Route:...não são parametros nomeados
 * Body:...enviar varias infos numa unica requisicao (escondido requisicao, mais utilizado info sensiveis)
 */

// HTTP Methods / API Restfull / HTTP Codes

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        // where: { title: "League of Legeds" }
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })
    return response.status(200).json(games)
})

app.post('/games/:gameId/ads', async (request, response) => {
    const gameId = request.params.gameId;
    const body = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            userVoiceChannel: body.userVoiceChannel
        }
    })

    return response.status(201).json(ad)
})

// : => identifica no express que é um parametro de rota
app.get('/ads', (request, response) => {
    return response.status(200).json([])
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            userVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId: gameId
        }, orderBy: {
            createdAt: 'desc'
        }
    })

    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd)
        }
    }))
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const discord = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id: adId
        }
    })

    return response.json({ discord: discord.discord })
})


interface MyInterFace {
    id: string;
    value: number;
}

// function doSomething(myVale : MyInterFace){
//     return myVale = {
//         id: 'some cool id',
//         value: 'romero brito'
//     }
// } testing

app.listen(3333)