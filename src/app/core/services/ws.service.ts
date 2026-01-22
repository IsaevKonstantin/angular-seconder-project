import { computed, inject, Injectable } from "@angular/core";
import { SocketRepository } from "../../infrastructure/webSocket/socket.repository";
import { PresenceService } from "./presence.service";
import { userStore } from "../store/user-store";
import { chatStore } from "../store/chat-store";

@Injectable({ providedIn: 'root' })
export class WsService {
    private socketRepo = inject(SocketRepository);
    private presenceService = inject(PresenceService);
    private readonly userStore = inject(userStore);
    private readonly chatStore = inject(chatStore);

    private readonly user = computed(() => this.userStore.user()!);

    private initPresence(): void {
        this.socketRepo.presence$.subscribe(event => {
            this.presenceService.handlePresence(event);
        });
    }

    private initMessages(): void {
        this.socketRepo.message$.subscribe((msg) => {
            const isMine = msg.fromUserId === this.user().id;
            const contactId = isMine ? msg.toUserId : msg.fromUserId;

            if (isMine) {
                this.chatStore.addOutgoingMessage(contactId, msg);
            } else {
                this.chatStore.addIncomingMessage(contactId, msg);
            }
        });
    }

    public init(): void {
        this.socketRepo.connect();
        this.initPresence();
        this.initMessages();
    }

    public destroy(): void {
        this.socketRepo.disconnect();
    }
}