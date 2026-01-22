import { inject, Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TokenService } from '../../core/services/token-service';
import { Subject } from 'rxjs';
import { IPresenceEvent } from './model/presence-event.model';
import { PresenceService } from '../../core/services/presence.service';
import { IChatMessage } from './model/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class SocketRepository {
  private tokenService = inject(TokenService);
  private presenceService = inject(PresenceService);

  private client?: Client;
  private baseUrl = 'http://localhost:8080/ws';

  public presence$ = new Subject<IPresenceEvent>();
  public message$ = new Subject<IChatMessage>();

  private createClient(): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.baseUrl),
      connectHeaders: this.buildHeaders(),
      reconnectDelay: 5000,

      onConnect: () => {
        this.subscribePresence();
        this.subscribeInitialPresence();
        this.subscribeMessages();
        setTimeout(() => {
          this.client?.publish({destination: '/app/presence/init'});
        })
      },

      onStompError: (frame) => {
        console.error('❌ STOMP ERROR:', frame.headers['message'], frame.body);
      },

      onWebSocketClose: (event) => {
        console.warn('⚠️ WS CLOSED:', event);
      }
    });

    this.client.activate();
  }

  private buildHeaders() {
    const token = this.tokenService.get();
    if (!token) {
      throw new Error('No JWT token for WebSocket connection');
    }
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private subscribePresence(): void {
    if (!this.client) return;
    this.client.subscribe('/topic/presence', (msg) => {
      const event: IPresenceEvent = JSON.parse(msg.body);
      this.presence$.next(event);
    });
  }

  private subscribeInitialPresence(): void {
    if (!this.client) return;
    this.client.subscribe('/user/queue/presence/init', (msg: IMessage) => {
      const onlineIds: number[] = JSON.parse(msg.body);
      this.presenceService.reset(onlineIds);
    });
  }

  private subscribeMessages(): void {
    if (!this.client) return;
    this.client.subscribe('/user/queue/messages', (msg) => {
      const message = JSON.parse(msg.body);
      this.message$.next(message);
    });
  }

  public connect(): void {
    if (this.client?.active) {
      return;
    }
    this.createClient();
  }

  public disconnect(): void {
    if (!this.client) return;
    this.client.deactivate();
    this.client = undefined;
  }

  public sendMessage(destination: string, body: string) {
    if (!this.client?.connected) {
      console.warn("WS not connnected");
      return;
    }
    this.client.publish({ destination, body });
  }
}