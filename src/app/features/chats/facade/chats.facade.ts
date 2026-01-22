import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { userStore } from "../../../core/store/user-store";
import { SocketRepository } from "../../../infrastructure/webSocket/socket.repository";
import { IContactWS } from "../../../domain/contact.model";
import { PresenceService } from "../../../core/services/presence.service";
import { Observable, of, switchMap, tap } from "rxjs";
import { IContact } from "../../../domain/friendship.model";
import { FriendsApiRepository } from "../../../infrastructure/friends/friends-api.rrepository";
import { chatStore } from "../../../core/store/chat-store";
import { IChatMessage } from "../../../infrastructure/webSocket/model/chat-message.model";

@Injectable({ providedIn: 'root' })
export class ChatsFacade {
    private readonly userStore = inject(userStore);
    private readonly chatStore = inject(chatStore);
    private socketRepo = inject(SocketRepository);
    private presenceService = inject(PresenceService);
    private friendsApiRep = inject(FriendsApiRepository);

    private readonly _isSearchLoading = signal<boolean>(false);
    private readonly _searchContacts = signal<IContact[]>([]);
    private readonly allContacts = this.userStore.contacts;

    public selectedChat = signal<IContactWS | null>(null);
    public readonly isSearchLoading = this._isSearchLoading.asReadonly();
    public readonly user = computed(() => this.userStore.user()!);
    public readonly isContactsLoading = this.userStore.isContactsLoading;
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
    public readonly searchContacts = computed(() => {
        const arr = this._searchContacts();
        const allIds = this.allContacts().map(contact => contact.id);
        const arrWithStatus: IContactWS[] = arr.map(contact => ({
            ...contact,
            online: this.presenceService.isOnline(contact.id),
            unread: this.chatStore.unread()[contact.id] ?? 0,
        })).filter(c => !allIds.includes(c.id));
        return arrWithStatus;
    });
    public readonly messages = computed(() => {
        const contact = this.selectedChat();
        return contact ? this.chatStore.getMessages(contact.id) : [];
    });
    
    public search(query: string | null): Observable<IContact[]> {
        this._isSearchLoading.set(true);
        return of(query).pipe(
            switchMap(q => {
                if (!q || q.length < 3) return of([]);
                return this.friendsApiRep.getSearchContacts(q);
            }),
            tap(contacts => {
                this._searchContacts.set(contacts);
                this._isSearchLoading.set(false);
            }),
        )
    }

    public add(contact: IContactWS): Observable<IContact> {
        return this.friendsApiRep.postAdd({
            friendId: contact.id,
            status: contact.status
        }).pipe(
            tap(c => this.userStore.upsertContact(c)),
        )
    }

    public approve(contact: IContactWS): Observable<IContact> {
        return this.friendsApiRep.postApprove({
            friendId: contact.id,
            status: contact.status
        }).pipe(
            tap(c => this.userStore.upsertContact(c)),
        )
    }

    public cancel(contact: IContactWS): Observable<IContact> {
        return this.friendsApiRep.postCancel({
            friendId: contact.id,
            status: contact.status
        }).pipe(
            tap(c => this.userStore.removeContact(c.id)),
        )
    }

    public delete(contact: IContactWS): Observable<IContact> {
        return this.friendsApiRep.postDelete({
            friendId: contact.id,
            status: contact.status
        }).pipe(
            tap(c => this.userStore.upsertContact(c)),
        )
    }

    public block(contact: IContactWS): Observable<IContact> {
        return this.friendsApiRep.postBlock({
            friendId: contact.id,
            status: contact.status
        }).pipe(
            tap(c => this.userStore.removeContact(c.id)),
        )
    }

    public selectChat(contact: IContactWS | null): void {
        const selected = this.selectedChat();
        this.chatStore.setActiveChat(contact ? contact.id : null);

        if (selected && contact && selected.id === contact.id) return;

        this.selectedChat.set(contact);
    }

    public ensureContactLoaded(id: number): void {
        const exists = this.allContacts().some(c => c.id === id)
            || this.searchContacts().some(c => c.id === id);

        if (exists) return;

        this.friendsApiRep.getContactById(id).subscribe(contact => {
            this._searchContacts.update(c => [...c, contact]);
        });
    }

    public getContactById(id: number): Signal<IContactWS | null> {
        return computed(() => {
            const all = [...this.allContacts(), ...this.searchContacts()];
            const contact = all.find(c => c.id === id);

            if (!contact) return null;
            return {
                ...contact,
                online: this.presenceService.isOnline(contact.id),
                unread: this.chatStore.unread()[contact.id] ?? 0,
            } as IContactWS;
        })
    }

    public sendMessage(toUserId: number, content: string): void {
        const message = {toUserId, content};
        this.socketRepo.sendMessage(
            '/app/chat.send',
            JSON.stringify(message),
        );
        this.chatStore.addMessage(toUserId, {
            fromUserId: this.user().id,
            toUserId,
            content,
            timestamp: Date.now(),
        });
    }

    public getLastMessage(id: number): IChatMessage | null {
        return this.chatStore.getLastMessage(id);
    }
}