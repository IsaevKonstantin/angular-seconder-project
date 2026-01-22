import { computed, inject, Injectable, signal } from "@angular/core";
import { userStore } from "../../../core/store/user-store";
import { PresenceService } from "../../../core/services/presence.service";
import { IContactWS } from "../../../domain/contact.model";
import { chatStore } from "../../../core/store/chat-store";
import { IChatMessage } from "../../../infrastructure/webSocket/model/chat-message.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class HomeFacade {
    private readonly userStore = inject(userStore);
    private readonly chatStore = inject(chatStore);
    private presenceService = inject(PresenceService);
    private router = inject(Router);

    private readonly _selectedContact = signal<IContactWS | null>(null);

    public readonly user = computed(() => this.userStore.user()!);
    public readonly selectedContact = computed(() => {
        const selected = this._selectedContact();
        if (!selected) return null;
        return {
            ...selected,
            online: this.presenceService.isOnline(selected.id),
            unread: this.chatStore.unread()[selected.id] ?? 0,
        } as IContactWS;
    });
    public readonly isContactsLoading = this.userStore.isContactsLoading;
    public readonly chats = computed<IContactWS[]>(() => {
        const allContacts = this.userStore.contacts();
        const messages = this.chatStore.messages();
        const unread = this.chatStore.unread();
        return allContacts.filter(contact => 
            (messages[contact.id]?.length ?? 0) > 0 || 
            (unread[contact.id] ?? 0) > 0)
            .map(contact => ({
                ...contact,
                online: this.presenceService.isOnline(contact.id),
                unread: unread[contact.id] ?? 0,
            }));
    });
    public readonly friends = computed(() => {
        const arr = this.userStore.friends();
        const arrWithStatus: IContactWS[] = arr.map(contact => ({
            ...contact,
            online: this.presenceService.isOnline(contact.id),
            unread: this.chatStore.unread()[contact.id] ?? 0,
        }));
        return arrWithStatus;
    });
    public readonly subscriptions = computed(() => {
        const arr = this.userStore.subscriptions();
        const arrWithStatus: IContactWS[] = arr.map(contact => ({
            ...contact,
            online: this.presenceService.isOnline(contact.id),
            unread: this.chatStore.unread()[contact.id] ?? 0,
        }));
        return arrWithStatus;
    });
    public readonly subscribers = computed(() => {
        const arr = this.userStore.subscribers();
        const arrWithStatus: IContactWS[] = arr.map(contact => ({
            ...contact,
            online: this.presenceService.isOnline(contact.id),
            unread: this.chatStore.unread()[contact.id] ?? 0,
        }));
        return arrWithStatus;
    });

    public getLastMessage(id: number): IChatMessage | null {
        return this.chatStore.getLastMessage(id);
    }

    public navigateToChat(id: number): void {
        this.router.navigate([`/main/chats`, id]);
    }

    public openContactInfo(contact: IContactWS | null): void {
        this._selectedContact.set(contact);
    }
}