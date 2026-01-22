import { signalStore, withState, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { IChatMessage } from '../../infrastructure/webSocket/model/chat-message.model';

interface ChatState {
    messages: Record<number, IChatMessage[]>;
    unread: Record<number, number>;
    activeChatId: number | null,
}

const initialState: ChatState = {
    messages: {},
    unread: {},
    activeChatId: null,
};

export const chatStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        addMessage(contactId: number, message: IChatMessage) {
            const current = store.messages()[contactId] ?? [];
            patchState(store, {
                messages: {
                ...store.messages(),
                [contactId]: [...current, message],
                },
            });
        },

        getMessages(contactId: number): IChatMessage[] {
            return store.messages()[contactId] ?? [];
        },

        clearChat(contactId: number) {
            const copy = { ...store.messages() };
            delete copy[contactId];
            patchState(store, { messages: copy });
        },

        setActiveChat(contactId: number | null) {
            patchState(store, {
                activeChatId: contactId,
                unread: contactId
                ? { ...store.unread(), [contactId]: 0 }
                : store.unread(),
            });
        },

        addIncomingMessage(contactId: number, message: IChatMessage) {
            const messages = store.messages()[contactId] ?? [];
            const isActive = store.activeChatId() === contactId;

            patchState(store, {
                messages: {
                    ...store.messages(),
                    [contactId]: [...messages, message],
                },
                unread: isActive
                    ? store.unread()
                    : {
                        ...store.unread(),
                        [contactId]: (store.unread()[contactId] ?? 0) + 1,
                    },
            });
        },

        addOutgoingMessage(contactId: number, message: IChatMessage) {
            const messages = store.messages()[contactId] ?? [];

            patchState(store, {
                messages: {
                    ...store.messages(),
                    [contactId]: [...messages, message],
                },
            });
        },

        getLastMessage(contactId: number): IChatMessage | null {
            const messages = store.messages()[contactId] ?? [];
            return messages.length ? messages[messages.length - 1] : null;
        },
    })),
);