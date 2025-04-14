import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from '../auth/token/token.service';

@WebSocketGateway({
  origin: '*',
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  users = [];

  constructor(private readonly tokenService: TokenService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const authHeader = client.handshake?.headers?.authorization;
    if (!authHeader) {
      throw new WsException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    const verified_data = await this.tokenService.verifyAccessToken(token);
    if (!verified_data) {
      throw new WsException('Unauthorized');
    }

    client.handshake.auth.user = verified_data;
    this.users.push({ client_id: client.id, user_id: verified_data.id });
  }

  @SubscribeMessage('message') async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('message', data);
    return client.data;
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }
}
