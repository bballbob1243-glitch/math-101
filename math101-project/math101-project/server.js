const express=require('express');const http=require('http');const {Server}=require('socket.io');
const app=express(),server=http.createServer(app),io=new Server(server);app.use(express.static('public'));
const players=new Map();
io.on('connection',s=>{s.on('join',d=>{if(players.size>=15){s.emit('full');return} const p={id:s.id,name:String(d?.name||'Player').slice(0,16),skin:d?.skin||'blue',mode:d?.mode||'battle',x:0,y:1,z:0,hp:100};players.set(s.id,p);s.emit('joined',p);io.emit('players',[...players.values()]);});s.on('state',d=>{const p=players.get(s.id);if(!p)return;Object.assign(p,{x:Number(d.x)||0,y:Number(d.y)||1,z:Number(d.z)||0,hp:Math.max(0,Math.min(100,Number(d.hp)||100)),mode:d.mode||p.mode});s.broadcast.emit('state',p)});s.on('disconnect',()=>{players.delete(s.id);io.emit('left',s.id);io.emit('players',[...players.values()])})});
server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Math 101 running'));
