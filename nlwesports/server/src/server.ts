import express from 'express'

const app = express()

app.get('/ads', (request,response) => {
    return response.json([
        {
            id: 1, name: 'Anuncio1',  
        },
        {
            id: 2, name: 'Anuncio2'
        },
        {
            id:3, name: 'Anuncio3'
        },
        {
            id:4, name: 'Anuncio4'
        }
    ])
})

interface MyInterFace{
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