import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';

@WebSocketGateway(3002, { cors: { origin: '*' } })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwtService: JwtService,
    @Inject('POSTGRES_POOL') private readonly sql: any,
  ) {
    this.createMessagesTable();
  }

  async createMessagesTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        sender_id VARCHAR(25) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.sql(query);
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        client.disconnect();
        throw new UnauthorizedException('Token not found');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      client.data.user = payload;
      console.log(payload, 'payload');

      const result = await this.sql('SELECT * FROM users WHERE user_id = $1', [
        client.data.user.user_id,
      ]);

      if (result.length === 0) {
        await this.sql(
          'INSERT INTO users (user_id, username) VALUES ($1, $2)',
          [client.data.user.user_id, client.data.user.username],
        );
      }

      console.log('New user connected', client?.data.user.user_id);
      client.broadcast.emit('user-joined', {
        message: `New user joined the chat: ${client?.data.user.user_id}`,
      });
    } catch (err) {
      console.error('Connection rejected: ', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected', client?.data.user?.user_id);

    this.server.emit('user-left', {
      message: `User left the chat: ${client?.data.user?.user_id}`,
    });
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(@MessageBody() message: any, client: Socket) {
    console.log(message);
    const userId = client?.data.user?.user_id;
    const username = client?.data.user?.username;

    const fullMessage = {
      content: message,
      senderId: userId,
      username: username,
    };

    await this.sql(
      'INSERT INTO messages (content, sender_id, created_at) VALUES ($1, $2, NOW())',
      [message || message.content, userId],
    );

    this.server.emit('message', fullMessage);
  }
}
