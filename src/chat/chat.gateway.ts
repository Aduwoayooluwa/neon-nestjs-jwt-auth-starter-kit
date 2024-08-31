import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WsException,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  BadRequestException,
  Injectable,
  Inject,
} from '@nestjs/common';

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

  // console.log('')

  // Create the messages table if it doesn't exist
  async createMessagesTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        sender_id VARCHAR(25) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.sql(query).catch((err) =>
      console.error('Error creating messages table: ', err.message),
    );
  }

  // Handle user connections and authenticate them
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        client.disconnect();
        //throw new WsException('Token not found');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!payload) {
        client.disconnect();
        throw new WsException('Invalid token');
      }

      client.data.user = payload;
      console.log('User payload:', payload);

      // Fetch or create user in the database
      const result = await this.sql('SELECT * FROM users WHERE user_id = $1', [
        client.data.user.user_id,
      ]);

      if (result.length === 0) {
        await this.sql(
          'INSERT INTO users (user_id, username) VALUES ($1, $2)',
          [client.data.user.user_id, client.data.user.username],
        );
      }

      console.log('New user connected:', client?.data.user.user_id);
      client.broadcast.emit('user-joined', {
        message: `New user joined the chat: ${client?.data.user.user_id}`,
      });
    } catch (err) {
      console.error('Connection rejected: ', err.message);
      client.disconnect();
      throw new WsException(err.message);
    }
  }

  // Handle user disconnection
  handleDisconnect(client: Socket): void {
    console.log('User disconnected:', client?.data.user?.user_id);

    this.server.emit('user-left', {
      message: `User left the chat: ${client?.data.user?.user_id}`,
    });
  }

  // Handle incoming messages and broadcast them to all connected clients
  @SubscribeMessage('newMessage')
  async handleNewMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    try {
      if (!message || typeof message !== 'string') {
        throw new BadRequestException('Invalid message content');
      }

      const userId = client?.data.user?.user_id;
      const username = client?.data.user?.username;

      if (!userId || !username) {
        throw new UnauthorizedException('User not authenticated');
      }

      const fullMessage = {
        content: message,
        senderId: userId,
        username: username,
      };

      // Save the message to the database
      await this.sql(
        'INSERT INTO messages (content, sender_id, created_at) VALUES ($1, $2, NOW())',
        [message, userId],
      ).catch((err) => {
        console.error('Error saving message: ', err.message);
        throw new WsException('Error saving message to the database');
      });

      this.server.emit('message', fullMessage);
      return { status: 'sent', message: fullMessage };
    } catch (err) {
      console.error('Error handling new message: ', err.message);
      throw new WsException(err.message);
    }
  }
}
