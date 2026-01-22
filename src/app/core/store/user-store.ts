import { computed } from "@angular/core";
import { IContact } from "../../domain/friendship.model";
import { IUser } from "../../domain/user.model";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

interface UserState {
    user: IUser | null,
    contacts: IContact[],
    isContactsLoading: boolean,
}

const initialState: UserState = {
    user: null,
    contacts: [],
    isContactsLoading: false,
}

export const userStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        setUser(user: IUser) {
            patchState(store, { user: user });
        },

        removeUser() {
            patchState(store, { 
                user: null,
                contacts: [],
            });
        },

        setContacts(contacts: IContact[]) {
            patchState(store, {
                contacts: contacts,
            });
        },

        setContactsLoading(isLoading: boolean) {
            patchState(store, { isContactsLoading: isLoading });
        },

        upsertContact(contact: IContact) {
            patchState(store, {
                contacts: [
                    ...store.contacts().filter(c => c.id !== contact.id),
                    contact,
                ],
            });
        },

        removeContact(contactId: number) {
            patchState(store, {
                contacts: store.contacts().filter(c => c.id !== contactId),
            });
        },
    })),
    withComputed((store) => ({
        friends: computed(() =>
            store.contacts().filter(c => c.status === "ACCEPTED"),
        ),

        subscriptions: computed(() => 
            store.contacts().filter(c => c.status === "PENDING" && c.initiatorId === store.user()?.id),
        ),

        subscribers: computed(() => 
            store.contacts().filter(c => c.status === "PENDING" && c.initiatorId !== store.user()?.id),
        ),
    })),
);
