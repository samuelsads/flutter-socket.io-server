const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');
const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('AC/DC'));
bands.addBand(new Band('Manowar'));


io.on('connection', client => {

    console.log("Cliente conectado");
    
    client.emit('active-bands',bands.getBands());

    client.on('disconnect', () => {
        console.log("Cliente desconectado");
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!!', payload);
        io.emit('mensaje', { admin: 'nuevo mensaje' });
    });

    client.on('emitir-mensaje', (payload) => {
        console.log(payload);
        client.broadcast.emit('nuevo-mensaje', payload);// emite a todos menos a el mismo
    });

    client.on('vote-band',(payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    client.on('add-band',( payload )=>{
        const newBand  = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands',bands.getBands());
    });

    client.on('delete-band',( payload )=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });
});