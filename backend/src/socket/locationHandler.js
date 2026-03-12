const { Server } = require('socket.io');
const redis = require('../config/redis');
const supabase = require('../config/supabase');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('[Socket] Client connected:', socket.id);

    // Join a room based on college and bus
    socket.on('join_bus_room', ({ college_id, bus_id, trip_id }) => {
      const room = `college:${college_id}:bus:${bus_id}`;
      socket.join(room);
      console.log(`[Socket] ${socket.id} joined ${room}`);
      
      // Send the latest cached location immediately if trip_id is provided
      if (trip_id) {
        redis.get(`location:${trip_id}`).then(loc => {
          if(loc) {
            socket.emit('bus_location_update', JSON.parse(loc));
          }
        });
      }
    });

    // Driver emits location
    socket.on('driver_location', async (data) => {
      const { college_id, bus_id, trip_id, lat, lng, speed, heading } = data;
      
      const payload = {
        bus_id,
        trip_id,
        lat,
        lng,
        speed,
        heading,
        timestamp: new Date()
      };

      // 1. Broadcast to everyone in the room
      const room = `college:${college_id}:bus:${bus_id}`;
      io.to(room).emit('bus_location_update', payload);

      // 2. Cache in Redis (expires in 30 seconds to clean up inactive buses)
      await redis.setex(`location:${trip_id}`, 30, JSON.stringify(payload));
      
      // 3. Persist to DB periodically (not every tick to save DB load, 
      // but inside this demo we will just do it every 5th tick or asynchronously).
      // Here doing it every time since it's an MVP prototype.
      await supabase.from('gps_locations').insert([payload]);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIo };
